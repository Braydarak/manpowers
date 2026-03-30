import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type Product } from "../../services/productsService";

type Props = {
  product: Product;
  language: "es" | "en" | "ca";
  onOpen?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  showAmazonLinks?: boolean;
  variant?: "full" | "compact";
  className?: string;
};

const CARD_IMAGE_ASSETS = import.meta.glob("/src/assets/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const folderImageCache = new Map<string, Array<{ path: string; url: string }>>();

const listCardImages = (folder?: string, preferred?: string) => {
  const list: Array<{ path: string; url: string }> = [];
  if (folder) {
    const cached = folderImageCache.get(folder);
    if (cached) {
      list.push(...cached);
    } else {
      const entries = Object.entries(CARD_IMAGE_ASSETS)
        .filter(([p]) => p.includes(`/src/assets/${folder}/`))
        .map(([path, url]) => ({ path, url }))
        .sort((a, b) => a.path.localeCompare(b.path));
      folderImageCache.set(folder, entries);
      list.push(...entries);
    }
  }

  if (preferred) {
    const desiredName = preferred.split("/").pop() || "";
    if (desiredName) {
      const idx = list.findIndex((m) => (m.path.split("/").pop() || "") === desiredName);
      if (idx > 0) {
        const [item] = list.splice(idx, 1);
        list.unshift(item);
      } else if (idx === -1) {
        list.unshift({ path: preferred, url: preferred });
      }
    } else if (!list.length) {
      list.unshift({ path: preferred, url: preferred });
    }
  }

  return list.map((m) => m.url).filter((u): u is string => typeof u === "string" && u.length > 0);
};

const ProductCard: React.FC<Props> = ({
  product,
  language,
  onOpen,
  onAddToCart,
  onBuyNow,
  showAmazonLinks = true,
  variant = "full",
  className,
}) => {
  const { t } = useTranslation();

  const handleOpen = () => {
    onOpen?.(product);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow?.(product);
  };

  const name = product.name[language] || product.name.es;
  const category =
    typeof product.category === "string"
      ? product.category
      : product.category?.[language] || product.category?.es || "";
  const hasDiscount =
    typeof product.discount_price === "number" &&
    Number.isFinite(product.discount_price);
  const discountedPrice =
    typeof product.discount_price === "number" &&
    Number.isFinite(product.discount_price)
      ? product.discount_price
      : undefined;
  const basePrice =
    typeof product.price === "number" && Number.isFinite(product.price)
      ? product.price
      : undefined;
  const finalPrice = discountedPrice ?? basePrice;
  const apiOriginal =
    typeof product.original_price === "number" &&
    Number.isFinite(product.original_price)
      ? product.original_price
      : undefined;
  const candidateOriginal = apiOriginal ?? basePrice;
  const showOriginal =
    hasDiscount &&
    candidateOriginal !== undefined &&
    finalPrice !== undefined &&
    candidateOriginal > finalPrice + 0.0001;
  const priceLabel = hasDiscount
    ? finalPrice !== undefined
      ? `${finalPrice.toFixed(2)} €`
      : undefined
    : product.price_formatted || (finalPrice ? `${finalPrice} €` : undefined);

  const cardImages = useMemo(
    () => listCardImages(product.img_folder, product.image),
    [product.img_folder, product.image],
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImageSrc = cardImages[activeImageIndex] || product.image;
  const hasCarousel = cardImages.length > 1;

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasCarousel) return;
    setActiveImageIndex((i) => (i - 1 + cardImages.length) % cardImages.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasCarousel) return;
    setActiveImageIndex((i) => (i + 1) % cardImages.length);
  };

  if (variant === "compact") {
    return (
      <div
        className={`bg-[var(--color-primary)] border border-black/10 rounded-lg overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] pc-card ${className || ""}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleOpen();
        }}
      >
        <div className="relative aspect-square bg-[var(--color-primary)] flex items-center justify-center overflow-hidden border-b border-black/5 group">
          {activeImageSrc ? (
            <img
              src={activeImageSrc}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                if (hasCarousel && cardImages.length > 0) {
                  const next = (activeImageIndex + 1) % cardImages.length;
                  if (next !== activeImageIndex) {
                    setActiveImageIndex(next);
                    return;
                  }
                }
                target.style.display = "none";
                if (target.parentElement)
                  target.parentElement.innerHTML = `<span class="text-gray-400 text-xs">${t("sports.imageNot available")}</span>`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black/40 text-xs">
              {t("sports.imageNot available")}
            </div>
          )}
          {hasCarousel && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Siguiente"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ›
              </button>
            </>
          )}
          {!product.available && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {t("products.outOfStock") || "Agotado"}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[11px] font-semibold text-[var(--color-secondary)] uppercase tracking-wide truncate">
              {category}
            </div>
            {hasDiscount && (
              <span className="text-[10px] bg-[var(--color-secondary)] text-white px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                {t("product.clearance")}
              </span>
            )}
          </div>
          <div className="text-xs font-semibold text-black truncate">
            {name}
          </div>
          {hasDiscount ? (
            <div className="text-xs text-black/70 flex items-center gap-2">
              {showOriginal && candidateOriginal !== undefined && (
                <span className="line-through text-black/40">
                  {candidateOriginal.toFixed(2)} €
                </span>
              )}
              {finalPrice !== undefined && (
                <span className="text-[var(--color-secondary)] font-bold">
                  {finalPrice.toFixed(2)} €
                </span>
              )}
              <span className="text-[10px] text-gray-400 ml-1">+ IVA</span>
            </div>
          ) : (
            <div className="text-xs text-black/70 flex items-center">
              {priceLabel}
              {priceLabel && (
                <span className="text-[10px] text-gray-400 ml-1">+ IVA</span>
              )}
            </div>
          )}
        </div>
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full text-xs font-semibold bg-[var(--color-secondary)] text-white rounded-md py-1.5 hover:brightness-90 transition-colors"
          >
            {t("sports.addToCart")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-[var(--color-primary)] rounded-lg overflow-hidden border border-black/10 hover:border-[var(--color-secondary)] transition-all duration-300 hover:transform hover:scale-105 shadow-[0_15px_40px_rgba(0,0,0,0.15)] flex flex-col h-full min-h-[500px] cursor-pointer ${className || ""}`}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleOpen();
      }}
    >
      <div className="relative h-64 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 group">
        {hasDiscount ? (
          <>
            <span className="absolute top-2 right-2 z-10 text-xs bg-white/85 text-black px-2 py-1 rounded-full font-bold flex items-baseline gap-2 border border-black/10 backdrop-blur">
              {showOriginal && candidateOriginal !== undefined && (
                <span className="text-black/50 line-through font-semibold">
                  {candidateOriginal.toFixed(2)} €
                </span>
              )}
              <span className="text-[var(--color-secondary)]">
                {finalPrice !== undefined ? `${finalPrice.toFixed(2)} €` : ""}
              </span>
              <span className="text-[10px] text-black/50 font-normal">
                + IVA
              </span>
            </span>
            <span className="absolute top-2 left-2 z-10 text-xs bg-[var(--color-secondary)] text-white px-2 py-1 rounded-full font-bold">
              {t("product.clearance")}
            </span>
          </>
        ) : (
          priceLabel && (
            <span className="absolute top-2 right-2 z-10 text-xs bg-[var(--color-secondary)] text-white px-2 py-1 rounded-full font-bold flex items-center">
              {priceLabel}
              <span className="text-[10px] text-gray-200 font-normal ml-1">
                + IVA
              </span>
            </span>
          )
        )}
        {product.size && (
          <span
            className={`absolute left-2 z-10 text-xs bg-black/70 text-white px-2 py-1 rounded-full ${
              hasDiscount ? "top-10" : "top-2"
            }`}
          >
            {product.size}
          </span>
        )}
        {activeImageSrc ? (
          <img
            src={activeImageSrc}
            alt={name}
            className="relative z-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              if (hasCarousel && cardImages.length > 0) {
                const next = (activeImageIndex + 1) % cardImages.length;
                if (next !== activeImageIndex) {
                  setActiveImageIndex(next);
                  return;
                }
              }
              target.style.display = "none";
              if (target.parentElement)
                target.parentElement.innerHTML = `<span class="text-gray-400">${t("sports.imageNot available")}</span>`;
            }}
          />
        ) : (
          <span className="text-gray-400">{t("sports.imageNot available")}</span>
        )}
        {hasCarousel && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ›
            </button>
          </>
        )}
        {!product.available && (
          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {t("products.outOfStock") || "Agotado"}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wide">
              {category}
            </span>
            {product.available && (
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                {t("sports.available")}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-black mb-3">{name}</h3>
          <p className="text-black/70 text-sm mb-4 line-clamp-3">
            {product.description[language] || product.description.es}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          {product.available && showAmazonLinks && product.amazonLinks ? (
            Object.entries(product.amazonLinks).map(([size, link]) => (
              <a
                key={size}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--color-secondary)] text-white font-bold py-2 px-4 rounded-lg hover:brightness-90 transition-all duration-300 text-center text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {t("sports.buy")} {size}
              </a>
            ))
          ) : (
            <button
              className="bg-[var(--color-secondary)] text-white font-bold py-2 px-4 rounded-lg hover:brightness-90 transition-all duration-300 text-center text-sm"
              disabled={!product.available}
              onClick={handleBuy}
            >
              {product.available ? t("sports.buy") : t("sports.comingSoon")}
            </button>
          )}

          {product.available && (
            <button
              onClick={handleAdd}
              className="bg-black hover:bg-black/80 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-center text-sm"
            >
              {t("sports.addToCart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
