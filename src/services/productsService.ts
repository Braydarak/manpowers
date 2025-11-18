interface Product {
  id: number;
  name: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  objectives?: {
    es: string[];
    en: string[];
  };
  nutritionalValues?: {
    es: string;
    en: string;
  };
  application?: {
    es: string;
    en: string;
  };
  recommendations?: {
    es: string;
    en: string;
  };
  price: number;
  price_formatted: string;
  size: string;
  image: string;
  category: {
    es: string;
    en: string;
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

class ProductsService {
  private baseUrl: string;

  constructor() {
    // Usamos manpowers.es para todas las llamadas al backend
    this.baseUrl = 'https://manpowers.es/backend/api';
  }

  async getProducts(filters?: ProductsFilters): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.sport) {
        params.append('sport', filters.sport);
      }
      if (filters?.category) {
        params.append('category', filters.category);
      }
      if (filters?.available !== undefined) {
        params.append('available', filters.available.toString());
      }
      if (filters?.id) {
        params.append('id', filters.id.toString());
      }

      const url = `${this.baseUrl}/products.php${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();
      
      if (!data.success) {
        throw new Error('API returned error response');
      }

      return data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      // En caso de error, devolvemos array vacío
      return [];
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