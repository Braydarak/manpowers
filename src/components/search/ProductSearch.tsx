import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import productsService, { type Product } from "../../services/productsService";
import { Search } from "lucide-react";

type Suggestion = Product & { score: number };
type ProductJson = {
  id: number;
  name: { es: string; en: string };
  description: { es: string; en: string };
  objectives?: { es: string[]; en: string[] };
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

const ProductSearch: React.FC<{ className?: string; fullScreen?: boolean; onClose?: () => void; autoFocus?: boolean }> = ({ className, fullScreen, onClose, autoFocus }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const baseLang = i18n.resolvedLanguage?.split('-')[0] || i18n.language?.split('-')[0] || 'es';
  const lang: 'es' | 'en' | 'ca' = baseLang === 'en' ? 'en' : baseLang === 'ca' ? 'ca' : 'es';
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [all, setAll] = useState<Product[]>([]);
  const [highlight, setHighlight] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        let items: Product[] = [];
        try {
          items = await productsService.getProducts();
        } catch {
          items = [];
        }
        if (!items || items.length === 0) {
          const r = await fetch("/products.json");
          const data = await r.json();
          items = (data.products as ProductJson[] || []).map((p: ProductJson) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            objectives: p.objectives,
            price: typeof p.price === "string" ? parseFloat(p.price.replace(",", ".")) : p.price,
            price_formatted: p.price_formatted ?? "",
            size: p.size,
            image: p.image,
            category: typeof p.category === "string" ? { es: p.category, en: p.category } : p.category,
            sportId: p.sportId,
            available: p.available,
            sku: p.sku ?? "",
            amazonLinks: p.amazonLinks,
            nutritionalValues: p.nutritionalValues,
            application: p.application,
            recommendations: p.recommendations,
            rating: p.rating,
            votes: p.votes,
          }));
        }
        if (mounted) setAll(items);
      } catch {
        setError("No se pudieron cargar productos");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const c = containerRef.current;
      if (!c) return;
      if (!c.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestions: Suggestion[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const items = [...all];
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
      }
      return items.slice(0, 4).map((p) => ({ ...p, score: 0 }));
    }
    const tokens = q.split(/\s+/).filter(Boolean);
    const scored = all.map((p) => {
      const name = (p.name?.[lang] || p.name?.es || '').toLowerCase();
      const desc = (p.description?.[lang] || p.description?.es || '').toLowerCase();
      const cat = String(typeof p.category === "string" ? p.category : (p.category?.[lang] || p.category?.es || "")).toLowerCase();
      let s = 0;
      for (const tkn of tokens) {
        if (name.includes(tkn)) s += 5;
        if (desc.includes(tkn)) s += 2;
        if (cat.includes(tkn)) s += 1;
      }
      if (name.startsWith(q)) s += 3;
      return { ...p, score: s } as Suggestion;
    })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score || (a.name[lang] || a.name.es).localeCompare(b.name[lang] || b.name.es));
    return scored.slice(0, 8);
  }, [query, all, lang]);

  const onSelect = (p: Product) => {
    setOpen(false);
    setQuery("");
    const toSlug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
    const slug = toSlug(p.name[lang] || p.name.es);
    if (p.sportId) navigate(`/products/${p.sportId}/${slug}`);
    else navigate(`/product/${slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) setOpen(true);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (highlight >= 0 && suggestions[highlight]) onSelect(suggestions[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[200] bg-gradient-to-b from-gray-900 to-black">
        <div className="p-4 flex items-center gap-3 border-b border-gray-800">
          <Search className="w-5 h-5 text-gray-300" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlight(-1); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose?.();
              onKeyDown(e);
            }}
            placeholder={t('search.placeholder')}
            className="bg-gray-800/60 border border-gray-700 rounded-full px-4 py-2 text-sm w-full placeholder:text-gray-400 outline-none"
            autoFocus={autoFocus}
          />
          <button
            type="button"
            onClick={() => onClose?.()}
            aria-label={t('cart.modal.close')}
            className="ml-2 text-gray-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto scrollbar-thin">
          {loading && <div className="px-4 py-3 text-sm text-gray-300">{t('search.loading')}</div>}
          {error && !loading && <div className="px-4 py-3 text-sm text-red-400">{error}</div>}
          {!loading && !error && (
            <div>
              <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide">{t('search.suggestions')}</div>
              {suggestions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-300">{t('search.noResults')}</div>
              ) : (
                <ul role="listbox">
                  {suggestions.map((p, i) => {
                    const name = p.name[lang] || p.name.es;
                    const cat = typeof p.category === "string" ? p.category : (p.category?.[lang] || p.category?.es || "");
                    const active = i === highlight;
                    return (
                      <li
                        key={`${p.id}-${i}`}
                        role="option"
                        aria-selected={active}
                        onMouseEnter={() => setHighlight(i)}
                        onMouseLeave={() => setHighlight(-1)}
                        onClick={() => onSelect(p)}
                        className={`cursor-pointer px-4 py-3 flex items-center gap-3 ${active ? "bg-white/10" : "hover:bg-white/5"}`}
                      >
                        <div className="w-12 h-12 rounded bg-gray-900 overflow-hidden flex items-center justify-center">
                          {p.image ? (
                            <img src={p.image} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs">{t('sports.imageNot available')}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">{name}</div>
                          <div className="text-xs text-gray-400 truncate">{cat}</div>
                        </div>
                        {p.price_formatted && (
                          <div className="text-xs text-gray-300 whitespace-nowrap">{p.price_formatted}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-t border-gray-800">{t('allProducts.title')}</div>
              <ul role="listbox">
                {all.map((p, i) => {
                  const name = p.name[lang] || p.name.es;
                  const cat = typeof p.category === "string" ? p.category : (p.category?.[lang] || p.category?.es || "");
                  return (
                    <li
                      key={`all-${p.id}-${i}`}
                      role="option"
                      onClick={() => onSelect(p)}
                      className="cursor-pointer px-4 py-3 flex items-center gap-3 hover:bg-white/5"
                    >
                      <div className="w-12 h-12 rounded bg-gray-900 overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          <img src={p.image} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-xs">{t('sports.imageNot available')}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{name}</div>
                        <div className="text-xs text-gray-400 truncate">{cat}</div>
                      </div>
                      {p.price_formatted && (
                        <div className="text-xs text-gray-300 whitespace-nowrap">{p.price_formatted}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <div className="flex items-center bg-gray-800 border border-gray-700 rounded-full px-3 py-2 w-64 md:w-80 focus-within:ring-2 focus-within:ring-white/20">
        <Search className="w-4 h-4 text-gray-300 mr-2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlight(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={t('search.placeholder')}
          className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
        />
      </div>
      {open && (
        <div className="absolute left-0 mt-2 w-[22rem] md:w-[26rem] bg-black/90 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl z-50">
          <div className="px-3 py-2 text-xs text-gray-400 uppercase tracking-wide">{t('search.suggestions')}</div>
          {loading && <div className="px-4 py-3 text-sm text-gray-300">{t('search.loading')}</div>}
          {error && !loading && <div className="px-4 py-3 text-sm text-red-400">{error}</div>}
          {!loading && !error && suggestions.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-300">{t('search.noResults')}</div>
          )}
          {!loading && !error && suggestions.length > 0 && (
            <ul role="listbox" className="max-h-80 overflow-auto scrollbar-thin">
              {suggestions.map((p, i) => {
                const name = p.name[lang];
                const cat = typeof p.category === "string" ? p.category : (p.category?.[lang] || "");
                const active = i === highlight;
                return (
                  <li
                    key={`${p.id}-${i}`}
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setHighlight(i)}
                    onMouseLeave={() => setHighlight(-1)}
                    onClick={() => onSelect(p)}
                    className={`cursor-pointer px-3 py-2 flex items-center gap-3 ${active ? "bg-white/10" : "hover:bg-white/5"}`}
                  >
                    <div className="w-10 h-10 rounded bg-gray-900 overflow-hidden flex items-center justify-center">
                      {p.image ? (
                        <img src={p.image} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-xs">{t('sports.imageNot available')}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{name}</div>
                      <div className="text-xs text-gray-400 truncate">{cat}</div>
                    </div>
                    {p.price_formatted && (
                      <div className="text-xs text-gray-300 whitespace-nowrap">{p.price_formatted}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {!loading && !error && (
            <>
              <div className="px-3 py-2 text-xs text-gray-400 uppercase tracking-wide border-t border-gray-800">{t('allProducts.title')}</div>
              <ul role="listbox" className="max-h-80 overflow-auto scrollbar-thin">
                {all.map((p, i) => {
                  const name = p.name[lang];
                  const cat = typeof p.category === "string" ? p.category : (p.category?.[lang] || "");
                  return (
                    <li
                      key={`all-${p.id}-${i}`}
                      role="option"
                      onClick={() => onSelect(p)}
                      className="cursor-pointer px-3 py-2 flex items-center gap-3 hover:bg-white/5"
                    >
                      <div className="w-10 h-10 rounded bg-gray-900 overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          <img src={p.image} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-xs">{t('sports.imageNot available')}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{name}</div>
                        <div className="text-xs text-gray-400 truncate">{cat}</div>
                      </div>
                      {p.price_formatted && (
                        <div className="text-xs text-gray-300 whitespace-nowrap">{p.price_formatted}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;