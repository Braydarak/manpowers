interface Product {
  id: number;
  name: {
    es: string;
    en: string;
    ca?: string;
  };
  description: {
    es: string;
    en: string;
    ca?: string;
  };
  objectives?: {
    es: string[];
    en: string[];
    ca?: string[];
  };
  nutritionalValues?: {
    es: string;
    en: string;
    ca?: string;
  };
  application?: {
    es: string;
    en: string;
    ca?: string;
  };
  recommendations?: {
    es: string;
    en: string;
    ca?: string;
  };
  cautions?: {
    es: string;
    en: string;
    ca?: string;
  };
  color?: {
    es?: string[];
    en?: string[];
    ca?: string[];
  };
  discount_price?: number;
  original_price?: number;
  price: number;
  comercial_price?: number;
  price_formatted: string;
  size: string;
  pricesBySize?: { [key: string]: string };
  image: string;
  category: {
    es: string;
    en: string;
    ca?: string;
  };
  sportId: string;
  available: boolean;
  sku: string;
  amazonLinks?: {
    [key: string]: string;
  };
  rating?: number;
  votes?: number;
  story?: {
    es: string;
    en: string;
    ca?: string;
  };
  ingredients?: {
    es: string[];
    en: string[];
    ca?: string[];
  };
  brand?: string;
  img_folder?: string;
  faqs?: {
    es?: { question: string; answer: string }[];
    en?: { question: string; answer: string }[];
    ca?: { question: string; answer: string }[];
  };
  source?: "manpowers" | "tamd";
}

interface ProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
  metadata?: {
    last_updated: string;
    currency: string;
    tax_included: boolean;
    version: string;
  };
  filters_applied?: {
    sport?: string;
    category?: string;
    available?: string;
    product_id?: string;
  };
}

interface ProductsFilters {
  sport?: string;
  category?: string;
  available?: boolean;
  id?: number;
}

import caTranslations from "../data/productTranslationsCa";

type RawProduct = {
  id?: unknown;
  name?: Product["name"];
  description?: Product["description"];
  objectives?: Product["objectives"];
  nutritionalValues?: Product["nutritionalValues"];
  application?: Product["application"];
  recommendations?: Product["recommendations"];
  cautions?: Product["cautions"];
  price?: unknown;
  discount_price?: unknown;
  original_price?: unknown;
  comercial_price?: unknown;
  price_formatted?: unknown;
  size?: unknown;
  pricesBySize?: Product["pricesBySize"];
  image?: unknown;
  category?: Product["category"] | string;
  sportId?: unknown;
  available?: unknown;
  sku?: unknown;
  amazonLinks?: Product["amazonLinks"];
  rating?: unknown;
  votes?: unknown;
  story?: Product["story"];
  ingredients?: Product["ingredients"];
  color?: Product["color"];
  color_es?: unknown;
  color_en?: unknown;
  color_de?: unknown;
  color_ca?: unknown;
  brand?: unknown;
  img_folder?: unknown;
  faqs?: Product["faqs"];
};

let _cache: Product[] | null = null;
let _inflight: Promise<Product[]> | null = null;

class ProductsService {
  constructor() {}

  async getProducts(filters?: ProductsFilters): Promise<Product[]> {
    const project = async (): Promise<Product[]> => {
      if (_cache) return _cache;
      if (_inflight) return _inflight;
      _inflight = (async () => {
        const load = async (url: string) => {
          const r = await fetch(url);
          if (!r.ok) throw new Error(`products_http_${r.status}`);
          return r.json();
        };

        const data: unknown = await load("/backend/get_products.php");

        const payload =
          data && typeof data === "object"
            ? (data as Record<string, unknown>)
            : {};
        const raw = (
          Array.isArray(payload.products) ? payload.products : []
        ) as RawProduct[] | [];
        const parseList = (val: unknown): string[] | undefined => {
          if (typeof val !== "string") return undefined;
          const list = val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          return list.length > 0 ? list : undefined;
        };
        const parseMoney = (val: unknown): number | undefined => {
          if (typeof val === "number") {
            return Number.isFinite(val) ? val : undefined;
          }
          if (typeof val !== "string") return undefined;
          const cleaned = val.trim().replace(/[^\d,.-]/g, "");
          if (cleaned === "") return undefined;
          const num = parseFloat(cleaned.replace(",", "."));
          return Number.isFinite(num) ? num : undefined;
        };

        const arr = raw.map((p) => {
          const parsedColorEs = parseList(p.color_es);
          const parsedColorEn = parseList(p.color_en);
          const parsedColorCa = parseList(p.color_ca);
          const derivedColor =
            parsedColorEs || parsedColorEn || parsedColorCa
              ? {
                  es: parsedColorEs,
                  en: parsedColorEn,
                  ca: parsedColorCa,
                }
              : undefined;

          const basePrice = parseMoney(p.price) ?? 0;
          const finalPrice = basePrice;
          const discountPrice = parseMoney(p.discount_price);
          const finalDiscountPrice =
            discountPrice !== undefined ? discountPrice : undefined;
          const originalPrice = parseMoney(p.original_price);
          const finalOriginalPrice =
            originalPrice !== undefined ? originalPrice : undefined;
          const comercialPrice =
            p.comercial_price !== undefined
              ? (parseMoney(p.comercial_price) ?? basePrice)
              : basePrice;
          const finalComercialPrice = comercialPrice;

          const pricesBySize = p.pricesBySize;
          const finalPricesBySize: { [key: string]: string } | undefined =
            pricesBySize
              ? Object.entries(pricesBySize).reduce(
                  (acc, [size, priceStr]) => {
                    const pVal = parseMoney(priceStr);
                    if (pVal !== undefined) {
                      acc[size] = pVal.toFixed(2);
                    } else {
                      acc[size] = priceStr;
                    }
                    return acc;
                  },
                  {} as { [key: string]: string },
                )
              : undefined;

          return {
            id:
              typeof p.id === "number"
                ? p.id
                : typeof p.id === "string"
                  ? parseInt(p.id, 10)
                  : 0,
            name: p.name || { es: "", en: "" },
            description: p.description || { es: "", en: "" },
            objectives: p.objectives,
            discount_price: finalDiscountPrice,
            original_price: finalOriginalPrice,
            price: finalPrice,
            comercial_price: finalComercialPrice,
            price_formatted: `€ ${finalPrice.toFixed(2)}`,
            size: typeof p.size === "string" ? p.size : "",
            pricesBySize: finalPricesBySize,
            image: typeof p.image === "string" ? p.image : "",
            category:
              typeof p.category === "string"
                ? { es: p.category, en: p.category }
                : p.category || { es: "", en: "" },
            sportId: typeof p.sportId === "string" ? p.sportId : "",
            available: Boolean(p.available),
            sku: typeof p.sku === "string" ? p.sku : "",
            amazonLinks: p.amazonLinks,
            nutritionalValues: p.nutritionalValues,
            application: p.application,
            recommendations: p.recommendations,
            cautions: p.cautions,
            color: derivedColor ?? p.color,
            rating: typeof p.rating === "number" ? p.rating : undefined,
            votes: typeof p.votes === "number" ? p.votes : undefined,
            img_folder:
              typeof p.img_folder === "string" ? p.img_folder : undefined,
            faqs: p.faqs,
          };
        }) as Product[];
        _cache = this.applyCaTranslations(arr);
        _inflight = null;
        return _cache;
      })();
      return _inflight;
    };

    try {
      let products = await project();
      if (filters) {
        products = products.filter((pr) => {
          if (filters.id && String(pr.id) !== String(filters.id)) return false;
          if (filters.sport && pr.sportId !== filters.sport) return false;
          if (filters.category) {
            const cat =
              typeof pr.category === "string" ? pr.category : pr.category.es;
            if (cat !== filters.category) return false;
          }
          if (
            typeof filters.available === "boolean" &&
            pr.available !== filters.available
          )
            return false;
          return true;
        });
      }
      return products;
    } catch {
      _inflight = null;
      return [];
    }
  }

  async getTamdProducts(): Promise<Product[]> {
    try {
      const response = await fetch("/tamdProducts.json");
      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arr = ((data.products || []) as any[]).map((p) => {
        const rawPrice =
          typeof p.price === "string"
            ? parseFloat((p.price as string).replace(",", "."))
            : p.price;
        const finalPrice = rawPrice || 0;

        const rawComercialPrice =
          p.comercial_price !== undefined
            ? typeof p.comercial_price === "string"
              ? parseFloat((p.comercial_price as string).replace(",", "."))
              : p.comercial_price
            : rawPrice;
        const finalComercialPrice = rawComercialPrice || 0;

        const pricesBySize = p.pricesBySize;
        const finalPricesBySize: { [key: string]: string } | undefined =
          pricesBySize
            ? Object.entries(pricesBySize).reduce(
                (acc, [size, priceStr]) => {
                  const cleaned = String(priceStr)
                    .trim()
                    .replace(/[^\d,.-]/g, "");
                  const pVal = parseFloat(cleaned.replace(",", "."));
                  if (Number.isFinite(pVal)) {
                    acc[size] = pVal.toFixed(2);
                  } else {
                    acc[size] = String(priceStr);
                  }
                  return acc;
                },
                {} as { [key: string]: string },
              )
            : undefined;

        return {
          id: p.id + 10000, // Offset IDs to avoid collision
          name: p.name,
          description: p.description,
          story: p.story,
          ingredients: p.ingredients,
          price: finalPrice,
          comercial_price: finalComercialPrice,
          price_formatted: `€ ${finalPrice.toFixed(2)}`,
          size: p.size || "",
          pricesBySize: finalPricesBySize,
          image: p.image,
          category:
            typeof p.category === "string"
              ? { es: p.category, en: p.category }
              : p.category,
          sportId: p.sportId || "cosmetics",
          available: p.available,
          sku: p.sku ?? "",
          amazonLinks: p.amazonLinks,
          nutritionalValues: p.nutritionalValues,
          application: p.application,
          recommendations: p.recommendations,
          cautions: p.cautions,
          rating: p.rating,
          votes: p.votes,
          brand: p.brand || "TAMD Cosmetics",
          source: "tamd" as const,
        };
      }) as Product[];

      return arr;
    } catch {
      return [];
    }
  }

  private applyCaTranslations(products: Product[]): Product[] {
    try {
      const map = caTranslations || {};
      return products.map((p) => {
        const t = map[p.id] || {};
        return {
          ...p,
          name: { ...p.name, ...(t.name || {}) },
          description: { ...p.description, ...(t.description || {}) },
          category: { ...p.category, ...(t.category || {}) },
          nutritionalValues: p.nutritionalValues
            ? { ...p.nutritionalValues, ...(t.nutritionalValues || {}) }
            : undefined,
          application: p.application
            ? { ...p.application, ...(t.application || {}) }
            : undefined,
          recommendations: p.recommendations
            ? { ...p.recommendations, ...(t.recommendations || {}) }
            : undefined,
          objectives: p.objectives
            ? { ...p.objectives, ...(t.objectives || {}) }
            : undefined,
          cautions: p.cautions
            ? { ...p.cautions, ...(t.cautions || {}) }
            : undefined,
        } as Product;
      });
    } catch {
      return products;
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    const products = await this.getProducts({ id });
    return products.length > 0 ? products[0] : null;
  }

  async getProductsBySport(sportId: string): Promise<Product[]> {
    return this.getProducts({ sport: sportId });
  }

  async getAvailableProducts(): Promise<Product[]> {
    return this.getProducts({ available: true });
  }
}

export default new ProductsService();
export type { Product, ProductsResponse, ProductsFilters };
