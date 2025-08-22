export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export const seoConfigs = {
  home: {
    title: 'MANPOWERS - Suplementos Premium desde Mallorca | España',
    description: 'Descubre MANPOWERS, empresa líder en suplementos nutricionales premium desde Manacor, Mallorca. Maca Andina, Omega 3, protector solar y más productos de bienestar para toda España.',
    keywords: 'suplementos nutricionales, maca andina, omega 3, protector solar, Mallorca, Manacor, España, bienestar, salud, productos premium, MANPOWERS',
    ogTitle: 'MANPOWERS - Suplementos Premium desde Mallorca',
    ogDescription: 'Empresa líder en suplementos nutricionales premium desde Manacor, Mallorca. Productos de bienestar para toda España.',
    ogImage: '/MAN-LOGO-BLANCO.png',
    canonicalUrl: 'https://manpowers.es/'
  },
  products: {
    title: 'Productos MANPOWERS - Suplementos Premium | Mallorca España',
    description: 'Catálogo completo de productos MANPOWERS: Maca Forte 5000mg, Omega 3 puro, Protector Solar SPF 50+. Suplementos premium desde Mallorca para toda España.',
    keywords: 'maca forte, omega 3, protector solar SPF 50, suplementos premium, productos MANPOWERS, Mallorca, España, maca andina 5000mg',
    ogTitle: 'Productos MANPOWERS - Suplementos Premium',
    ogDescription: 'Catálogo completo de suplementos nutricionales premium desde Mallorca.',
    canonicalUrl: 'https://manpowers.es/productos'
  },
  about: {
    title: 'Sobre MANPOWERS - Historia y Misión | Empresa de Mallorca',
    description: 'Conoce la historia de MANPOWERS, empresa fundada en Manacor, Mallorca. Nuestra misión, visión y compromiso con la calidad en suplementos nutricionales para España.',
    keywords: 'MANPOWERS historia, empresa Mallorca, Manacor, misión visión, calidad premium, suplementos España, fundación empresa',
    ogTitle: 'Sobre MANPOWERS - Historia y Misión',
    ogDescription: 'Conoce la historia y misión de MANPOWERS, empresa de suplementos premium desde Mallorca.',
    canonicalUrl: 'https://manpowers.es/nosotros'
  }
};

export const updateSEOTags = (config: SEOConfig) => {
  // Update title
  document.title = config.title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', config.description);
  }
  
  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', config.keywords);
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && config.ogTitle) {
    ogTitle.setAttribute('content', config.ogTitle);
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription && config.ogDescription) {
    ogDescription.setAttribute('content', config.ogDescription);
  }
  
  // Update canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && config.canonicalUrl) {
    canonical.setAttribute('href', config.canonicalUrl);
  }
};