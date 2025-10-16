import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, X, CreditCard } from 'lucide-react';
import { paymentService } from '../../services/paymentService';

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
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    // Convert European format "36,30" to 36.30
    return parseFloat(price.replace(',', '.')) || 0;
  }
  return 0;
};

const CartWidget: React.FC<{ className?: string }> = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
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
        openCart?: boolean; // opcional: solo abrir si se solicita explícitamente
      }>;
      const incoming = ce.detail as Omit<CartItem, 'quantity'> & { quantity?: number; openCart?: boolean };
      if (!incoming?.id || !incoming?.name) return;

      setItems((prev) => {
        const qty = Math.max(1, incoming.quantity ?? 1);
        const existing = prev.find((i) => i.id === incoming.id);
        if (existing) {
          return prev.map((i) => (i.id === incoming.id ? { ...i, quantity: i.quantity + qty } : i));
        }
        return [
          ...prev,
          {
            id: incoming.id,
            name: incoming.name,
            price: incoming.price,
            image: incoming.image,
            quantity: qty,
          },
        ];
      });

      if (incoming.openCart) {
        setOpen(true);
      }

      // Mostrar toast de producto añadido
      setToastMsg(t('cart.added'));
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
  const totalPrice = useMemo(() => items.reduce((acc, i) => acc + (parsePrice(i.price) * i.quantity), 0), [items]);



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

  const processPayment = async () => {
    if (items.length === 0) {
      setPaymentError('El carrito está vacío');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const paymentData = await paymentService.processCartPayment(items);
      
      // Cerrar el modal de checkout
      setCheckoutOpen(false);
      setOpen(false);
      
      // Redirigir al formulario de pago de Redsys
      paymentService.redirectToPayment(paymentData);
      
      // Limpiar el carrito después del pago exitoso
      clearCart();
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setPaymentError(error instanceof Error ? error.message : 'Error al procesar el pago');
    } finally {
      setIsProcessingPayment(false);
    }
  };

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
          <div className="fixed inset-0 bg-black/70 z-[110]" onClick={() => setCheckoutOpen(false)} />
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black text-white rounded-xl shadow-2xl border border-gray-700">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-white">Finalizar Compra</h3>
                <button onClick={() => setCheckoutOpen(false)} aria-label={t('cart.modal.close')} className="text-gray-300 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-5 py-4 space-y-4">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700">
                  <h4 className="font-semibold mb-2 text-white">Resumen del pedido</h4>
                  <div className="space-y-1 text-sm">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-gray-300">
                        <span>{item.name} x{item.quantity}</span>
                        <span>€{((item.price || 0) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-600 pt-1 font-semibold flex justify-between text-white">
                      <span>Total:</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {paymentError && (
                  <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
                    <p className="text-red-300 text-sm">{paymentError}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Pago con tarjeta (Redsys) */}
                  <button
                    onClick={processPayment}
                    disabled={isProcessingPayment || items.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg px-4 py-3 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <CreditCard className="w-5 h-5" />
                    {isProcessingPayment ? 'Procesando...' : 'Pagar con Tarjeta'}
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  El pago con tarjeta es procesado de forma segura por Redsys
                </p>
              </div>
              
              <div className="px-5 py-4 border-t border-gray-700">
                <button 
                  onClick={() => setCheckoutOpen(false)} 
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg px-4 py-2 transition-all duration-200 border border-gray-600"
                >
                  Cancelar
                </button>
              </div>
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