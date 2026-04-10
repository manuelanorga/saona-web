export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category_id?: string;
  category?: Category;
  content_type?: string;
  product_type?: string;
  characteristics?: string[];
  image_url?: string;
  pdf_url?: string;
  sku?: string;
  cta_type: 'cotiza' | 'compra' | 'whatsapp';
  whatsapp_message?: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PaintLine {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  colors?: Color[];
}

export interface Color {
  id: string;
  paint_line_id: string;
  name?: string;
  hex_code: string;
  color_code?: string;
  sort_order: number;
}

export interface Environment {
  id: string;
  name: string;
  image_url: string;
  thumbnail_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  cta_secondary_link?: string;
  sort_order: number;
  is_active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  [key: string]: string;
}
