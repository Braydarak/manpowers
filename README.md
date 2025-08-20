# MANPOWERS - Sitio Web Oficial

*[English version below](#english-version)*

## 🇪🇸 Versión en Español

### 📋 Descripción

Sitio web oficial de **MANPOWERS**, empresa líder en suplementos premium y productos de bienestar ubicada en Manacor, Mallorca. Ofrecemos una línea exclusiva de productos diseñados para maximizar el potencial humano y transformar el estilo de vida de nuestros clientes en toda España.

### 🌟 Características

- **Hero Section** con video de fondo y llamada a la acción
- **Sección About Us** con historia, misión, visión y valores de la empresa
- **Catálogo de Productos** con información detallada de suplementos premium
- **Diseño Responsive** optimizado para móviles, tablets y desktop
- **SEO Optimizado** para posicionamiento en España con enfoque local en Mallorca
- **Integración WhatsApp** para contacto directo
- **Esquema de colores** negro, blanco y grises para una estética premium

### 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router** - Enrutamiento para aplicaciones React

### 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/manpowers/manpowers-web.git
   cd manpowers-web
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Construir para producción**
   ```bash
   npm run build
   ```

### 🚀 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta el linter ESLint

### 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── footer/         # Componente Footer
│   └── header/         # Componente Header con menú responsive
├── sections/           # Secciones principales
│   ├── hero/          # Sección Hero con video
│   ├── aboutUs/       # Sección Sobre Nosotros
│   └── products/      # Sección de Productos
├── pages/             # Páginas de la aplicación
├── assets/            # Recursos estáticos
└── App.tsx            # Componente principal
```

### 🎨 Productos Destacados

- **MAN POWERS Maca Forte 10:1 - 5000** - Suplemento premium de Maca Andina
- **Omega 3 - Puro aceite de pescado** - Enriquecido con Vitamina E
- **MAN Protector Solar SPF 50+** - Con ácido hialurónico y acelerador de bronceado

### 🌍 SEO y Localización

- Optimizado para búsquedas en España
- Meta tags geográficos para Manacor, Mallorca
- Structured data con Schema.org
- Sitemap.xml y robots.txt incluidos
- Contenido optimizado con palabras clave relevantes

### 📱 Contacto

- **WhatsApp**: Integración directa para consultas
- **Ubicación**: Manacor, Mallorca, España
- **Cobertura**: Toda España

---

## 🇬🇧 English Version

### 📋 Description

Official website for **MANPOWERS**, a leading company in premium supplements and wellness products located in Manacor, Mallorca. We offer an exclusive line of products designed to maximize human potential and transform our customers' lifestyles throughout Spain.

### 🌟 Features

- **Hero Section** with background video and call-to-action
- **About Us Section** with company history, mission, vision, and values
- **Product Catalog** with detailed information about premium supplements
- **Responsive Design** optimized for mobile, tablet, and desktop
- **SEO Optimized** for positioning in Spain with local focus on Mallorca
- **WhatsApp Integration** for direct contact
- **Color Scheme** black, white, and grays for a premium aesthetic

### 🛠️ Technologies Used

- **React 18** - JavaScript library for user interfaces
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Routing for React applications

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manpowers/manpowers-web.git
   cd manpowers-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### 🚀 Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Previews the production build
- `npm run lint` - Runs ESLint linter

### 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── footer/         # Footer component
│   └── header/         # Header component with responsive menu
├── sections/           # Main sections
│   ├── hero/          # Hero section with video
│   ├── aboutUs/       # About Us section
│   └── products/      # Products section
├── pages/             # Application pages
├── assets/            # Static assets
└── App.tsx            # Main component
```

### 🎨 Featured Products

- **MAN POWERS Maca Forte 10:1 - 5000** - Premium Andean Maca supplement
- **Omega 3 - Pure fish oil** - Enriched with Vitamin E
- **MAN Solar Protector SPF 50+** - With hyaluronic acid and tanning accelerator

### 🌍 SEO and Localization

- Optimized for searches in Spain
- Geographic meta tags for Manacor, Mallorca
- Structured data with Schema.org
- Sitemap.xml and robots.txt included
- Content optimized with relevant keywords

### 📱 Contact

- **WhatsApp**: Direct integration for inquiries
- **Location**: Manacor, Mallorca, Spain
- **Coverage**: All of Spain

---

### 📄 License

This project is proprietary and confidential. All rights reserved to MANPOWERS.

### 🤝 Contributing

This is a private project. For any suggestions or improvements, please contact the development team.

---

**MANPOWERS** - *Potencia tu vida con nuestros productos premium*

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
