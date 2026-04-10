-- ===========================================
-- SAONA WEB - Database Schema
-- Run this in your Supabase SQL editor
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PRODUCT CATEGORIES
-- ===========================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PRODUCTS
-- ===========================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  content_type TEXT,        -- e.g., "1 galón (3.78 litros)", "25 kg", "1 kg"
  product_type TEXT,        -- e.g., "Látex premium mate", "Imprimante"
  characteristics TEXT[],   -- Array of feature strings
  image_url TEXT,
  pdf_url TEXT,             -- Technical manual PDF
  sku TEXT,
  cta_type TEXT DEFAULT 'cotiza',  -- 'cotiza' | 'compra' | 'whatsapp'
  whatsapp_message TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PAINT LINES (for simulator)
-- ===========================================
CREATE TABLE IF NOT EXISTS paint_lines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- ===========================================
-- COLOR PALETTE
-- ===========================================
CREATE TABLE IF NOT EXISTS colors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  paint_line_id UUID REFERENCES paint_lines(id) ON DELETE CASCADE,
  name TEXT,
  hex_code TEXT NOT NULL,
  color_code TEXT,  -- e.g., "CR-7000"
  sort_order INTEGER DEFAULT 0
);

-- ===========================================
-- ENVIRONMENTS (for paint simulator)
-- ===========================================
CREATE TABLE IF NOT EXISTS environments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,          -- "Sala", "Comedor", "Dormitorio", "Baño", "Cocina", "Exterior"
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  -- The paintable areas stored as JSON: [{id, x, y, width, height, fill}]
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- ===========================================
-- HERO SLIDES (home page carousel)
-- ===========================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cta_primary_text TEXT DEFAULT 'Más info',
  cta_primary_link TEXT DEFAULT '/productos',
  cta_secondary_text TEXT DEFAULT 'Compra por WhatsApp',
  cta_secondary_link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SITE SETTINGS
-- ===========================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- CONTACT MESSAGES
-- ===========================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- UPDATED_AT TRIGGER
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE paint_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read paint_lines" ON paint_lines FOR SELECT USING (is_active = true);
CREATE POLICY "Public read colors" ON colors FOR SELECT USING (true);
CREATE POLICY "Public read environments" ON environments FOR SELECT USING (is_active = true);
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Contact messages: public insert
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- Service role has full access (used by admin CMS)
CREATE POLICY "Service role all categories" ON categories FOR ALL USING (true);
CREATE POLICY "Service role all products" ON products FOR ALL USING (true);
CREATE POLICY "Service role all paint_lines" ON paint_lines FOR ALL USING (true);
CREATE POLICY "Service role all colors" ON colors FOR ALL USING (true);
CREATE POLICY "Service role all environments" ON environments FOR ALL USING (true);
CREATE POLICY "Service role all hero_slides" ON hero_slides FOR ALL USING (true);
CREATE POLICY "Service role all settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Service role all contacts" ON contact_messages FOR ALL USING (true);

-- ===========================================
-- STORAGE BUCKETS (run after creating buckets in dashboard)
-- ===========================================
-- Create these buckets in Supabase dashboard > Storage:
-- 1. "products" - public bucket for product images
-- 2. "manuals" - public bucket for PDF technical manuals
-- 3. "environments" - public bucket for simulator room images
-- 4. "general" - public bucket for general images

-- ===========================================
-- SEED DATA
-- ===========================================

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Línea Industrial', 'linea-industrial', 'Pinturas y recubrimientos para uso industrial', 1),
  ('Pinturas Construcción', 'pinturas-construccion', 'Productos para construcción y acabados', 2),
  ('Línea Decorativa', 'linea-decorativa', 'Pinturas decorativas para interiores y exteriores', 3),
  ('Línea Madera', 'linea-madera', 'Productos especiales para madera', 4),
  ('Línea Tráfico', 'linea-trafico', 'Pinturas para demarcación vial', 5),
  ('Línea Limpieza', 'linea-limpieza', 'Productos de limpieza profesional', 6),
  ('Solventes', 'solventes', 'Solventes y diluyentes de alta calidad', 7)
ON CONFLICT (slug) DO NOTHING;

-- Paint lines for simulator
INSERT INTO paint_lines (name, description, sort_order) VALUES
  ('Dura Matex', 'Látex premium mate para interiores y exteriores', 1),
  ('Látex Superior', 'Látex de alta calidad', 2),
  ('Super Satinado', 'Acabado satinado premium', 3),
  ('Temple Premium', 'Temple de alta resistencia', 4)
ON CONFLICT DO NOTHING;

-- Sample colors for Dura Matex
WITH line AS (SELECT id FROM paint_lines WHERE name = 'Dura Matex' LIMIT 1)
INSERT INTO colors (paint_line_id, name, hex_code, color_code, sort_order)
SELECT line.id, name, hex_code, color_code, sort_order FROM line, (VALUES
  ('Blanco Puro', '#FFFFFF', 'DM-001', 1),
  ('Marfil', '#FFFFF0', 'DM-002', 2),
  ('Crema', '#FFFDD0', 'DM-003', 3),
  ('Amarillo Sol', '#FFD700', 'DM-004', 4),
  ('Ocre', '#CC7722', 'DM-005', 5),
  ('Terracota', '#E2725B', 'DM-006', 6),
  ('Rojo Colonial', '#8B0000', 'DM-007', 7),
  ('Rosa Palo', '#FFB6C1', 'DM-008', 8),
  ('Verde Menta', '#98FF98', 'DM-009', 9),
  ('Verde Olivo', '#808000', 'DM-010', 10),
  ('Azul Celeste', '#87CEEB', 'DM-011', 11),
  ('Azul Cobalto', '#0047AB', 'DM-012', 12),
  ('Azul Marino', '#000080', 'DM-013', 13),
  ('Gris Perla', '#E8E8E8', 'DM-014', 14),
  ('Gris Medio', '#808080', 'DM-015', 15),
  ('Gris Carbón', '#36454F', 'DM-016', 16),
  ('Beige', '#F5F5DC', 'DM-017', 17),
  ('Chocolate', '#7B3F00', 'DM-018', 18),
  ('Lila', '#C8A2C8', 'DM-019', 19),
  ('Turquesa', '#40E0D0', 'DM-020', 20)
) AS t(name, hex_code, color_code, sort_order);

-- Sample products
INSERT INTO products (name, slug, description, content_type, product_type, characteristics, sku, cta_type, is_featured)
VALUES
  (
    'Pintura Dura Matex SAONA',
    'pintura-dura-matex-saona',
    'Pintura látex premium mate de alta cobertura, ideal para interiores y exteriores. Formulada con tecnología avanzada para máxima durabilidad.',
    '1 galón (3.78 litros)',
    'Látex premium mate',
    ARRAY['Lavable y fácil de mantener', 'Alta cobertura con excelente rendimiento', 'Bajo olor, ideal para interiores', 'Acabado mate de larga duración', 'Uso recomendado en interiores y exteriores'],
    '004-2025',
    'cotiza',
    true
  ),
  (
    'Imprimante de Alto Rendimiento SAONA',
    'imprimante-alto-rendimiento-saona',
    'Imprimante especializado con protección antifúngica avanzada. Ideal como base preparadora antes de la pintura final.',
    '25 kg',
    'Imprimante base agua',
    ARRAY['Fácil aplicación', 'Secado rápido', 'Protección antifúngica avanzada', 'Multiuso', 'Excelente adherencia'],
    '002-2025',
    'cotiza',
    true
  ),
  (
    'Fragua Premium SAONA',
    'fragua-premium-saona',
    'Cemento blanco de alta resistencia para fragüado de cerámicos y porcelanatos. Sin daños tóxicos, ideal para todo tipo de proyectos.',
    '1 kg',
    'Fragua blanca',
    ARRAY['Color blanco', 'Alta resistencia', 'Fácil aplicación', 'Sin tóxicos', 'Para cerámicos y porcelanatos'],
    '003-2025',
    'cotiza',
    false
  ),
  (
    'Disolvente Tráfico SAONA SH1000',
    'disolvente-trafico-saona-sh1000',
    'Solvente industrial de alta pureza para pinturas de tráfico y uso general. Fórmula especial para máximo rendimiento.',
    '2.8 litros',
    'Solvente industrial',
    ARRAY['Alta pureza', 'Secado uniforme', 'Máximo rendimiento', 'Para pinturas de tráfico', 'Uso profesional'],
    '005-2025',
    'cotiza',
    false
  ),
  (
    'Perfumador Ambiental Lavanda SAONA',
    'perfumador-ambiental-lavanda-saona',
    'Perfumador ambiental antibacterial con aroma a lavanda. Elimina el 99.9% de bacterias y deja un aroma fresco duradero.',
    '1 litro',
    'Limpiador antibacterial',
    ARRAY['Antibacterial al 99.9%', 'Aroma lavanda', 'Uso en todo tipo de superficies', 'Concentrado', 'Larga duración'],
    '006-2025',
    'compra',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- Site settings
INSERT INTO site_settings (key, value) VALUES
  ('phone', '+51 981 272 614'),
  ('whatsapp', '51981272614'),
  ('email_gerencia', 'gerencia@saona.com.pe'),
  ('email_ventas', 'ventas@saona.com.pe'),
  ('address', 'Almacén: Av. Trapiche 2240, Puente Piedra'),
  ('hours', 'Lunes a Viernes: 9 am – 6 pm'),
  ('facebook', 'https://facebook.com/saona'),
  ('instagram', 'https://instagram.com/saona'),
  ('tiktok', 'https://tiktok.com/@saona'),
  ('youtube', 'https://youtube.com/@saona')
ON CONFLICT (key) DO NOTHING;
