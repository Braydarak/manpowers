// Tipos para la API de Redsys inSite
interface RedsysError {
  message?: string;
  code?: string;
  description?: string;
}

// Interfaz para la API de Redsys V3
interface RedsysV3 {
  startPayment: (config: {
    merchantParameters: string;
    signature: string;
    signatureVersion: string;
    containerId: string;
    onSuccess: (operationId: string) => void;
    onError: (error: RedsysError) => void;
  }) => void;
}

declare global {
  interface Window {
    redsysV3?: RedsysV3;
    redsysScriptLoadingPromise?: Promise<void>;
  }
}

export {};