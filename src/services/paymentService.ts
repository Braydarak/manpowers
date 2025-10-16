export interface PaymentRequest {
  amount: number;
  description?: string;
  orderId?: string;
}

export interface PaymentResponse {
  url: string;
  signatureVersion: string;
  merchantParameters: string;
  signature: string;
  orderId: string;
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

  constructor() {
    // Usar proxy en desarrollo, URL directa en producción
    this.baseUrl = this.isDevelopment ? '/api' : `${import.meta.env.VITE_BACKEND_URL || 'https://manpowers.es/backend'}/api`;
    
    // Obtener el token de las variables de entorno
    this.apiToken = import.meta.env.VITE_API_TOKEN;
    
    if (!this.apiToken) {
      console.error('VITE_API_TOKEN no está configurado en las variables de entorno');
      throw new Error('Token de API no configurado. Contacte con el administrador.');
    }
  }

  /**
   * Crea una orden de pago con Redsys
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentRequest = {
        ...request,
        amount: Math.round(request.amount * 100) // Convertir a centavos
      };

      const response = await fetch(`${this.baseUrl}/create.php`, {
        method: 'POST',
        mode: this.isDevelopment ? 'cors' : 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Token': this.apiToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      // Si hay error CORS en desarrollo, intentar con un enfoque alternativo
      if (this.isDevelopment && error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Error CORS detectado, intentando método alternativo...');
        return this.createPaymentAlternative(request);
      }
      throw error;
    }
  }

  /**
   * Método alternativo para desarrollo cuando hay problemas CORS
   */
  private async createPaymentAlternative(request: PaymentRequest): Promise<PaymentResponse> {
    // Simular respuesta para desarrollo cuando hay problemas CORS
    console.warn('Usando modo de simulación para desarrollo debido a problemas CORS');
    
    const orderId = this.generateOrderId();
    
    // En un entorno real, esto debería redirigir a una página de configuración
    // o mostrar un mensaje al usuario sobre la configuración del servidor
    return {
      url: 'https://sis.redsys.es/sis/realizarPago',
      signatureVersion: 'HMAC_SHA256_V1',
      merchantParameters: btoa(JSON.stringify({
        DS_MERCHANT_AMOUNT: Math.round(request.amount * 100).toString(),
        DS_MERCHANT_ORDER: orderId,
        DS_MERCHANT_MERCHANTCODE: '367858511',
        DS_MERCHANT_CURRENCY: '978',
        DS_MERCHANT_TRANSACTIONTYPE: '0',
        DS_MERCHANT_TERMINAL: '1',
        DS_MERCHANT_MERCHANTURL: 'https://manpowers.es/backend/api/notify.php',
        DS_MERCHANT_URLOK: 'https://manpowers.es/backend/api/success.php',
        DS_MERCHANT_URLKO: 'https://manpowers.es/backend/api/failure.php',
        DS_MERCHANT_CONSUMERLANGUAGE: '001',
        DS_MERCHANT_PRODUCTDESCRIPTION: request.description || 'Pedido MANPOWERS'
      })),
      signature: 'DEV_MODE_SIGNATURE',
      orderId: orderId
    };
  }

  /**
   * Procesa el pago del carrito
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
    const timestamp = Date.now().toString().slice(-8); // Últimos 8 dígitos del timestamp
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4 dígitos aleatorios
    return timestamp + random;
  }

  /**
   * Redirige al formulario de pago de Redsys
   */
  redirectToPayment(paymentData: PaymentResponse): void {
    // Crear un formulario dinámico para enviar los datos a Redsys
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentData.url;
    form.style.display = 'none';

    // Añadir los campos necesarios
    const fields = {
      'Ds_SignatureVersion': paymentData.signatureVersion,
      'Ds_MerchantParameters': paymentData.merchantParameters,
      'Ds_Signature': paymentData.signature,
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