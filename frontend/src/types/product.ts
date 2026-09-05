export interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  description: string;
  specs: Record<string, any>;
  features: string[];
  image_url?: string;
  in_stock: boolean;
  stock_quantity: number;
  delivery_days: number;
  tags: string[];
}
