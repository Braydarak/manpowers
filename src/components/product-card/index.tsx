import React from 'react';
import { useTranslation } from 'react-i18next';
import { type Product } from '../../services/productsService';

type Props = {
  product: Product;
  language: 'es' | 'en';
  onOpen?: (id: number) => void;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  showAmazonLinks?: boolean;
  variant?: 'full' | 'compact';
  className?: string;
};

const ProductCard: React.FC<Props> = ({
  product,
  language,
  onOpen,
  onAddToCart,
  onBuyNow,
  showAmazonLinks = true,
  variant = 'full',
  className,
}) => {
  const { t } = useTranslation();

  const handleOpen = () => {
    onOpen?.(product.id);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow?.(product);
  };

  const name = product.name[language];
  const category = typeof product.category === 'string' ? product.category : product.category?.[language] || '';
  const priceLabel = product.price_formatted || (product.price ? `${product.price} €` : undefined);

  if (variant === 'compact') {
    return (
      <div
        className={`bg-black/30 border border-gray-800 rounded-lg overflow-hidden pc-card ${className || ''}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleOpen();
        }}
      >
        <div className="aspect-square bg-gray-900/40 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = `<span class="text-gray-400 text-xs">${t('sports.imageNot available')}</span>`;
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">{t('sports.imageNot available')}</div>
          )}
        </div>
        <div className="p-3 space-y-1">
          <div className="text-[11px] font-semibold text-yellow-400 uppercase tracking-wide truncate">{category}</div>
          <div className="text-xs font-semibold text-white truncate">{name}</div>
          <div className="text-xs text-gray-300">{priceLabel}</div>
        </div>
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full text-xs font-semibold bg-white text-black rounded-md py-1.5 hover:bg-gray-200"
          >
            {t('sports.addToCart')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-400 transition-all duration-300 hover:transform hover:scale-105 flex flex-col h-full min-h-[500px] cursor-pointer ${className || ''}`}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleOpen();
      }}
    >
      <div className="relative h-64 bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
        {product.size && (
          <span className="absolute top-2 left-2 text-xs bg-black/70 text-white px-2 py-1 rounded-full">{product.size}</span>
        )}
        {priceLabel && (
          <span className="absolute top-2 right-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-bold">{priceLabel}</span>
        )}
        <img
          src={product.image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.innerHTML = `<span class="text-gray-400">${t('sports.imageNot available')}</span>`;
            }
          }}
        />
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide">{category}</span>
            {product.available && (
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">{t('sports.available')}</span>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-3">{name}</h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">{product.description[language]}</p>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          {product.available && showAmazonLinks && product.amazonLinks ? (
            Object.entries(product.amazonLinks).map(([size, link]) => (
              <a
                key={size}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 text-center text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {t('sports.buy')} {size}
              </a>
            ))
          ) : (
            <button
              className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 text-center text-sm"
              disabled={!product.available}
              onClick={handleBuy}
            >
              {product.available ? t('sports.buy') : t('sports.comingSoon')}
            </button>
          )}

          {product.available && (
            <button
              onClick={handleAdd}
              className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-center text-sm"
            >
              {t('sports.addToCart')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;