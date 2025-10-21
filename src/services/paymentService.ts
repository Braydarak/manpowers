export interface PaymentRequest {
  amount: number;
  description?: string;
  orderId?: string;
}

export interface PaymentResponse {
  Ds_SignatureVersion: string;
  Ds_MerchantParameters: string;
  Ds_Signature: string;
  orderId: string; // Mantener para referencia interna
}

// Interfaces para inSite
export interface InSitePaymentRequest {
  amount: number;
  description?: string;
  orderId?: string;
  merchantCode: string;
  terminal: string;
  currency?: string;
  transactionType?: string;
}

export interface InSitePaymentResponse {
  operationId: string;
  merchantParameters: string;
  signature: string;
  success: boolean;
  error?: string;
}

export interface InSiteConfig {
  merchantCode: string;
  terminal: string;
  currency: string;
  transactionType: string;
  environment: 'test' | 'production';
}

export interface CartItem {
  id: string;
  name: string;
  price?: number;
  image?: string;
  quantity: number;
}

class PaymentService {
  private baseUrl: string;
  private apiToken: string;
  private isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  private inSiteConfig: InSiteConfig;

  constructor() {
    // Usar proxy en desarrollo, URL directa en el entorno de pruebas/producción
    this.baseUrl = this.isDevelopment ? '/api' : (import.meta.env.VITE_BACKEND_URL || 'https://manpowers.es/test');
    
    // Obtener el token de las variables de entorno
    this.apiToken = import.meta.env.VITE_API_TOKEN;
    
    if (!this.apiToken) {
      console.error('VITE_API_TOKEN no está configurado en las variables de entorno');
      throw new Error('Token de API no configurado. Contacte con el administrador.');
    }

    // Configuración para inSite
    this.inSiteConfig = {
      merchantCode: '367858511', // Tu código de comercio
      terminal: '1',
      currency: '978', // EUR
      transactionType: '0', // Autorización
      environment: this.isDevelopment ? 'test' : 'production'
    };
  }

  /**
   * Carga el script de Redsys para inSite y devuelve una promesa
   */
  loadRedsysScript(): Promise<void> {
    if ((window as Window & { redsysScriptLoadingPromise?: Promise<void> }).redsysScriptLoadingPromise) {
      const cached = (window as Window & { redsysScriptLoadingPromise?: Promise<void> }).redsysScriptLoadingPromise;
      return cached ?? Promise.resolve();
    }

    (window as Window & { redsysScriptLoadingPromise?: Promise<void> }).redsysScriptLoadingPromise = new Promise<void>((resolve, reject) => {
      if ((window as Window & { redsysV3?: unknown }).redsysV3) {
        console.log('PaymentService - El script de Redsys ya estaba cargado.');
        return resolve();
      }

      const script = document.createElement('script');
      script.src = this.inSiteConfig.environment === 'test' 
        ? 'https://sis-t.redsys.es:25443/sis/NC/sandbox/redsysV3.js'
        : 'https://sis.redsys.es/sis/NC/redsysV3.js';
      
      script.onload = () => {
        console.log('PaymentService - Script de Redsys descargado. Verificando disponibilidad...');
        // El script se ha descargado, pero la API puede no estar lista aún.
        // Se verifica repetidamente hasta que `redsysV3` esté disponible.
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if ((window as Window & { redsysV3?: unknown }).redsysV3) {
            clearInterval(interval);
            console.log(`PaymentService - La API de Redsys está lista después de ${attempts} intentos.`);
            resolve();
          } else if (attempts > 50) { // Límite de 5 segundos
            clearInterval(interval);
            console.error('PaymentService - Timeout: La API de Redsys no se inicializó a tiempo.');
            reject(new Error('La API de Redsys no se inicializó a tiempo'));
          }
        }, 100); // Verificar cada 100ms
      };

      script.onerror = () => {
        console.error('PaymentService - Error al cargar el script de Redsys.');
        reject(new Error('Error al cargar el script de Redsys'));
      };
      
      document.head.appendChild(script);
    });

    return (window as Window & { redsysScriptLoadingPromise?: Promise<void> }).redsysScriptLoadingPromise ?? Promise.resolve();
  }

  /**
   * Inicializa el iframe de pago inSite DESPUÉS de obtener los datos del backend
   */
  async initializeInSitePayment(containerId: string, paymentData: PaymentResponse): Promise<string> {
    try {
      // 1. Asegurarse de que el script de Redsys esté cargado
      await this.loadRedsysScript();

      console.log('PaymentService - Inicializando iframe de Redsys con los datos del backend.');

      // 2. Crear el iframe usando la API de Redsys con los datos ya firmados
      return new Promise((resolve, reject) => {
        const redsys = (window as Window & { redsysV3?: unknown }).redsysV3;
        
        if (!redsys) {
          // Esta comprobación es una salvaguarda, pero el await anterior debería prevenirlo
          console.error('Error crítico: La API de Redsys no está disponible después de la carga.');
          reject(new Error('La API de Redsys no está disponible'));
          return;
        }
        
        redsys.startPayment({
          merchantParameters: paymentData.Ds_MerchantParameters,
          signature: paymentData.Ds_Signature,
          signatureVersion: paymentData.Ds_SignatureVersion,
          containerId: containerId,
          onSuccess: (operationId: string) => {
            console.log('InSite - Pago iniciado con éxito. ID de operación:', operationId);
            resolve(operationId);
          },
          onError: (error: { message?: string; code?: string; description?: string }) => {
            console.error('InSite - Error durante la inicialización del iframe:', error);
            reject(new Error(error.message || error.description || 'Error en el proceso de pago'));
          }
        });
      });
    } catch (error) {
      console.error('Error fatal al inicializar el pago inSite:', error);
      throw error;
    }
  }

  /**
   * Procesa el pago usando el ID de operación de inSite
   */
  async processInSitePayment(operationId: string): Promise<InSitePaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/process-insite.php`, {
        method: 'POST',
        mode: this.isDevelopment ? 'cors' : 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Token': this.apiToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ operationId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error procesando pago inSite:', error);
      throw error;
    }
  }

  /**
   * Crea una orden de pago con Redsys (método original para redirección)
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const paymentRequest = {
      ...request,
      amount: Math.round(request.amount * 100) // Convertir a centavos
    };

    const response = await fetch(`${this.baseUrl}/create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Procesa el pago del carrito usando inSite (Flujo completo)
   */
  async processCartPaymentInSite(items: CartItem[], containerId: string): Promise<string> {
    if (items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    console.log('PaymentService - 1. Iniciando proceso de pago inSite para el carrito.');
    
    // Calcular el total y la descripción
    const amount = items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
    const roundedAmount = Math.round(amount * 100) / 100;
    const description = `Pedido MANPOWERS (${items.length} productos)`;
    const orderId = this.generateOrderId();

    if (roundedAmount <= 0) {
      throw new Error('El importe total debe ser mayor que 0');
    }

    try {
      // 2. Llamar al backend para crear el pago y obtener los parámetros firmados
      console.log(`PaymentService - 2. Solicitando parámetros al backend para el pedido ${orderId}`);
      const paymentData = await this.createPayment({
        amount: roundedAmount,
        description,
        orderId,
      });

      console.log('PaymentService - 3. Parámetros recibidos del backend. Procediendo a inicializar el iframe.');
      
      // 4. Inicializar el iframe de Redsys con los datos recibidos
      return this.initializeInSitePayment(containerId, paymentData);

    } catch (error: unknown) {
      console.error('Error en el flujo de pago inSite:', error);
      throw new Error(`Error en el pago inSite: ${(error as Error).message}`);
    }
  }

  /**
   * Procesa el pago del carrito (método original para redirección)
   */
  async processCartPayment(items: CartItem[]): Promise<PaymentResponse> {
    if (items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Debug: Verificar los items recibidos
    console.log('PaymentService - Items recibidos:', items);
    
    // Calcular el total
    const amount = items.reduce((total, item) => {
      const itemPrice = item.price || 0;
      const itemTotal = itemPrice * item.quantity;
      console.log(`Item: ${item.name}, Price: ${itemPrice}, Quantity: ${item.quantity}, Total: ${itemTotal}`);
      return total + itemTotal;
    }, 0);

    console.log('PaymentService - Amount calculado:', amount);

    if (amount <= 0) {
      throw new Error('El importe total debe ser mayor que 0');
    }

    // Crear descripción del pedido
    const description = items.length === 1 
      ? `${items[0].name} x${items[0].quantity}`
      : `Pedido MANPOWERS (${items.length} productos)`;

    // Generar ID de orden único
    const orderId = this.generateOrderId();

    return this.createPayment({
      amount,
      description,
      orderId,
    });
  }

  /**
   * Genera un ID de orden único de 12 dígitos
   */
  private generateOrderId(): string {
    // Redsys requiere exactamente 12 caracteres alfanuméricos
    const timestamp = Date.now().toString().slice(-8); // 8 dígitos del timestamp
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4 dígitos aleatorios
    const orderId = timestamp + random; // 12 caracteres en total
    
    console.log('PaymentService - Generando Order ID:', orderId);
    return orderId;
  }

  /**
   * Redirige al formulario de pago de Redsys
   */
  redirectToPayment(paymentData: PaymentResponse): void {
    // Crear un formulario dinámico para enviar los datos a Redsys
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://sis.redsys.es/sis/realizarPago'; // URL de producción o test según corresponda
    form.style.display = 'none';

    // Añadir los campos necesarios
    const fields = {
      'Ds_SignatureVersion': paymentData.Ds_SignatureVersion,
      'Ds_MerchantParameters': paymentData.Ds_MerchantParameters,
      'Ds_Signature': paymentData.Ds_Signature,
    };

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    // Añadir el formulario al DOM y enviarlo
    document.body.appendChild(form);
    form.submit();
    
    // Limpiar el formulario después de un breve delay
    setTimeout(() => {
      document.body.removeChild(form);
    }, 1000);
  }
}

export const paymentService = new PaymentService();