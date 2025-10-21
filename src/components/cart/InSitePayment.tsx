import React, { useEffect, useRef, useState } from 'react';
import { paymentService } from '../../services/paymentService';

type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

interface InSitePaymentResponse {
  operationId: string;
  merchantParameters: string;
  signature: string;
  success: boolean;
  error?: string;
}

interface InSitePaymentProps {
  items: CartItem[];
  onSuccess: (response: InSitePaymentResponse) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const InSitePayment: React.FC<InSitePaymentProps> = ({
  items,
  onSuccess,
  onError,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);
  const paymentContainerRef = useRef<HTMLDivElement>(null);
  const containerId = 'redsys-insite-container';

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      setIsLoading(true);
      
      // Inicializar el iframe de pago inSite
      const opId = await paymentService.processCartPaymentInSite(items, containerId);
      setOperationId(opId);
      setIsLoading(false);
      
      console.log('InSite Payment - Iframe inicializado, ID de operación:', opId);
    } catch (error) {
      console.error('Error inicializando pago inSite:', error);
      setIsLoading(false);
      onError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!operationId) {
      onError('No se ha generado un ID de operación válido');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Procesar el pago con el ID de operación
      const response = await paymentService.processInSitePayment(operationId);
      
      if (response.success) {
        onSuccess(response);
      } else {
        onError(response.error || 'Error en el procesamiento del pago');
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      onError(error instanceof Error ? error.message : 'Error procesando el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemPrice = item.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto p-5 border border-gray-300 rounded-lg bg-white">
        <div className="text-center py-10 px-5">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-5"></div>
          <p className="text-gray-600">Cargando formulario de pago seguro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-5 border border-gray-300 rounded-lg bg-white shadow-lg">
      {/* Header del pago */}
      <div className="text-center mb-5 pb-4 border-b border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Pago Seguro</h3>
        <p className="text-gray-600">
          Total a pagar: <strong className="text-lg">{calculateTotal().toFixed(2)} €</strong>
        </p>
      </div>

      {/* Contenedor para el iframe de Redsys */}
      <div 
        id={containerId}
        ref={paymentContainerRef}
        className="min-h-[300px] my-5 border border-gray-300 rounded bg-gray-50 relative"
      >
        {/* El iframe se insertará aquí automáticamente por Redsys */}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 my-5">
        <button 
          onClick={handlePaymentConfirmation}
          disabled={isProcessing || !operationId}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-5 rounded transition-colors duration-200"
        >
          {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
        </button>
        
        <button 
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 px-5 rounded transition-colors duration-200"
        >
          Cancelar
        </button>
      </div>

      {/* Información de seguridad */}
      <div className="text-center mt-5 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-1">
          🔒 Pago 100% seguro con tecnología Redsys
        </p>
        <p className="text-sm text-gray-600">
          Tus datos de tarjeta están protegidos y no son almacenados en nuestros servidores
        </p>
      </div>
    </div>
  );
};

export default InSitePayment;