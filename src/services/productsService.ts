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
  price: number;
  price_formatted: string;
  size: string;
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

import caTranslations from '../data/productTranslationsCa';

class ProductsService {
  constructor() {}

  async getProducts(filters?: ProductsFilters): Promise<Product[]> {
    try {
      const response = await fetch('/products.json');
      const data = await response.json();
      const arr = ((data.products || []) as Product[]).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        objectives: p.objectives,
        price: typeof p.price === 'string' ? parseFloat((p.price as string).replace(',', '.')) : p.price,
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
      })) as Product[];
      let products = this.applyCaTranslations(arr);
      if (filters) {
        products = products.filter((pr) => {
          if (filters.id && String(pr.id) !== String(filters.id)) return false;
          if (filters.sport && pr.sportId !== filters.sport) return false;
          if (filters.category) {
            const cat = typeof pr.category === 'string' ? pr.category : pr.category.es;
            if (cat !== filters.category) return false;
          }
          if (typeof filters.available === 'boolean' && pr.available !== filters.available) return false;
          return true;
        });
      }
      return products;
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
          nutritionalValues: p.nutritionalValues ? { ...p.nutritionalValues, ...(t.nutritionalValues || {}) } : undefined,
          application: p.application ? { ...p.application, ...(t.application || {}) } : undefined,
          recommendations: p.recommendations ? { ...p.recommendations, ...(t.recommendations || {}) } : undefined,
          objectives: p.objectives ? { ...p.objectives, ...(t.objectives || {}) } : undefined,
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