import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traducciones
const resources = {
  es: {
    translation: {
      // Header
      phone: '670 372 239',
      email: 'info@manpowers.es',
      
      // Hero Section
      heroTitle: 'MANPOWERS',
      heroSubtitle: 'Eficacia y Protección para tu Piel',
      heroDescription: 'Descubre nuestra línea de productos premium enfocados en la eficacia y protección de la piel. Comprometidos con un mundo más sostenible usando envases de plástico y vidrio reciclables desde Madrid, España.',
      heroButton: 'Conoce Nuestra Historia',
      
      // About Us Section
      aboutTitle: 'Nuestra Historia',
      aboutSubtitle: 'Desde Madrid, España, creamos productos eficaces para la protección de la piel',
      aboutOriginsTitle: 'Nuestros Orígenes',
      aboutOrigins1: 'MANPOWERS nació en Madrid, España, con una misión clara: desarrollar productos eficaces para la protección y cuidado de la piel.',
      aboutOrigins2: 'Desde nuestros inicios en la capital española, nos hemos comprometido con la sostenibilidad, utilizando envases de plástico y vidrio reciclables, y procesos que respetan tanto tu piel como el medio ambiente.',
      aboutValuesTitle: 'Nuestros Valores',
      aboutQuality: 'Calidad Premium',
      aboutQualityDesc: 'Utilizamos solo los mejores ingredientes y procesos de fabricación.',
      aboutInnovation: 'Innovación Constante',
      aboutInnovationDesc: 'Investigamos y desarrollamos continuamente nuevas fórmulas.',
      aboutCommitment: 'Compromiso Total',
      aboutCommitmentDesc: 'Nos dedicamos completamente al bienestar de nuestros clientes.',
      aboutMissionTitle: 'Nuestra Misión',
      aboutMission: 'Desarrollar productos eficaces para la protección de la piel, utilizando envases sostenibles de plástico y vidrio reciclables, contribuyendo a un mundo más responsable con el medio ambiente.',
      aboutVisionTitle: 'Nuestra Visión',
      aboutVision: 'Ser la marca líder en protección de la piel, reconocida por nuestra eficacia, sostenibilidad y compromiso con un futuro más verde mediante envases reciclables.',
      aboutStatsTitle: 'Más sobre nosotros',
      aboutYears: 'Años de Experiencia',
      aboutClients: 'Clientes Satisfechos',
      aboutProducts: 'Productos Premium',
      aboutQualityGuarantee: 'Calidad Garantizada',
      aboutCommitmentTitle: 'Nuestro Compromiso Contigo',
      aboutCommitmentText: 'En MANPOWERS, la protección de tu piel y el cuidado del planeta son nuestras prioridades. Cada producto utiliza envases reciclables y fórmulas eficaces para garantizar resultados excepcionales.',
      aboutSuccess: 'Tu piel protegida, nuestro planeta cuidado',
      
      // Products Section
      productsTitle: 'Nuestros Productos',
      productsSubtitle: 'Descubre nuestra gama de productos eficaces para la protección de la piel en envases sostenibles',
      productsComingSoon: 'Próximamente Disponibles',
      productsComingSoonDesc: 'Estamos finalizando los últimos detalles para el lanzamiento de nuestra tienda online. Muy pronto podrás adquirir nuestros productos en envases reciclables.',
      productsAvailableSoon: 'Próximamente Disponible',
      productsInterested: '¿Interesado en nuestros productos?',
      productsInterestedDesc: 'Mantente al tanto de nuestras novedades desde Madrid, España, y sé el primero en conocer cuando nuestros suplementos nutricionales estén disponibles para la venta en España. Cada producto MANPOWERS está respaldado por nuestra garantía de calidad premium y años de experiencia en el sector del bienestar.',
      productsWhatsapp: 'Contáctanos por WhatsApp',
      
      // Product Names and Descriptions
      macaName: 'MAN POWERS Maca Forte 10:1 - 5000',
      macaDescription: 'Suplemento premium elaborado a partir de raíz de Maca Andina concentrada, que ofrece una potencia de 5000mg por cápsula. Su fórmula está diseñada para brindarte energía explosiva, resistencia física y un mayor enfoque mental.',
      omegaName: 'Omega 3 - Puro aceite de pescado',
      omegaDescription: 'Omega 3 puro aceite de pescado, enriquecido con Vitamina E. Esencial para la salud cardiovascular, función cerebral y bienestar general.',
      solarName: 'MAN Protector Solar Facial y Corporal SPF 50+',
      solarDescription: 'Tu aliado perfecto para el verano. Este innovador protector solar SPF 50+ te ofrece una protección total frente a los rayos UVA/UVB, combinada con un acelerador del bronceado. Su fórmula avanzada está enriquecida con Ácido Hialurónico.',
      
      // Footer
      footerCompany: 'Empresa líder en suplementos premium y productos de bienestar desde Madrid, España.',
      footerContact: 'Contacto',
      footerAddress: 'C. Severo Ochoa, 5, 28860 Paracuellos de Jarama, Madrid',
      footerCopyright: '© MANPOWERS. Todos los derechos reservados.',
      
      // Page Title
      pageTitle: 'MANPOWERS - Suplementos Premium y Productos de Bienestar | España',
      
      // Amazon Buttons
      buyOn: 'Comprar',
      buyOn100ml: '100ml',
      buyOn50ml: '50ml',
      
      // Breadcrumbs
      home: 'Inicio',
      products: 'Productos',
      about: 'Nosotros',
      contact: 'Contacto',
      
      // Products Mobile
      productsMobileAvailableSoon: 'Próximamente',
      
      // Locations Section
      locationsTitle: 'Nuestras Ubicaciones',
      locationsSubtitle: 'Nos encontramos en dos ubicaciones estratégicas para ofrecerte el mejor servicio y productos de protección para la piel.',
      locationsMadridTitle: 'Madrid',
      locationsMadridType: 'Sede Principal',
      locationsMallorcaTitle: 'Mallorca',
      locationsMallorcaType: 'Oficina Regional',
      locationsMessage: 'Visítanos en cualquiera de nuestras ubicaciones o contáctanos para más información sobre nuestros productos sostenibles.'
    }
  },
  en: {
    translation: {
      // Header
      phone: '670 372 239',
      email: 'info@manpowers.es',
      
      // Hero Section
      heroTitle: 'MANPOWERS',
      heroSubtitle: 'Efficacy and Skin Protection',
      heroDescription: 'Discover our premium product line focused on skin efficacy and protection. Committed to a more sustainable world using recyclable plastic and glass containers from Madrid, Spain.',
      heroButton: 'Learn Our Story',
      
      // About Us Section
      aboutTitle: 'Our Story',
      aboutSubtitle: 'From Madrid, Spain, we create effective products for skin protection',
      aboutOriginsTitle: 'Our Origins',
      aboutOrigins1: 'MANPOWERS was born in Madrid, Spain, with a clear mission: to develop effective products for skin protection and care.',
      aboutOrigins2: 'Since our beginnings in the Spanish capital, we have been committed to sustainability, using recyclable plastic and glass containers, and processes that respect both your skin and the environment.',
      aboutValuesTitle: 'Our Values',
      aboutQuality: 'Premium Quality',
      aboutQualityDesc: 'We use only the best ingredients and manufacturing processes.',
      aboutInnovation: 'Constant Innovation',
      aboutInnovationDesc: 'We continuously research and develop new formulas.',
      aboutCommitment: 'Total Commitment',
      aboutCommitmentDesc: 'We are completely dedicated to our customers\' wellbeing.',
      aboutMissionTitle: 'Our Mission',
      aboutMission: 'To develop effective products for skin protection, using sustainable recyclable plastic and glass containers, contributing to a more environmentally responsible world.',
      aboutVisionTitle: 'Our Vision',
      aboutVision: 'To be the leading brand in skin protection, recognized for our efficacy, sustainability and commitment to a greener future through recyclable packaging.',
      aboutStatsTitle: 'More about us',
      aboutYears: 'Years of Experience',
      aboutClients: 'Satisfied Customers',
      aboutProducts: 'Premium Products',
      aboutQualityGuarantee: 'Quality Guaranteed',
      aboutCommitmentTitle: 'Our Commitment to You',
      aboutCommitmentText: 'At MANPOWERS, protecting your skin and caring for the planet are our priorities. Every product uses recyclable containers and effective formulas to guarantee exceptional results.',
      aboutSuccess: 'Your protected skin, our cared planet',
      
      // Products Section
      productsTitle: 'Our Products',
      productsSubtitle: 'Discover our range of effective skin protection products in sustainable packaging',
      productsComingSoon: 'Coming Soon',
      productsComingSoonDesc: 'We are finalizing the last details for the launch of our online store. Very soon you will be able to purchase our products in recyclable containers.',
      productsAvailableSoon: 'Available Soon',
      productsInterested: 'Interested in our products?',
      productsInterestedDesc: 'Stay tuned for our news from Madrid, Spain, and be the first to know when our nutritional supplements are available for sale in Spain. Every MANPOWERS product is backed by our premium quality guarantee and years of experience in the wellness sector.',
      productsWhatsapp: 'Contact us on WhatsApp',
      
      // Product Names and Descriptions
      macaName: 'MAN POWERS Maca Forte 10:1 - 5000',
      macaDescription: 'Premium supplement made from concentrated Andean Maca root, offering a potency of 5000mg per capsule. Its formula is designed to provide explosive energy, physical endurance and greater mental focus.',
      omegaName: 'Omega 3 - Pure fish oil',
      omegaDescription: 'Pure fish oil Omega 3, enriched with Vitamin E. Essential for cardiovascular health, brain function and general wellbeing.',
      solarName: 'MAN Facial and Body Sunscreen SPF 50+',
      solarDescription: 'Your perfect summer ally. This innovative SPF 50+ sunscreen offers total protection against UVA/UVB rays, combined with a tanning accelerator. Its advanced formula is enriched with Hyaluronic Acid.',
      
      // Footer
      footerCompany: 'Leading company in premium supplements and wellness products from Madrid, Spain.',
      footerContact: 'Contact',
      footerAddress: 'C. Severo Ochoa, 5, 28860 Paracuellos de Jarama, Madrid',
      footerCopyright: '© MANPOWERS. All rights reserved.',
      
      // Page Title
      pageTitle: 'MANPOWERS - Premium Supplements and Wellness Products | Spain',
      
      // Amazon Buttons
      buyOn: 'Buy',
      buyOn100ml: '100ml',
      buyOn50ml: '50ml',
      
      // Breadcrumbs
      home: 'Home',
      products: 'Products',
      about: 'About',
      contact: 'Contact',
      
      // Products Mobile
      productsMobileAvailableSoon: 'Coming Soon',
      
      // Locations Section
      locationsTitle: 'Our Locations',
      locationsSubtitle: 'We are located in two strategic locations to offer you the best service and skin protection products.',
      locationsMadridTitle: 'Madrid',
      locationsMadridType: 'Main Headquarters',
      locationsMallorcaTitle: 'Mallorca',
      locationsMallorcaType: 'Regional Office',
      locationsMessage: 'Visit us at any of our locations or contact us for more information about our sustainable products.'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;