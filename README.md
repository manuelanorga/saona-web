# 🎨 SAONA Web — Next.js + Supabase

Portal web completo para SAONA con CMS y simulador de pintado.

## Stack

- **Next.js 14** (App Router)
- **Supabase** (PostgreSQL + Storage)
- **Tailwind CSS**
- **Vercel** (deployment)

## Setup rápido

### 1. Clonar e instalar

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_ADMIN_PASS=tu_contraseña_segura
```

### 3. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. En el SQL Editor, ejecuta el archivo `supabase/schema.sql` completo
3. En **Storage**, crea estos buckets **públicos**:
   - `products` — imágenes de productos
   - `manuals` — PDFs de fichas técnicas
   - `environments` — fotos del simulador
   - `general` — imágenes generales

### 4. Desarrollar localmente

```bash
npm run dev
```

Visita `http://localhost:3000`

### 5. Deploy en Vercel

```bash
vercel deploy
```

O conecta el repo en vercel.com y agrega las variables de entorno.

---

## Páginas

| URL | Descripción |
|-----|-------------|
| `/` | Inicio |
| `/empresa` | Nosotros |
| `/productos` | Catálogo de productos |
| `/productos/[slug]` | Detalle de producto |
| `/pintame` | 🎨 Simulador de pintado |
| `/contacto` | Contacto |
| `/admin` | Panel CMS (contraseña requerida) |
| `/admin/productos` | Gestión de productos |
| `/admin/productos/nuevo` | Crear producto |
| `/admin/colores` | Paleta del simulador |
| `/admin/ambientes` | Fotos del simulador |
| `/admin/mensajes` | Mensajes de contacto |

---

## CMS — Panel Admin

Accede en `/admin`. La contraseña por defecto es `saona2025admin` (cámbiala en `.env.local` con `NEXT_PUBLIC_ADMIN_PASS`).

### Gestión de Productos
- Crear/editar/eliminar productos
- Subir imagen del producto
- Subir PDF de ficha técnica
- Asignar categoría, características, tipo
- Configurar botón (cotiza/compra WhatsApp)
- Activar/desactivar y destacar en inicio

### Simulador de Pintado
- **Ambientes**: sube fotos de salas, dormitorios, baños, etc.
- **Colores**: organiza por líneas de pintura con código y hex

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx           # Inicio
│   ├── empresa/           # Nosotros
│   ├── productos/         # Catálogo + detalle
│   ├── pintame/           # Simulador de pintado
│   ├── contacto/          # Contacto
│   └── admin/             # CMS completo
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── home/              # Hero carousel
│   ├── productos/         # Grid de productos
│   ├── pintame/           # Simulador
│   └── admin/             # Formularios CMS
├── lib/
│   └── supabase.ts        # Cliente Supabase
└── types/
    └── index.ts           # TypeScript types
```

---

## Notas importantes

- El simulador de pintado usa una **superposición CSS** (mix-blend-mode: multiply) para simular el color en la pared. Para resultados más precisos, considera usar Canvas con zonas segmentadas.
- La autenticación del admin es simple (sessionStorage). Para producción con múltiples usuarios, implementa Supabase Auth.
- Los buckets de Supabase deben ser públicos para que las imágenes sean accesibles.
