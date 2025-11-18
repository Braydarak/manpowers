import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import productsService, { type Product } from '../../services/productsService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  language: 'es' | 'en';
  title?: string;
};

type ProductJson = {
  id: number;
  name: { es: string; en: string };
  description: { es: string; en: string };
  price: string | number;
  price_formatted?: string;
  size: string;
  image: string;
  category: { es: string; en: string } | string;
  sportId: string;
  available: boolean;
  sku?: string;
  amazonLinks?: { [key: string]: string };
  nutritionalValues?: { es: string; en: string };
  application?: { es: string; en: string };
  recommendations?: { es: string; en: string };
  rating?: number;
  votes?: number;
};

const AllProducts: React.FC<Props> = ({ language, title }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [canLeft, setCanLeft] = useState<boolean>(false);
  const [canRight, setCanRight] = useState<boolean>(false);
  const [pageWidth, setPageWidth] = useState<number | undefined>(undefined);
  const [perPage, setPerPage] = useState<number>(4);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        let all: Product[] = [];
        try {
          const fetched = await productsService.getProducts();
          all = fetched;
        } catch {
          all = [];
        }
        if (!all || all.length === 0) {
          const response = await fetch('/products.json');
          const data = await response.json();
          all = (data.products as ProductJson[] || []).map((p: ProductJson) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: typeof p.price === 'string' ? parseFloat(p.price.replace(',', '.')) : p.price,
            price_formatted: p.price_formatted ?? '',
            size: p.size,
            image: p.image,
            category: typeof p.category === 'string' ? { es: p.category, en: p.category } : p.category,
            sportId: p.sportId,
            available: p.available,
            sku: p.sku ?? '',
            amazonLinks: p.amazonLinks,
            nutritionalValues: p.nutritionalValues,
            application: p.application,
            recommendations: p.recommendations,
            rating: p.rating,
            votes: p.votes,
          }));
        }
        setItems(all);
        requestAnimationFrame(() => updateArrows());
      } catch {
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateArrows = () => {
    const el = containerRef.current;
    if (!el) {
      setCanLeft(false);
      setCanRight(false);
      return;
    }
    const firstCard = el.querySelector<HTMLElement>('.rp-card');
    const cardWidth = firstCard?.offsetWidth || 256;
    const GAP = 16;
    const pp = window.innerWidth < 768 ? 1 : 4;
    const width = cardWidth * pp + GAP * (pp - 1);
    setPerPage(pp);
    setPageWidth(width);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft > 2;
    const right = el.scrollLeft < maxScroll - 2;
    setCanLeft(left);
    setCanRight(right);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateArrows();
    const onScroll = () => updateArrows();
    const onResize = () => updateArrows();
    el.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [items]);

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>('.rp-card');
    const cardWidth = firstCard?.offsetWidth || 256;
    const GAP = 16;
    const pageDelta = cardWidth * perPage + GAP * (perPage - 1);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = Math.max(0, Math.min(maxScroll, el.scrollLeft + (dir === 'left' ? -pageDelta : pageDelta)));
    el.scrollTo({ left: target, behavior: 'smooth' });
    setTimeout(updateArrows, 350);
  };

  const openDetail = (p: Product) => {
    if (!p?.sportId) return;
    navigate(`/products/${p.sportId}/${p.id}`);
  };

  const addToCart = (p: Product) => {
    const detail = {
      id: String(p.id),
      name: p.name[language],
      price: p.price,
      image: p.image,
      quantity: 1,
    };
    window.dispatchEvent(new CustomEvent('cart:add', { detail }));
  };

  return (
    <div className="relative">
      {(title || '') && (
        <div className="text-2xl md:text-3xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
          {title}
        </div>
      )}
      <div className="flex items-center gap-3">
        {canLeft && (
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollByAmount('left')}
            className="hidden md:inline-flex shrink-0 bg-gray-900/80 border border-gray-800 rounded-full p-2 text-white hover:bg-gray-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div
          ref={containerRef}
          className="overflow-x-auto no-scrollbar mx-auto snap-x snap-mandatory"
          style={pageWidth ? { width: pageWidth } : undefined}
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStartXRef.current = t.clientX;
            touchDeltaXRef.current = 0;
          }}
          onTouchMove={(e) => {
            const t = e.touches[0];
            if (touchStartXRef.current !== null) {
              touchDeltaXRef.current = t.clientX - touchStartXRef.current;
            }
          }}
          onTouchEnd={() => {
            const dx = touchDeltaXRef.current;
            touchStartXRef.current = null;
            touchDeltaXRef.current = 0;
            const TH = 48;
            if (Math.abs(dx) > TH) {
              scrollByAmount(dx > 0 ? 'left' : 'right');
            }
          }}
        >
          <div className="flex gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[220px] bg-gray-900/60 border border-gray-800 rounded-xl p-3 animate-pulse">
                  <div className="h-28 bg-gray-800 rounded" />
                  <div className="h-4 w-3/4 bg-gray-800 rounded mt-3" />
                  <div className="h-4 w-1/2 bg-gray-800 rounded mt-2" />
                </div>
              ))
            ) : error ? (
              <div className="text-sm text-red-400 px-3 py-2">{error}</div>
            ) : items.length === 0 ? (
              <div className="text-sm text-gray-300 px-3 py-2">{t('email.noProducts')}</div>
            ) : (
              items.map((p) => (
                <div
                  key={p.id}
                  onClick={() => openDetail(p)}
                  className="rp-card min-w-[88vw] md:min-w-[256px] bg-gray-900/60 border border-gray-800 rounded-xl p-3 hover:bg-gray-900 transition-colors cursor-pointer snap-center md:snap-start flex flex-col"
                >
                  <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden">
                    <img src={p.image} alt={p.name[language]} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-3 flex-1">
                    <div className="text-sm font-semibold text-white line-clamp-2">{p.name[language]}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {typeof p.category === 'string' ? p.category : p.category[language]}
                    </div>
                    <div className="mt-2 text-base font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                      {p.price_formatted ? p.price_formatted : `€ ${Number(p.price).toFixed(2)}`}
                    </div>
                    {typeof p.rating === 'number' && typeof p.votes === 'number' && p.rating > 0 && p.votes > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {(() => {
                          const r = Number(p.rating || 0);
                          const full = Math.floor(r);
                          const half = r - full >= 0.5;
                          const empty = 5 - full - (half ? 1 : 0);
                          const Star = (props: { key?: number; className?: string }) => (
                            <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.401 8.163L12 18.897l-7.335 3.864 1.401-8.163L.132 9.211l8.2-1.193z"/>
                            </svg>
                          );
                          return (
                            <>
                              {Array.from({ length: full }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400" />
                              ))}
                              {half && (
                                <span className="relative w-4 h-4 inline-block">
                                  <Star className="w-4 h-4 text-gray-500" />
                                  <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                                    <Star className="w-4 h-4 text-yellow-400" />
                                  </span>
                                </span>
                              )}
                              {Array.from({ length: empty }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-gray-500" />
                              ))}
                            </>
                          );
                        })()}
                        <span className="text-xs text-gray-400">({p.votes})</span>
                      </div>
                    )}
                  </div>
                  {p.available && (
                    <div className="mt-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                        className="w-full bg-black hover:bg-gray-900 text-white font-bold py-2 px-3 rounded-lg border border-gray-800 transition-all duration-300"
                      >
                        {t('sports.addToCart')}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        {canRight && (
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollByAmount('right')}
            className="hidden md:inline-flex shrink-0 bg-gray-900/80 border border-gray-800 rounded-full p-2 text-white hover:bg-gray-800"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AllProducts;