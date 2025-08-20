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
      heroSubtitle: 'Potencia tu vida con nuestros suplementos premium',
      heroDescription: 'Descubre una nueva dimensión de bienestar y rendimiento con nuestra línea exclusiva de suplementos nutricionales y productos de cuidado personal. Desde Mallorca, cada producto está diseñado para maximizar tu potencial y transformar tu estilo de vida en toda España.',
      heroButton: 'Conoce Nuestra Historia',
      
      // About Us Section
      aboutTitle: 'Nuestra Historia',
      aboutSubtitle: 'Descubre cómo MANPOWERS, desde Manacor, Mallorca, se convirtió en sinónimo de calidad, innovación y excelencia en el mundo del bienestar para toda España.',
      aboutOriginsTitle: 'Nuestros Orígenes',
      aboutOrigins1: 'MANPOWERS nació en Manacor, Mallorca, de una visión clara: crear productos que potencien el máximo rendimiento humano. Fundada por un equipo de expertos en nutrición y bienestar, nuestra empresa española se estableció con el compromiso de ofrecer suplementos premium y productos de cuidado personal de la más alta calidad a toda España.',
      aboutOrigins2: 'Desde nuestros inicios en las Islas Baleares, hemos creído que cada persona tiene un potencial ilimitado. Nuestros suplementos nutricionales y productos de bienestar están diseñados para desbloquear esa fuerza interior y ayudar a nuestros clientes en toda España a alcanzar sus metas más ambiciosas de salud y rendimiento.',
      aboutValuesTitle: 'Nuestros Valores',
      aboutQuality: 'Calidad Premium',
      aboutQualityDesc: 'Utilizamos solo los mejores ingredientes y procesos de fabricación.',
      aboutInnovation: 'Innovación Constante',
      aboutInnovationDesc: 'Investigamos y desarrollamos continuamente nuevas fórmulas.',
      aboutCommitment: 'Compromiso Total',
      aboutCommitmentDesc: 'Nos dedicamos completamente al bienestar de nuestros clientes.',
      aboutMissionTitle: 'Nuestra Misión',
      aboutMission: 'Empoderar a las personas para que alcancen su máximo potencial físico y mental a través de productos innovadores, seguros y efectivos que transformen su calidad de vida.',
      aboutVisionTitle: 'Nuestra Visión',
      aboutVision: 'Ser la marca líder mundial en productos de bienestar y rendimiento, reconocida por nuestra excelencia, innovación y el impacto positivo en la vida de millones de personas.',
      aboutStatsTitle: 'Más sobre nosotros',
      aboutYears: 'Años de Experiencia',
      aboutClients: 'Clientes Satisfechos',
      aboutProducts: 'Productos Premium',
      aboutQualityGuarantee: 'Calidad Garantizada',
      aboutCommitmentTitle: 'Nuestro Compromiso Contigo',
      aboutCommitmentText: 'En MANPOWERS, cada producto pasa por rigurosos controles de calidad y está respaldado por investigación científica. No solo vendemos productos, construimos relaciones duraderas basadas en la confianza y los resultados.',
      aboutSuccess: 'Tu éxito es nuestro éxito',
      
      // Products Section
      productsTitle: 'Nuestros Productos',
      productsSubtitle: 'Descubre nuestra línea exclusiva de suplementos nutricionales y productos premium diseñados en Mallorca para potenciar tu bienestar y rendimiento en toda España.',
      productsComingSoon: 'Próximamente Disponibles',
      productsComingSoonDesc: 'Estamos finalizando los últimos detalles para el lanzamiento de nuestra tienda online española. Muy pronto podrás adquirir todos estos suplementos premium y productos de bienestar directamente desde nuestra plataforma, con envío a toda España.',
      productsAvailableSoon: 'Próximamente Disponible',
      productsInterested: '¿Interesado en nuestros productos?',
      productsInterestedDesc: 'Mantente al tanto de nuestras novedades desde Manacor, Mallorca, y sé el primero en conocer cuando nuestros suplementos nutricionales estén disponibles para la venta en España. Cada producto MANPOWERS está respaldado por nuestra garantía de calidad premium y años de experiencia en el sector del bienestar.',
      productsWhatsapp: 'Contáctanos por WhatsApp',
      
      // Product Names and Descriptions
      macaName: 'MAN POWERS Maca Forte 10:1 - 5000',
      macaDescription: 'Suplemento premium elaborado a partir de raíz de Maca Andina concentrada, que ofrece una potencia de 5000mg por cápsula. Su fórmula está diseñada para brindarte energía explosiva, resistencia física y un mayor enfoque mental.',
      omegaName: 'Omega 3 - Puro aceite de pescado',
      omegaDescription: 'Omega 3 puro aceite de pescado, enriquecido con Vitamina E. Esencial para la salud cardiovascular, función cerebral y bienestar general.',
      solarName: 'MAN Protector Solar Facial y Corporal SPF 50+',
      solarDescription: 'Tu aliado perfecto para el verano. Este innovador protector solar SPF 50+ te ofrece una protección total frente a los rayos UVA/UVB, combinada con un acelerador del bronceado. Su fórmula avanzada está enriquecida con Ácido Hialurónico.',
      
      // Footer
      footerCompany: 'Empresa líder en suplementos premium y productos de bienestar desde Manacor, Mallorca.',
      footerContact: 'Contacto',
      footerAddress: 'Manacor, Mallorca, España',
      footerCopyright: '© 2024 MANPOWERS. Todos los derechos reservados.'
    }
  },
  en: {
    translation: {
      // Header
      phone: '670 372 239',
      email: 'info@manpowers.es',
      
      // Hero Section
      heroTitle: 'MANPOWERS',
      heroSubtitle: 'Power your life with our premium supplements from Mallorca',
      heroDescription: 'Discover a new dimension of wellness and performance with our exclusive line of nutritional supplements and personal care products. From Manacor, Mallorca, each product is designed to maximize your potential and transform your lifestyle throughout Spain.',
      heroButton: 'Learn Our Story',
      
      // About Us Section
      aboutTitle: 'Our Story',
      aboutSubtitle: 'Discover how MANPOWERS, from Manacor, Mallorca, became synonymous with quality, innovation and excellence in the wellness world for all of Spain.',
      aboutOriginsTitle: 'Our Origins',
      aboutOrigins1: 'MANPOWERS was born in Manacor, Mallorca, from a clear vision: to create products that enhance maximum human performance. Founded by a team of experts in nutrition and wellness, our Spanish company was established with the commitment to offer premium supplements and personal care products of the highest quality throughout Spain.',
      aboutOrigins2: 'Since our beginnings in the Balearic Islands, we have believed that every person has unlimited potential. Our nutritional supplements and wellness products are designed to unlock that inner strength and help our customers throughout Spain achieve their most ambitious health and performance goals.',
      aboutValuesTitle: 'Our Values',
      aboutQuality: 'Premium Quality',
      aboutQualityDesc: 'We use only the best ingredients and manufacturing processes.',
      aboutInnovation: 'Constant Innovation',
      aboutInnovationDesc: 'We continuously research and develop new formulas.',
      aboutCommitment: 'Total Commitment',
      aboutCommitmentDesc: 'We are completely dedicated to our customers\' wellbeing.',
      aboutMissionTitle: 'Our Mission',
      aboutMission: 'To empower people to reach their maximum physical and mental potential through innovative, safe and effective products that transform their quality of life.',
      aboutVisionTitle: 'Our Vision',
      aboutVision: 'To be the world\'s leading brand in wellness and performance products, recognized for our excellence, innovation and positive impact on the lives of millions of people.',
      aboutStatsTitle: 'More about us',
      aboutYears: 'Years of Experience',
      aboutClients: 'Satisfied Customers',
      aboutProducts: 'Premium Products',
      aboutQualityGuarantee: 'Quality Guaranteed',
      aboutCommitmentTitle: 'Our Commitment to You',
      aboutCommitmentText: 'At MANPOWERS, every product undergoes rigorous quality controls and is backed by scientific research. We don\'t just sell products, we build lasting relationships based on trust and results.',
      aboutSuccess: 'Your success is our success',
      
      // Products Section
      productsTitle: 'Our Products',
      productsSubtitle: 'Discover our exclusive line of nutritional supplements and premium products designed in Mallorca to enhance your wellness and performance throughout Spain.',
      productsComingSoon: 'Coming Soon',
      productsComingSoonDesc: 'We are finalizing the last details for the launch of our Spanish online store. Very soon you will be able to purchase all these premium supplements and wellness products directly from our platform, with shipping throughout Spain.',
      productsAvailableSoon: 'Available Soon',
      productsInterested: 'Interested in our products?',
      productsInterestedDesc: 'Stay tuned for our news from Manacor, Mallorca, and be the first to know when our nutritional supplements are available for sale in Spain. Every MANPOWERS product is backed by our premium quality guarantee and years of experience in the wellness sector.',
      productsWhatsapp: 'Contact us on WhatsApp',
      
      // Product Names and Descriptions
      macaName: 'MAN POWERS Maca Forte 10:1 - 5000',
      macaDescription: 'Premium supplement made from concentrated Andean Maca root, offering a potency of 5000mg per capsule. Its formula is designed to provide explosive energy, physical endurance and greater mental focus.',
      omegaName: 'Omega 3 - Pure fish oil',
      omegaDescription: 'Pure fish oil Omega 3, enriched with Vitamin E. Essential for cardiovascular health, brain function and general wellbeing.',
      solarName: 'MAN Facial and Body Sunscreen SPF 50+',
      solarDescription: 'Your perfect summer ally. This innovative SPF 50+ sunscreen offers total protection against UVA/UVB rays, combined with a tanning accelerator. Its advanced formula is enriched with Hyaluronic Acid.',
      
      // Footer
      footerCompany: 'Leading company in premium supplements and wellness products from Manacor, Mallorca.',
      footerContact: 'Contact',
      footerAddress: 'Manacor, Mallorca, Spain',
      footerCopyright: '© 2024 MANPOWERS. All rights reserved.'
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