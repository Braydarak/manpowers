import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Product } from '../../services/productsService';

type Props = {
  currentId: number;
  sportId: string;
  language: 'es' | 'en';
};

const RecommendedTogether: React.FC<Props> = ({ currentId, sportId, language }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/products.json');
        const data = await response.json();
        const arr = (data.products as Product[]).map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: typeof p.price === 'string' ? parseFloat((p.price as string).replace(',', '.')) : p.price,
          price_formatted: p.price_formatted ?? '',
          size: p.size,
          image: p.image,
          category: typeof p.category === 'string' ? { es: p.category, en: p.category } : p.category,
          sportId: p.sportId,
          available: p.available,
          sku: p.sku ?? '',
        })) as Product[];
        const baseSport = String(sportId || '').toLowerCase().trim();
        const filtered = arr
          .filter((p) => String(p.sportId || '').toLowerCase().trim() === baseSport && p.id !== currentId)
          .slice(0, 3);
        setItems(filtered);
        setSelected(new Set());
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentId, sportId]);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const addSelected = () => {
    items.forEach((p) => {
      if (!selected.has(p.id)) return;
      const detail = {
        id: String(p.id),
        name: typeof p.name === 'string' ? p.name : p.name[language],
        price: p.price,
        image: p.image,
        quantity: 1,
      };
      window.dispatchEvent(new CustomEvent('cart:add', { detail }));
    });
  };

  if (loading || items.length === 0) return null;

  const total = items.reduce((sum, p) => (selected.has(p.id) ? sum + (p.price || 0) : sum), 0);

  return (
    <div>
      <div className="flex flex-col items-center space-y-3">
        {items.map((p) => (
          <div key={p.id} className="bg-gray-900/60 border border-gray-800 rounded-lg p-4 flex items-center gap-5 w-full md:w-2/3 lg:w-1/2 mx-auto justify-center">
            <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} className="accent-yellow-500 w-6 h-6 md:w-7 md:h-7" />
            <div className="w-20 h-20 bg-black rounded overflow-hidden">
              <img src={p.image} alt={typeof p.name === 'string' ? p.name : p.name[language]} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center">
              <div className="text-base md:text-lg font-semibold line-clamp-2">{typeof p.name === 'string' ? p.name : p.name[language]}</div>
              <div className="text-xs md:text-sm text-gray-400">{p.size}</div>
            </div>
            <div className="text-base md:text-lg font-bold">{p.price ? `€ ${Number(p.price).toFixed(2)}` : ''}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-col items-center gap-3">
        <div className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
          {t('recommendedTogether.total')}: {`€ ${total.toFixed(2)}`}
        </div>
        <button
          onClick={addSelected}
          disabled={selected.size === 0}
          className={`w-full md:w-1/2 font-bold rounded-xl shadow-lg ${selected.size === 0 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-400'} px-8 py-4 text-lg md:text-xl`}
        >
          {t('sports.addToCart')}
        </button>
      </div>
    </div>
  );
};

export default RecommendedTogether;