import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';

type CartItem = {
  id: string;
  name: string;
  price?: number;
  image?: string;
  quantity: number;
};

const STORAGE_KEY = 'cart';

const CartWidget: React.FC<{ className?: string }> = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

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
      }>;
      const incoming = ce.detail as Omit<CartItem, 'quantity'> & { quantity?: number };
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
      setOpen(true);
    };

    window.addEventListener('cart:add', handler as EventListener);
    return () => window.removeEventListener('cart:add', handler as EventListener);
  }, []);

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((acc, i) => acc + (i.price ? i.price * i.quantity : 0), 0), [items]);

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

  return (
    <div className='m-0'>
      {/* Botón con icono de carrito */}
      <button
        onClick={() => setOpen(true)}
        className="relative bg-black hover:bg-gray-900 text-white py-2 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center"
        aria-label="Abrir carrito"
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
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Tu carrito</h2>
          <button onClick={() => setOpen(false)} className="text-gray-300 hover:text-white transition-colors" aria-label="Cerrar carrito">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0">
          {items.length === 0 ? (
            <p className="text-gray-300">Tu carrito está vacío.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 bg-gray-800/40 rounded-lg p-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-700 flex items-center justify-center text-xs text-gray-300">Sin imagen</div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.name}</span>
                      {item.price !== undefined ? (
                        <span className="text-white font-semibold">€{(item.price ?? 0).toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin precio</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-700 rounded">
                        <button className="px-2 py-1 hover:bg-gray-700" onClick={() => decrement(item.id)} aria-label="Disminuir cantidad">−</button>
                        <span className="px-3">{item.quantity}</span>
                        <button className="px-2 py-1 hover:bg-gray-700" onClick={() => increment(item.id)} aria-label="Aumentar cantidad">+</button>
                      </div>
                      <button className="text-red-400 hover:text-red-300 text-sm" onClick={() => removeItem(item.id)}>Quitar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300">Total</span>
            <span className="text-2xl font-bold">€{totalPrice.toFixed(2)}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={clearCart} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-4 py-3 transition-colors">Vaciar</button>
            <button
              className="flex-1 bg-white hover:bg-gray-100 text-black font-semibold rounded-lg px-4 py-3 transition-colors"
              onClick={() => {
                alert('Proceder al pago (pendiente de integrar).');
              }}
            >
              Pagar
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CartWidget;