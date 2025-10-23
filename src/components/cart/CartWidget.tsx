import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, X } from 'lucide-react';

type CartItem = {
  id: string;
  name: string;
  price?: number;
  image?: string;
  quantity: number;
};

const STORAGE_KEY = 'cart';

// Helper function to convert European price format to number
const parsePrice = (price: string | number | undefined): number => {
  if (typeof price === 'number') return isNaN(price) ? 0 : price;
  if (typeof price === 'string') {
    // Convert European format "36,30" to 36.30
    const cleanPrice = price.replace(',', '.').replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleanPrice);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const CartWidget: React.FC<{ className?: string }> = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[] | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'summary' | 'card' | 'processing'>('summary');
  const [currentOrder, setCurrentOrder] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string>('');
  const [redsysLoaded, setRedsysLoaded] = useState(false);
  const [redsysSrc, setRedsysSrc] = useState<string>('');
  const [merchantCode, setMerchantCode] = useState<string>('');
  const [terminal, setTerminal] = useState<string>('');
  const { t } = useTranslation();

  // Cargar carrito desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Permitir añadir al carrito desde otras partes (opcional)
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{
        id: string;
        name: string;
        price?: number;
        image?: string;
        quantity?: number;
        openCart?: boolean;
        openCheckout?: boolean;
        buyNow?: boolean;
      }>;
      const incoming = ce.detail as Omit<CartItem, 'quantity'> & { quantity?: number; openCart?: boolean; openCheckout?: boolean; buyNow?: boolean };
      if (!incoming?.id || !incoming?.name) return;

      const qty = Math.max(1, incoming.quantity ?? 1);
      if (incoming.buyNow) {
        setCheckoutItems([{ id: incoming.id, name: incoming.name, price: incoming.price, image: incoming.image, quantity: qty }]);
      } else {
        setItems((prev) => {
          const existing = prev.find((i) => i.id === incoming.id);
          if (existing) {
            return prev.map((i) => (i.id === incoming.id ? { ...i, quantity: i.quantity + qty } : i));
          }
          return [...prev, { id: incoming.id, name: incoming.name, price: incoming.price, image: incoming.image, quantity: qty }];
        });
      }

      if (incoming.openCart) {
        setOpen(true);
      }
      if (incoming.openCheckout || incoming.buyNow) {
        setCheckoutOpen(true);
      }

      if (!incoming.buyNow) {
        setToastMsg(t('cart.added'));
      }
    };

    window.addEventListener('cart:add', handler as EventListener);
    return () => window.removeEventListener('cart:add', handler as EventListener);
  }, [t]);

  // Ocultar el toast automáticamente
  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(null), 1800);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);
  const checkoutList = checkoutItems ?? items;
  const [subtotal, setSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    const newSubtotal = checkoutList.reduce((acc, i) => acc + (parsePrice(i.price) * i.quantity), 0);
    setSubtotal(newSubtotal);
  }, [checkoutList]);

  useEffect(() => {
    const finalPrice = subtotal * (1 - discount / 100);
    setTotalPrice(finalPrice);
  }, [subtotal, discount]);

  const applyPromoCode = async () => {
    try {
      const response = await fetch('https://manpowers.es/backend/api/promo.php');
      const promos = await response.json();
      if (promos[promoCode]) {
        setDiscount(promos[promoCode]);
        setPromoError("");
      } else {
        setDiscount(0);
        setPromoError("Código de promoción no válido");
      }
    } catch {
      setDiscount(0);
      setPromoError("Error al validar el código de promoción");
    }
  };




  const increment = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)));
  };

  const decrement = (id: string) => {
    setItems((prev) => prev
      .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const resetPaymentState = () => {
    setPaymentStep('summary');
    setPaymentError('');
  };

  // Cargar script de Redsys
  useEffect(() => {
    const loadRedsysScript = () => {
      if (document.getElementById('redsys-script')) {
        setRedsysLoaded(true);
        return;
      }

      if (!redsysSrc) return; // esperar a que backend indique el script

      const script = document.createElement('script');
      script.id = 'redsys-script';
      script.src = redsysSrc;
      script.onload = () => setRedsysLoaded(true);
      script.onerror = () => setPaymentError('Error cargando el sistema de pago');
      document.head.appendChild(script);
    };

    if (checkoutOpen) {
      loadRedsysScript();
    }
  }, [checkoutOpen, redsysSrc]);

  // Listener para capturar el operationId de Redsys
  useEffect(() => {
    const handleRedsysMessage = (event: MessageEvent) => {
       if (typeof window !== 'undefined' && (window as unknown as { storeIdOper: (...args: unknown[]) => void }).storeIdOper) {
         (window as unknown as { storeIdOper: (...args: unknown[]) => void }).storeIdOper(event, 'redsys-token', 'redsys-error', () => true);
        
        const tokenElement = document.getElementById('redsys-token') as HTMLInputElement;
        const errorElement = document.getElementById('redsys-error') as HTMLInputElement;
        
        if (tokenElement?.value) {
          setPaymentStep('processing');
          processPayment(tokenElement.value);
        } else if (errorElement?.value) {
          setPaymentError('Error en el formulario de pago');
        }
      }
    };

    if (paymentStep === 'card') {
      window.addEventListener('message', handleRedsysMessage);
      return () => window.removeEventListener('message', handleRedsysMessage);
    }
  }, [paymentStep]);

  const startCardPayment = async () => {
    try {
      setPaymentError('');
      setPaymentStep('card');

      // Llamar a insiteStart.php para obtener los parámetros
      const response = await fetch('/backend/insiteStart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100).toString() // Convertir a céntimos
        })
      });

      const data = await response.json();
      if (!data.order) {
        throw new Error('Error obteniendo parámetros de pago');
      }

      setCurrentOrder(data.order);
      setRedsysSrc(data.redsysJs);
      setMerchantCode(data.merchantCode);
      setTerminal(data.terminal);

    } catch {
      setPaymentError('Error iniciando el pago');
      setPaymentStep('summary');
    }
  };

  const processPayment = async (opId: string) => {
    try {
      const response = await fetch('/backend/insiteCharge.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationId: opId,
          order: currentOrder,
          amount: Math.round(totalPrice * 100).toString()
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setToastMsg('¡Pago realizado con éxito!');
        if (checkoutItems) {
          setCheckoutItems(null);
        } else {
          clearCart();
        }
        setCheckoutOpen(false);
        resetPaymentState();
      } else {
        setPaymentError(result.message || 'Error procesando el pago');
        setPaymentStep('summary');
      }
    } catch {
      setPaymentError('Error procesando el pago');
      setPaymentStep('summary');
    }
  };

  // Inicializar formulario InSite cuando esté cargado el script y tengamos datos
  useEffect(() => {
    const hasAPI = typeof window !== 'undefined' && (window as unknown as { getInSiteForm: (...args: unknown[]) => void }).getInSiteForm;
    if (paymentStep === 'card' && redsysLoaded && hasAPI && merchantCode && terminal && currentOrder) {
      (window as unknown as { getInSiteForm: (...args: unknown[]) => void }).getInSiteForm(
        'redsys-card-form',
        '', '', '', '', 'Pagar',
        merchantCode,
        terminal,
        currentOrder
      );
    }
  }, [paymentStep, redsysLoaded, merchantCode, terminal, currentOrder]);

  return (
    <div className='m-0'>
      {/* Botón con icono de carrito */}
      <button
        onClick={() => setOpen(true)}
        className="relative bg-black hover:bg-gray-900 text-white py-2 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center"
        aria-label={t('cart.open')}
      >
        <ShoppingCart className="h-6 w-6 text-white" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-black rounded-full text-xs px-1.5 py-0.5 min-w-5 text-center ring-1 ring-black">
            {totalItems}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-[90]" onClick={() => setOpen(false)} />
      )}

      {/* Panel del carrito */}
      <aside
        className={`fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-gradient-to-b from-gray-900 to-black text-white z-[100] shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
        aria-label={t('cart.title')}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">{t('cart.title')}</h2>
          <button onClick={() => setOpen(false)} className="text-gray-300 hover:text-white transition-colors" aria-label={t('cart.close')}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0">
          {items.length === 0 ? (
            <p className="text-gray-300">{t('cart.empty')}</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 bg-gray-800/40 rounded-lg p-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-700 flex items-center justify-center text-xs text-gray-300">{t('cart.noImage')}</div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.name}</span>
                      {item.price !== undefined ? (
                        <span className="text-white font-semibold">€{parsePrice(item.price).toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400 text-sm">{t('cart.noPrice')}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-700 rounded">
                        <button className="px-2 py-1 hover:bg-gray-700" onClick={() => decrement(item.id)} aria-label={t('cart.decreaseQty')}>−</button>
                        <span className="px-3">{item.quantity}</span>
                        <button className="px-2 py-1 hover:bg-gray-700" onClick={() => increment(item.id)} aria-label={t('cart.increaseQty')}>+</button>
                      </div>
                      <button className="text-red-400 hover:text-red-300 text-sm" onClick={() => removeItem(item.id)}>{t('cart.remove')}</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

          <div className="px-5 py-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300">{t('cart.total')}</span>
              <span className="text-2xl font-bold">€{totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex gap-3">
            <button onClick={() => { clearCart(); setOpen(false); setCheckoutOpen(false); }} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-4 py-3 transition-colors">{t('cart.clear')}</button>
              <button
                className="flex-1 bg-white hover:bg-gray-100 text-black font-semibold rounded-lg px-4 py-3 transition-colors"
                onClick={() => setCheckoutOpen(true)}
              >
              {t('cart.checkout')}
              </button>
            </div>
          </div>
      </aside>

      {/* Modal de Checkout */}
      {checkoutOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 z-[110]" onClick={() => { setCheckoutOpen(false); setCheckoutItems(null); resetPaymentState(); }} />
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black text-white rounded-xl shadow-2xl border border-gray-700">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-white">Finalizar Compra</h3>
                <button onClick={() => { setCheckoutOpen(false); setCheckoutItems(null); resetPaymentState(); }} aria-label={t('cart.modal.close')} className="text-gray-300 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-5 py-4 space-y-4">
                {paymentStep === 'summary' && (
                  <>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700">
                      <h4 className="font-semibold mb-2 text-white">Resumen del pedido</h4>
                      <div className="space-y-1 text-sm">
                        {checkoutList.map((item) => {
                          const itemPrice = parsePrice(item.price);
                          const itemTotal = itemPrice * item.quantity;
                          return (
                            <div key={item.id} className="flex justify-between text-gray-300">
                              <span>{item.name} x{item.quantity}</span>
                              <span>€{itemTotal.toFixed(2)}</span>
                            </div>
                          );
                        })}
                        <div className="border-t border-gray-600 pt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>€{subtotal.toFixed(2)}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-400">
                              <span>Descuento:</span>
                              <span>-{discount}%</span>
                            </div>
                          )}
                          <div className="font-semibold flex justify-between text-white">
                            <span>Total:</span>
                            <span>€{totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700">
                      <h4 className="font-semibold mb-2 text-white">Código de Descuento</h4>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Introduce tu código"
                          className="flex-1 bg-gray-700 text-white rounded-md px-3 py-2 text-sm border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button 
                          onClick={applyPromoCode}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-4 py-2 text-sm transition-colors"
                        >
                          Aplicar
                        </button>
                      </div>
                      {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}
                    </div>
                    {paymentError && (
                      <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
                        <p className="text-red-300 text-sm">{paymentError}</p>
                      </div>
                    )}
                  </>
                )}

                {paymentStep === 'card' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700">
                      <h4 className="font-semibold mb-2 text-white">Datos de la tarjeta</h4>
                      <div id="redsys-card-form" className="min-h-[300px]"></div>
                      <input type="hidden" id="redsys-token" />
                      <input type="hidden" id="redsys-error" />
                    </div>
                    <button 
                      onClick={() => setPaymentStep('summary')} 
                      className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg px-4 py-2 transition-all duration-200 border border-gray-600"
                    >
                      Volver
                    </button>
                  </div>
                )}

                {paymentStep === 'processing' && (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Procesando pago...</p>
                  </div>
                )}
              </div>
              
              {paymentStep === 'summary' && (
                <div className="px-5 py-4 border-t border-gray-700 space-y-3">
                  <button 
                    onClick={startCardPayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-3 transition-all duration-200"
                  >
                    Pagar con tarjeta
                  </button>
                  <button 
                     onClick={() => { setCheckoutOpen(false); resetPaymentState(); }} 
                     className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg px-4 py-2 transition-all duration-200 border border-gray-600"
                   >
                     Cerrar
                   </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Toast de confirmación */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-[130]">
          <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg ring-1 ring-white/20">
            {toastMsg}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartWidget;