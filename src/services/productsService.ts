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
        const response = await fetch("/products.json");
        const data = await response.json();
        const raw = (Array.isArray(data?.products) ? data.products : []) as
          | RawProduct[]
          | [];
        const arr = raw.map((p) => ({
          id:
            typeof p.id === "number"
              ? p.id
              : typeof p.id === "string"
                ? parseInt(p.id, 10)
                : 0,
          name: p.name || { es: "", en: "" },
          description: p.description || { es: "", en: "" },
          objectives: p.objectives,
          price:
            typeof p.price === "string"
              ? parseFloat(p.price.replace(",", "."))
              : typeof p.price === "number"
                ? p.price
                : 0,
          comercial_price:
            p.comercial_price !== undefined
              ? typeof p.comercial_price === "string"
                ? parseFloat(p.comercial_price.replace(",", "."))
                : typeof p.comercial_price === "number"
                  ? p.comercial_price
                  : 0
              : typeof p.price === "string"
                ? parseFloat(p.price.replace(",", "."))
                : typeof p.price === "number"
                  ? p.price
                  : 0,
          price_formatted:
            typeof p.price_formatted === "string" ? p.price_formatted : "",
          size: typeof p.size === "string" ? p.size : "",
          pricesBySize: p.pricesBySize,
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
          rating: typeof p.rating === "number" ? p.rating : undefined,
          votes: typeof p.votes === "number" ? p.votes : undefined,
          img_folder:
            typeof p.img_folder === "string" ? p.img_folder : undefined,
          faqs: p.faqs,
        })) as Product[];
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
      const arr = ((data.products || []) as any[]).map((p) => ({
        id: p.id + 10000, // Offset IDs to avoid collision
        name: p.name,
        description: p.description,
        story: p.story,
        ingredients: p.ingredients,
        price:
          typeof p.price === "string"
            ? parseFloat((p.price as string).replace(",", "."))
            : p.price,
        comercial_price:
          p.comercial_price !== undefined
            ? typeof p.comercial_price === "string"
              ? parseFloat((p.comercial_price as string).replace(",", "."))
              : p.comercial_price
            : typeof p.price === "string"
              ? parseFloat((p.price as string).replace(",", "."))
              : p.price,
        price_formatted: p.price_formatted ?? "",
        size: p.size || "",
        pricesBySize: p.pricesBySize,
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
      })) as Product[];

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
