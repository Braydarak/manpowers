import React, { useMemo, useRef, useState } from "react";

import type { Product } from "../services/productsService";

import { Download } from "lucide-react";
import NutricionalTable from "../components/nutricionalTable";

interface SuplementsDetailsProps {
  product: Product;
  currentLanguage: "es" | "en" | "ca";
  mediaItems: { type: "image" | "video"; src: string; path: string }[];
  activeMediaIndex: number;
  setActiveMediaIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  getPriceForSize: (size?: string) => number | undefined;
}

const SuplementsDetails: React.FC<SuplementsDetailsProps> = ({
  product,
  currentLanguage,
  mediaItems,
  activeMediaIndex,
  setActiveMediaIndex,
  selectedSize,
  getPriceForSize,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState<string>("descripcion");
  const sectionNavRef = useRef<HTMLDivElement | null>(null);

  const priceBySize = getPriceForSize(selectedSize || undefined);
  const hasDiscount =
    typeof product.discount_price === "number" &&
    Number.isFinite(product.discount_price);
  const computedPrice =
    typeof priceBySize === "number"
      ? priceBySize
      : hasDiscount
        ? product.discount_price
        : product.price;

  const handleAddToCart = () => {
    if (!product) return;
    let finalName = product.name[currentLanguage] || product.name.es;
    let finalId = String(product.id);

    if (selectedSize) {
      finalName = `${finalName} (${selectedSize})`;
      finalId = `${finalId}-${selectedSize}`;
    }

    const detail = {
      id: finalId,
      name: finalName,
      price: computedPrice,
      image: mediaItems.find((m) => m.type === "image")?.src || product.image,
      quantity: quantity,
    };
    window.dispatchEvent(new CustomEvent("cart:add", { detail }));
  };

  const accordionDescription =
    product.description?.[currentLanguage] ?? product.description?.es;
  const accordionNutritionalValues =
    product.nutritionalValues?.[currentLanguage] ??
    product.nutritionalValues?.es;
  const nutritionalFacts = useMemo(() => {
    const v = product.nutritionalFacts;
    if (v === null || v === undefined) return undefined;
    if (typeof v === "string") {
      const t = v.trim();
      return t ? t : undefined;
    }
    if (Array.isArray(v)) {
      return v.length ? v : undefined;
    }
    if (typeof v === "object") {
      const obj = v as Record<string, unknown>;
      return Object.keys(obj).length ? v : undefined;
    }
    return undefined;
  }, [product.nutritionalFacts]);
  const accordionApplication =
    product.application?.[currentLanguage] ?? product.application?.es;
  const accordionRecommendations =
    product.recommendations?.[currentLanguage] ?? product.recommendations?.es;
  const accordionCautions =
    product.cautions?.[currentLanguage] ?? product.cautions?.es;

  const objectivesList =
    product.objectives?.[currentLanguage] ?? product.objectives?.es;
  const accordionObjectives = useMemo(() => {
    if (!Array.isArray(objectivesList) || objectivesList.length === 0)
      return undefined;
    const normalized = objectivesList.filter(
      (o) => typeof o === "string" && o.trim(),
    );
    if (normalized.length === 0) return undefined;
    return (
      <ul className="list-disc ml-5 space-y-1">
        {normalized.map((o, i) => (
          <li key={i}>{o}</li>
        ))}
      </ul>
    );
  }, [objectivesList]);

  const currentMedia = mediaItems[activeMediaIndex];
  const altText = product.name[currentLanguage] || product.name.es;

  const handleSectionClick = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (!el) return;
    const rootStyle = getComputedStyle(document.documentElement);
    const headerHeight =
      parseFloat(rootStyle.getPropertyValue("--header-height")) || 0;
    const navHeight = sectionNavRef.current?.offsetHeight ?? 0;
    const extraOffset = 12;
    const targetY =
      el.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      navHeight -
      extraOffset;
    window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
  };

  return (
    <div className="w-full bg-white">
      {/* Product Top Section */}
      <section className="mt-10 md:mt-35 mb-16">
        <div className="max-w-[1220px] mx-auto gap-0 px-4 md:px-8 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] md:gap-y-10 gap-y-0 gap-x-8 xl:gap-x-[70px] items-start">
          {/* Left Column: Images */}
          <div className="flex flex-col w-full max-w-[600px] mx-auto lg:max-w-full">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg md:rounded-none">
              <div className="relative flex flex-col mx-auto w-full h-full">
                {/* Main Image */}
                <div className="relative w-full h-full bg-white flex items-center justify-center">
                  {currentMedia?.type === "image" ? (
                    <img
                      src={currentMedia.src || product.image}
                      alt={altText}
                      className="max-w-full max-h-full object-contain cursor-pointer"
                    />
                  ) : currentMedia?.type === "video" ? (
                    <video
                      src={currentMedia.src}
                      className="max-w-full max-h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={product.image}
                      alt={altText}
                      className="max-w-full max-h-full object-contain cursor-pointer"
                    />
                  )}
                  {hasDiscount && (
                    <div className="absolute top-0 right-0 md:right-[15%] w-[83px] h-[83px] flex items-center justify-center bg-[#b87c4c] text-white rounded-full font-bold text-lg z-10">
                      <span>
                        -
                        {(
                          100 -
                          (product.discount_price! / product.price) * 100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Thumbnails */}
            {mediaItems.length > 1 && (
              <div className="flex gap-[15px] md:gap-[20px] lg:gap-[28px] overflow-x-auto mt-4 px-2 hide-scrollbar">
                {mediaItems.map((m, i) => (
                  <button
                    key={`${m.path}-${i}`}
                    onClick={() => setActiveMediaIndex(i)}
                    className={`relative w-[65px] h-[65px] md:w-[85px] md:h-[85px] lg:w-[110px] lg:h-[110px] flex-shrink-0 cursor-pointer after:content-[''] after:bg-gray-200 after:absolute after:top-[10px] md:after:top-[15px] lg:after:top-[20px] after:left-0 after:right-0 after:mx-auto after:w-[60px] after:h-[60px] md:after:w-[80px] md:after:h-[80px] lg:after:w-[100px] lg:after:h-[100px] after:rounded-full after:opacity-50 after:z-0`}
                  >
                    {m.type === "image" ? (
                      <img
                        src={m.src}
                        alt={`thumbnail-${i}`}
                        className={`relative z-10 w-full h-full object-cover ${i === activeMediaIndex ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                      />
                    ) : (
                      <div className="relative z-10 w-full h-full flex items-center justify-center bg-black/10">
                        <svg
                          className="w-6 h-6 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="flex flex-col min-h-0 h-full mt-8 lg:mt-0">
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col justify-start">
                <h1 className="text-[24px] md:text-[30px] lg:text-[36px] leading-[30px] md:leading-[32px] lg:leading-[40px] md:mb-[10px] lg:mb-[25px] uppercase text-black font-medium">
                  {product.name[currentLanguage] || product.name.es}
                </h1>

                {(selectedSize || product.size) && (
                  <div className="text-[#333] text-[14px] mb-4 leading-[18px]">
                    Contiene: <b>{selectedSize || product.size}</b>
                  </div>
                )}

                <div className="max-md:mt-[10px] pb-[22px] text-gray-700">
                  {accordionDescription && (
                    <div className="mt-[3px] mb-4 leading-relaxed text-[15px]">
                      <p>{accordionDescription}</p>
                    </div>
                  )}

                  {/* Features List */}
                  {accordionObjectives && (
                    <div className="text-[15px]">{accordionObjectives}</div>
                  )}
                </div>
              </div>

              {/* Price & Cart Section */}
              <div className="w-full mt-5 md:mt-10 lg:mt-auto lg:pt-5 flex flex-col z-20 gap-[10px]">
                <div className="w-full flex flex-col md:flex-row flex-wrap justify-between">
                  <div className="lg:flex-1 w-full max-md:mb-[10px]">
                    <div className="grid grid-cols-2 gap-y-4 md:flex md:flex-row md:flex-wrap md:items-center md:gap-4 md:mb-[10px]">
                      {/* Shipping & Delivery Info (Bottom on Mobile, Bottom on Desktop) */}
                      <div className="col-span-2 md:col-span-1 text-[#333] flex flex-col justify-center order-3 md:order-3 md:w-full md:mt-3">
                        <p className="text-[12px]">
                          <span className="font-semibold">Entrega:</span> 3-5
                          días hábiles
                        </p>
                        <p className="text-[11px] md:text-[12px] [&_a]:text-[var(--color-secondary)]">
                          IVA incluido
                        </p>
                        <p className="text-[11px] md:text-[12px]">
                          Envío gratis en pedidos superiores a €30
                        </p>
                      </div>

                      {/* Price Display (Left Top on Mobile, Right on Desktop) */}
                      <div className="col-span-1 flex flex-col text-left md:text-left items-start md:items-start order-1 md:order-2">
                        <div className="flex items-baseline gap-2 justify-start md:justify-start">
                          <span className="text-[24px] md:text-[28px] font-bold text-[#333]">
                            {Number(computedPrice).toFixed(2).replace(".", ",")}
                            &nbsp;€
                          </span>
                          {hasDiscount && (
                            <span className="text-[16px] line-through text-[#7f7f7f]">
                              {Number(product.price)
                                .toFixed(2)
                                .replace(".", ",")}
                              &nbsp;€
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Selector (Right Top on Mobile, Left on Desktop) */}
                      <div className="col-span-1 order-2 md:order-1 flex justify-end md:justify-start items-start md:items-center">
                        <div className="inline-block relative">
                          <select
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(parseInt(e.target.value))
                            }
                            className="w-[62px] appearance-none bg-transparent text-left text-[13.3333px] px-[10px] py-[5px] border border-[#7f7f7f] focus:outline-none font-bold tracking-[2px] text-[#333]"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-[11px] flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 582 1024"
                              className="rotate-90 w-[11px] h-[11px]"
                              aria-hidden="true"
                            >
                              <path
                                fill="currentColor"
                                d="M570 481 97 12C89 4 78 0 70 0 58 0 50 4 43 12L12 39C-4 54-4 81 12 97l415 415L12 923c-16 16-16 43 0 58l31 27c7 8 19 12 27 12 11 0 19-4 27-12l469-469c20-15 20-39 4-58"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 lg:w-max lg:min-w-[270px] lg:pl-4">
                    <div className="w-full md:max-w-[300px] md:ml-auto flex flex-col gap-3">
                      <button
                        onClick={handleAddToCart}
                        className="w-full h-[50px] bg-[var(--color-secondary)] hover:brightness-90 text-white text-[17px] md:text-[18px] font-bold tracking-[2px] uppercase transition-all flex items-center justify-center"
                      >
                        Añadir al carrito
                      </button>

                      {(product as Product & { ficha_tecnica?: string })
                        .ficha_tecnica && (
                        <button
                          onClick={() =>
                            window.open(
                              (product as Product & { ficha_tecnica?: string })
                                .ficha_tecnica,
                              "_blank",
                            )
                          }
                          className="w-full h-[50px] border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white text-[14px] md:text-[15px] font-bold tracking-[1px] uppercase transition-colors flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Ficha técnica
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story / About Section */}
      {product.story && (
        <section className="py-16 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-black mb-6">
              Lo que nos caracteriza
            </h2>
            <div className="text-black/80 leading-relaxed space-y-4 text-left text-lg">
              {product.story[currentLanguage] || product.story.es}
            </div>
          </div>
        </section>
      )}

      <div
        ref={sectionNavRef}
        className="sticky w-full h-fit top-[calc(var(--header-height)_-_2px)] z-20 bg-white border-gray-300 border-t-2 border-b-2"
      >
        <nav className="max-w-[1440px] mx-auto overflow-hidden relative after:content-[''] after:absolute after:inset-y-0 after:right-0 after:w-8 after:pointer-events-none after:bg-gradient-to-l after:from-white after:to-transparent">
          <ul className="flex justify-start md:justify-around px-2 lg:px-[25px] overflow-x-auto hide-scrollbar leading-[46px] md:leading-[44px] gap-4 md:gap-0">
            {accordionDescription && (
              <li className="first:ml-0 last:mr-0 mx-[7px]">
                <button
                  type="button"
                  onClick={() => handleSectionClick("descripcion")}
                  className={`text-[13px] md:text-[16px] px-[5px] uppercase font-bold whitespace-nowrap transition-colors relative ${activeSection === "descripcion" ? "text-[var(--color-secondary)]" : "text-black/60 hover:text-[var(--color-secondary)]"}`}
                >
                  Descripción
                </button>
              </li>
            )}
            {(nutritionalFacts || accordionNutritionalValues) && (
              <li className="first:ml-0 last:mr-0 mx-[7px]">
                <button
                  type="button"
                  onClick={() => handleSectionClick("valores")}
                  className={`text-[13px] md:text-[16px] px-[5px] uppercase font-bold whitespace-nowrap transition-colors relative ${activeSection === "valores" ? "text-[var(--color-secondary)]" : "text-black/60 hover:text-[var(--color-secondary)]"}`}
                >
                  Valores nutricionales
                </button>
              </li>
            )}
            {accordionApplication && (
              <li className="first:ml-0 last:mr-0 mx-[7px]">
                <button
                  type="button"
                  onClick={() => handleSectionClick("aplicacion")}
                  className={`text-[13px] md:text-[16px] px-[5px] uppercase font-bold whitespace-nowrap transition-colors relative ${activeSection === "aplicacion" ? "text-[var(--color-secondary)]" : "text-black/60 hover:text-[var(--color-secondary)]"}`}
                >
                  Aplicación
                </button>
              </li>
            )}
            {accordionRecommendations && (
              <li className="first:ml-0 last:mr-0 mx-[7px]">
                <button
                  type="button"
                  onClick={() => handleSectionClick("recomendaciones")}
                  className={`text-[13px] md:text-[16px] px-[5px] uppercase font-bold whitespace-nowrap transition-colors relative ${activeSection === "recomendaciones" ? "text-[var(--color-secondary)]" : "text-black/60 hover:text-[var(--color-secondary)]"}`}
                >
                  Recomendaciones
                </button>
              </li>
            )}
            {accordionCautions && (
              <li className="first:ml-0 last:mr-0 mx-[7px]">
                <button
                  type="button"
                  onClick={() => handleSectionClick("precauciones")}
                  className={`text-[13px] md:text-[16px] px-[5px] uppercase font-bold whitespace-nowrap transition-colors relative ${activeSection === "precauciones" ? "text-[var(--color-secondary)]" : "text-black/60 hover:text-[var(--color-secondary)]"}`}
                >
                  Precauciones
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Content Sections */}
      <div
        id="section-content-area"
        className="product-details-content pb-20 pt-10 md:pt-16 bg-white min-h-[300px]"
      >
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 lg:px-12 animate-in fade-in duration-500 space-y-16">
          {accordionDescription && (
            <section id="descripcion" className="w-full">
              <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-black mb-8 border-b-2 border-[var(--color-secondary)] pb-4 inline-block md:block md:w-full max-w-full break-words">
                Descripción
              </h3>
              <div className="text-left prose prose-xl max-w-none text-black/80 leading-relaxed space-y-6 mx-auto md:mx-0 text-lg md:text-xl">
                <p>{accordionDescription}</p>
              </div>
            </section>
          )}

          {(nutritionalFacts || accordionNutritionalValues) && (
            <section id="valores" className="w-full">
              <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-black mb-8 border-b-2 border-[var(--color-secondary)] pb-4 inline-block md:block md:w-full max-w-full break-words">
                Valores nutricionales
              </h3>
              <div className="text-left prose prose-lg max-w-none text-black/80 leading-relaxed space-y-6 mx-auto md:mx-0">
                {nutritionalFacts ? (
                  <div className="not-prose">
                    <NutricionalTable
                      data={nutritionalFacts}
                      language={currentLanguage}
                    />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">
                    {accordionNutritionalValues}
                  </p>
                )}
              </div>
            </section>
          )}

          {accordionApplication && (
            <section id="aplicacion" className="w-full">
              <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-black mb-8 border-b-2 border-[var(--color-secondary)] pb-4 inline-block md:block md:w-full max-w-full break-words">
                Aplicación
              </h3>
              <div className="text-left prose prose-xl max-w-none text-black/80 leading-relaxed space-y-6 mx-auto md:mx-0 text-lg md:text-xl">
                <p className="whitespace-pre-wrap">{accordionApplication}</p>
              </div>
            </section>
          )}

          {accordionRecommendations && (
            <section id="recomendaciones" className="w-full">
              <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-black mb-8 border-b-2 border-[var(--color-secondary)] pb-4 inline-block md:block md:w-full max-w-full break-words">
                Recomendaciones
              </h3>
              <div className="text-left prose prose-xl max-w-none text-black/80 leading-relaxed space-y-6 mx-auto md:mx-0 text-lg md:text-xl">
                <p className="whitespace-pre-wrap">
                  {accordionRecommendations}
                </p>
              </div>
            </section>
          )}

          {accordionCautions && (
            <section id="precauciones" className="w-full">
              <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-black mb-8 border-b-2 border-[var(--color-secondary)] pb-4 inline-block md:block md:w-full max-w-full break-words">
                Precauciones
              </h3>
              <div className="text-left prose prose-lg max-w-none text-black/80 leading-relaxed space-y-6 mx-auto md:mx-0">
                <p className="whitespace-pre-wrap">{accordionCautions}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuplementsDetails;
