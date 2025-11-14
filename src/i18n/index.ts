import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Traducciones
const resources = {
  es: {
    translation: {
      // Header
      phone: "670 372 239",
      email: "info@manpowers.es",

      // Hero Section
      heroSubtitle: "Potencia tu Rendimiento Deportivo",
      heroDescription:
        "Explora nuestra gama de suplementos deportivos adaptados a tu disciplina. Descubre abajo los productos especializados para tu deporte y maximiza tu rendimiento",
      heroSportsButton: "Ver todos los deportes",
      heroDirectToSport: "O entra directamente a tu deporte",

      // About Us Section
      aboutTitle: "Nuestra Historia",
      aboutSubtitle:
        "Desde Madrid, España, creamos suplementos deportivos de élite para atletas",
      aboutOriginsTitle: "Nuestros Orígenes",
      aboutOrigins1:
        "MANPOWERS nació en Madrid, España, con una misión clara: desarrollar suplementos deportivos de máxima calidad para potenciar el rendimiento atlético.",
      aboutOrigins2:
        "Desde nuestros inicios en la capital española, nos hemos especializado en nutrición deportiva avanzada, creando productos que ayudan a los atletas a alcanzar su máximo potencial.",
      aboutValuesTitle: "Nuestros Valores",
      aboutQuality: "Calidad Premium",
      aboutQualityDesc:
        "Utilizamos solo los mejores ingredientes y procesos de fabricación.",
      aboutInnovation: "Innovación Constante",
      aboutInnovationDesc:
        "Investigamos y desarrollamos continuamente nuevas fórmulas.",
      aboutCommitment: "Compromiso Total",
      aboutCommitmentDesc:
        "Nos dedicamos completamente al bienestar de nuestros clientes.",
      aboutMissionTitle: "Nuestra Misión",
      aboutMission:
        "Desarrollar suplementos deportivos de élite que maximicen el rendimiento atlético, utilizando ingredientes de máxima pureza y fórmulas científicamente respaldadas para deportistas de alto nivel.",
      aboutVisionTitle: "Nuestra Visión",
      aboutVision:
        "Utilizar tecnología avanzada para desarrollar productos innovadores que maximicen el rendimiento atlético y ayuden a los deportistas a alcanzar su máximo potencial a través de la ciencia y la innovación.",
      aboutStatsTitle: "Más sobre nosotros",
      aboutYears: "Años de Experiencia",
      aboutClients: "Clientes Satisfechos",
      aboutProducts: "Productos Premium",
      aboutQualityGuarantee: "Calidad Garantizada",
      aboutCommitmentTitle: "Nuestro Compromiso Contigo",
      aboutCommitmentText:
        "En MANPOWERS, tu rendimiento deportivo es nuestra prioridad. Cada suplemento está formulado con ingredientes de élite y pasa por rigurosos controles de calidad para garantizar resultados excepcionales.",
      aboutSuccess: "Tu máximo rendimiento, nuestro compromiso",

      // Products Section
      productsTitle: "Nuestros Suplementos",
      productsSubtitle:
        "Descubre nuestra gama de suplementos deportivos de élite diseñados para maximizar tu rendimiento atlético",
      productsComingSoon: "Próximamente Disponibles",
      productsComingSoonDesc:
        "Estamos finalizando los últimos detalles para el lanzamiento de nuestra tienda online. Muy pronto podrás adquirir nuestros suplementos deportivos premium.",
      productsAvailableSoon: "Próximamente Disponible",
      productsInterested: "¿Interesado en nuestros productos?",
      productsInterestedDesc:
        "Mantente al tanto de nuestras novedades desde Madrid, España, y sé el primero en conocer cuando nuestros suplementos nutricionales estén disponibles para la venta en España. Cada producto MANPOWERS está respaldado por nuestra garantía de calidad premium y años de experiencia en el sector del bienestar.",

      // Product Names and Descriptions
      macaName: "MAN POWERS Maca Forte 10:1 - 5000",
      macaDescription:
        "Suplemento premium elaborado a partir de raíz de Maca Andina concentrada, que ofrece una potencia de 5000mg por cápsula. Su fórmula está diseñada para brindarte energía explosiva, resistencia física y un mayor enfoque mental.",
      omegaName: "Omega 3 - Puro aceite de pescado",
      omegaDescription:
        "Omega 3 puro aceite de pescado, enriquecido con Vitamina E. Esencial para la salud cardiovascular, función cerebral y bienestar general.",
      solarName: "MAN Protector Solar Facial y Corporal SPF 50+",
      solarDescription:
        "Tu aliado perfecto para el verano. Este innovador protector solar SPF 50+ te ofrece una protección total frente a los rayos UVA/UVB, combinada con un acelerador del bronceado. Su fórmula avanzada está enriquecida con Ácido Hialurónico.",

      // Footer
      footerCompany:
        "Empresa líder en suplementos premium y productos de bienestar desde Madrid, España.",
      footerContact: "Contacto",
      footerAddress: "C. Severo Ochoa, 5, 28860 Paracuellos de Jarama, Madrid",
      footerCopyright: "© MANPOWERS. Todos los derechos reservados.",

      // Page Title
      pageTitle:
        "MANPOWERS - Suplementos Premium y Productos de Bienestar | España",

      // Amazon Buttons
      buyOn: "Comprar",
      buyOn100ml: "100ml",
      buyOn50ml: "50ml",

      // Breadcrumbs
      home: "Inicio",
      products: "Productos",
      about: "Nosotros",
      contact: "Contacto",

      // Products Mobile
      productsMobileAvailableSoon: "Próximamente",

      // Locations Section
      locationsTitle: "Nuestras Ubicaciones",
      locationsSubtitle:
        "Nos encontramos en dos ubicaciones estratégicas para ofrecerte el mejor servicio y suplementos deportivos de élite.",
      locationsMadridTitle: "Madrid",
      locationsMadridType: "Sede Principal",
      locationsMallorcaTitle: "Mallorca",
      locationsMallorcaType: "Oficina Regional",
      locationsMessage:
        "Visítanos en cualquiera de nuestras ubicaciones o contáctanos para más información sobre nuestros suplementos deportivos.",

      // Sports Categories Section
      sportsTitle: "Deportes",
      sportsSubtitle:
        "Desarrollamos productos especializados para los siguientes deportes",
      sportsButton: "Ver Productos",

      // Sports names and descriptions
      "sports.archery": "Tiro",
      "sports.archeryDesc":
        "Suplementos para mejorar la concentración, estabilidad y precisión en deportes de tiro.",
      "sports.archerySlogan": "Precisión y concentración absoluta",

      "sports.fencing": "Esgrima",
      "sports.fencingDesc":
        "Productos diseñados para potenciar la agilidad, reflejos y resistencia en esgrima.",
      "sports.fencingSlogan": "Elegancia y destreza en cada movimiento",

      "sports.golf": "Golf",
      "sports.golfDesc":
        "Suplementación especializada para mantener la concentración y resistencia durante rondas largas.",
      "sports.golfSlogan": "Perfección en cada swing",

      "sports.cycling": "Ciclismo",
      "sports.cyclingDesc":
        "Productos específicos para ciclistas que necesitan energía sostenida y recuperación muscular.",
      "sports.cyclingSlogan": "Velocidad y resistencia sin límites",

      "sports.waterSports": "Náutica",
      "sports.waterSportsDesc":
        "Suplementos para deportes náuticos enfocados en resistencia y fuerza en ambientes marinos.",
      "sports.waterSportsSlogan": "Domina las aguas con confianza",

      // Legacy sport translations (keeping for compatibility)
      sportShootingTitle: "Tiro",
      sportShootingDescription:
        "Suplementos para mejorar la concentración, estabilidad y precisión en deportes de tiro.",
      sportFencingTitle: "Esgrima",
      sportFencingDescription:
        "Productos diseñados para potenciar la agilidad, reflejos y resistencia en esgrima.",
      sportGolfTitle: "Golf",
      sportGolfDescription:
        "Suplementación especializada para mantener la concentración y resistencia durante rondas largas.",
      sportCyclingTitle: "Ciclismo",
      sportCyclingDescription:
        "Productos específicos para ciclistas que necesitan energía sostenida y recuperación muscular.",
      sportNauticalTitle: "Náutica",
      sportNauticalDescription:
        "Suplementos para deportes náuticos enfocados en resistencia y fuerza en ambientes marinos.",

      // ProductsPage specific translations
      backToSports: "Volver a Deportes",

      // Sports specific translations
      "sports.buy": "Comprar",
      "sports.addToCart": "Añadir al carrito",
      "sports.available": "Disponible",
      "sports.comingSoon": "Próximamente",
      // Cart specific
      "cart.added": "Producto añadido al carrito",
      "cart.open": "Abrir carrito",
      "cart.title": "Tu carrito",
      "cart.close": "Cerrar carrito",
      "cart.empty": "Tu carrito está vacío.",
      "cart.noImage": "Sin imagen",
      "cart.noPrice": "Sin precio",
      "cart.decreaseQty": "Disminuir cantidad",
      "cart.increaseQty": "Aumentar cantidad",
      "cart.remove": "Quitar",
      "cart.total": "Total",
      "cart.clear": "Vaciar",
      "cart.checkout": "Pagar",

      "cart.subtotal": "Subtotal",
      "cart.discount": "Descuento",
      "cart.emailLabel": "Envío y contacto",
      "cart.emailPlaceholder": "Tu email para recibir los datos de la compra",
      "cart.invalidEmail": "Introduce un email válido",
      "cart.addressLabel": "Dirección",
      "cart.addressPlaceholder": "Tu dirección completa",
      "cart.postalCodeLabel": "Código postal",
      "cart.postalCodePlaceholder": "Ej.: 28001",
      "cart.localityLabel": "Localidad",
      "cart.localityPlaceholder": "Ej.: Madrid",
      "cart.provinceLabel": "Provincia",
      "cart.provincePlaceholder": "Ej.: Madrid",
      "cart.addressRequired": "La dirección es obligatoria",
      "cart.postalRequired": "El código postal es obligatorio",
      "cart.localityRequired": "La localidad es obligatoria",
      "cart.provinceRequired": "La provincia es obligatoria",
      "cart.promoInvalid": "Código de promoción no válido",
      "cart.promoError": "Error al validar el código de promoción",
      "cart.paymentErrorLoad": "Error cargando el sistema de pago",
      "cart.paymentErrorRedirect": "Error redirigiendo a la pasarela",
      "cart.paymentErrorForm": "Error en el formulario de pago",
      "cart.paymentErrorStart": "Error iniciando el pago",
      "cart.paymentErrorProcess": "Error procesando el pago",
      "cart.paymentSuccess": "¡Pago realizado con éxito!",
      "email.receiptMessage":
        "Gracias por tu compra. Aquí tienes el comprobante.",
      "email.noProducts": "Sin productos",
      "cart.modal.close": "Cerrar",
      "cart.finishPurchase": "Finalizar Compra",
      "cart.orderSummary": "Resumen del pedido",
      "cart.promoTitle": "Código de Descuento",
      "cart.apply": "Aplicar",
      "cart.back": "Volver",
      "cart.payWithCard": "Pagar con tarjeta",
      "sports.imageNotAvailable": "Imagen no disponible",
      "sports.productsInDevelopment": "Productos en desarrollo",
      "sports.workingOnProducts":
        "Estamos trabajando en productos específicos para.",
      "sports.soonNews": "¡Pronto tendremos novedades!",
      "sports.exploreOtherSports": "Explorar Otros Deportes",
      "sports.sailing": "Náutica",
      "sports.backToSports": "Volver a Deportes",
      "sports.productsFor": "Productos para",
      "sports.discoverSelection":
        "Descubre nuestra selección especializada de productos para",

      "product.share": "Compartir",
      "product.linkCopied": "Enlace copiado",
      "product.selectSize": "Selecciona talla",
      "product.shareWhatsapp": "Enviar por WhatsApp",
      "product.copyLink": "Copiar enlace",
      "sports.backToSpecific": "Volver a {{sport}}",

      // PaymentResultPage
      "payment.success.title": "¡Pago completado con éxito!",
      "payment.success.description":
        "Gracias por tu compra. Hemos recibido tu pago correctamente.",
      "payment.success.emailInfo":
        "Te hemos enviado un comprobante por email. Revisa tu bandeja de entrada y spam.",
      "payment.error.title": "Error en el pago",
      "payment.error.description":
        "Lo sentimos, ha ocurrido un error al procesar tu pago.",
      "payment.error.messageLabel": "Mensaje:",
      "payment.error.orderLabel": "Número de pedido:",
      "cta.backHome": "Volver al inicio",

      // Reenvío manual de correo
      "resend.title": "¿No te llegó el correo?",
      "resend.placeholder": "Escribí tu email para reenviar",
      "resend.button": "Reenviar correo",
      "resend.loading": "Reenviando…",
      "resend.success": "Correo reenviado. Revisá bandeja de entrada y spam.",
      "resend.invalidEmail": "Ingresá un email válido.",
      "resend.fail": "No pudimos reenviar el correo. Probá de nuevo más tarde.",
      "resend.throttle": "Debes esperar {{seconds}}s para reenviar.",

      // Legacy translations (keeping for compatibility)
      imageNotAvailable: "Imagen no disponible",
      buy: "Comprar",
      comingSoon: "Próximamente",
      productsInDevelopment: "Productos en desarrollo",
      workingOnProducts: "Estamos trabajando en productos específicos para.",
      soonNews: "¡Pronto tendremos novedades!",
      exploreOtherSports: "Explorar Otros Deportes",
    },
  },
  en: {
    translation: {
      // Header
      phone: "670 372 239",
      email: "info@manpowers.es",

      // Hero Section
      heroSubtitle: "Boost Your Athletic Performance",
      heroDescription:
        "Discover our premium line of sports supplements designed to maximize your athletic performance. Specialized products for athletes committed to excellence from Madrid, Spain.",
      heroButton: "Learn Our Story",
      heroSportsButton: "View Sports",
      heroDirectToSport: "Or go directly to your sport",

      // About Us Section
      aboutTitle: "Our Story",
      aboutSubtitle:
        "From Madrid, Spain, we create elite sports supplements for athletes",
      aboutOriginsTitle: "Our Origins",
      aboutOrigins1:
        "MANPOWERS was born in Madrid, Spain, with a clear mission: to develop premium sports supplements to enhance athletic performance.",
      aboutOrigins2:
        "Since our beginnings in the Spanish capital, we have specialized in advanced sports nutrition, creating products that help athletes reach their maximum potential.",
      aboutValuesTitle: "Our Values",
      aboutQuality: "Premium Quality",
      aboutQualityDesc:
        "We use only the best ingredients and manufacturing processes.",
      aboutInnovation: "Constant Innovation",
      aboutInnovationDesc: "We continuously research and develop new formulas.",
      aboutCommitment: "Total Commitment",
      aboutCommitmentDesc:
        "We are completely dedicated to our customers' wellbeing.",
      aboutMissionTitle: "Our Mission",
      aboutMission:
        "To develop elite sports supplements that maximize athletic performance, using the highest purity ingredients and scientifically backed formulas for high-level athletes.",
      aboutVisionTitle: "Our Vision",
      aboutVision:
        "To use advanced technology to develop innovative products that maximize athletic performance and help athletes reach their maximum potential through science and innovation.",
      aboutStatsTitle: "More about us",
      aboutYears: "Years of Experience",
      aboutClients: "Satisfied Customers",
      aboutProducts: "Premium Products",
      aboutQualityGuarantee: "Quality Guaranteed",
      aboutCommitmentTitle: "Our Commitment to You",
      aboutCommitmentText:
        "At MANPOWERS, your athletic performance is our priority. Every supplement is formulated with elite ingredients and undergoes rigorous quality controls to guarantee exceptional results.",
      aboutSuccess: "Your maximum performance, our commitment",

      // Products Section
      productsTitle: "Our Supplements",
      productsSubtitle:
        "Discover our range of elite sports supplements designed to maximize your athletic performance",
      productsComingSoon: "Coming Soon",
      productsComingSoonDesc:
        "We are finalizing the last details for the launch of our online store. Very soon you will be able to purchase our premium sports supplements.",
      productsAvailableSoon: "Available Soon",
      productsInterested: "Interested in our products?",
      productsInterestedDesc:
        "Stay tuned for our news from Madrid, Spain, and be the first to know when our nutritional supplements are available for sale in Spain. Every MANPOWERS product is backed by our premium quality guarantee and years of experience in the wellness sector.",

      // Product Names and Descriptions
      macaName: "MAN POWERS Maca Forte 10:1 - 5000",
      macaDescription:
        "Premium supplement made from concentrated Andean Maca root, offering a potency of 5000mg per capsule. Its formula is designed to provide explosive energy, physical endurance and greater mental focus.",
      omegaName: "Omega 3 - Pure fish oil",
      omegaDescription:
        "Pure fish oil Omega 3, enriched with Vitamin E. Essential for cardiovascular health, brain function and general wellbeing.",
      solarName: "MAN Facial and Body Sunscreen SPF 50+",
      solarDescription:
        "Your perfect summer ally. This innovative SPF 50+ sunscreen offers total protection against UVA/UVB rays, combined with a tanning accelerator. Its advanced formula is enriched with Hyaluronic Acid.",

      // Footer
      footerCompany:
        "Leading company in premium supplements and wellness products from Madrid, Spain.",
      footerContact: "Contact",
      footerAddress: "C. Severo Ochoa, 5, 28860 Paracuellos de Jarama, Madrid",
      footerCopyright: "© MANPOWERS. All rights reserved.",

      // Page Title
      pageTitle:
        "MANPOWERS - Premium Supplements and Wellness Products | Spain",

      // Amazon Buttons
      buyOn: "Buy",
      buyOn100ml: "100ml",
      buyOn50ml: "50ml",

      // Breadcrumbs
      home: "Home",
      products: "Products",
      about: "About",
      contact: "Contact",

      // Products Mobile
      productsMobileAvailableSoon: "Coming Soon",

      // Locations Section
      locationsTitle: "Our Locations",
      locationsSubtitle:
        "Find our sports supplementation products at these strategic locations",
      locationMadridTitle: "Madrid",
      locationMadridDescription:
        "Main distribution center for elite sports supplements in the Spanish capital.",
      locationsMadridType: "Main Headquarters",
      locationMallorcaTitle: "Mallorca",
      locationMallorcaDescription:
        "Specialized distribution point for sports supplementation for high-performance athletes in the Balearic Islands.",
      locationsMallorcaType: "Regional Office",
      locationsMessage:
        "Visit us at any of our locations or contact us for more information about our sports supplements.",

      // Sports Categories Section
      sportsTitle: "Sports",
      sportsSubtitle:
        "Discover our specialized products for each sports discipline",
      sportsButton: "View Products",

      // Sports names and descriptions
      "sports.archery": "Shooting",
      "sports.archeryDesc":
        "Supplements to improve concentration, stability and precision in shooting sports.",
      "sports.archerySlogan": "Absolute precision and concentration",

      "sports.fencing": "Fencing",
      "sports.fencingDesc":
        "Products designed to enhance agility, reflexes and endurance in fencing.",
      "sports.fencingSlogan": "Elegance and skill in every movement",

      "sports.golf": "Golf",
      "sports.golfDesc":
        "Specialized supplementation to maintain concentration and endurance during long rounds.",
      "sports.golfSlogan": "Perfection in every swing",

      "sports.cycling": "Cycling",
      "sports.cyclingDesc":
        "Specific products for cyclists who need sustained energy and muscle recovery.",
      "sports.cyclingSlogan": "Speed and endurance without limits",

      "sports.waterSports": "Nautical",
      "sports.waterSportsDesc":
        "Supplements for nautical sports focused on endurance and strength in marine environments.",
      "sports.waterSportsSlogan": "Master the waters with confidence",

      // Legacy sport translations (keeping for compatibility)
      sportShootingTitle: "Shooting",
      sportShootingDescription:
        "Supplements to improve concentration, stability and precision in shooting sports.",
      sportFencingTitle: "Fencing",
      sportFencingDescription:
        "Products designed to enhance agility, reflexes and endurance in fencing.",
      sportGolfTitle: "Golf",
      sportGolfDescription:
        "Specialized supplementation to maintain concentration and endurance during long rounds.",
      sportCyclingTitle: "Cycling",
      sportCyclingDescription:
        "Specific products for cyclists who need sustained energy and muscle recovery.",
      sportNauticalTitle: "Nautical",
      sportNauticalDescription:
        "Supplements for nautical sports focused on endurance and strength in marine environments.",

      // ProductsPage specific translations
      backToSports: "Back to Sports",

      // Sports specific translations
      "sports.buy": "Buy",
      "sports.addToCart": "Add to Cart",
      "sports.available": "Available",
      "sports.comingSoon": "Coming Soon",
      // Cart specific
      "cart.added": "Product added to cart",
      "cart.open": "Open cart",
      "cart.title": "Your cart",
      "cart.close": "Close cart",
      "cart.empty": "Your cart is empty.",
      "cart.noImage": "No image",
      "cart.noPrice": "No price",
      "cart.decreaseQty": "Decrease quantity",
      "cart.increaseQty": "Increase quantity",
      "cart.remove": "Remove",
      "cart.total": "Total",
      "cart.clear": "Empty",
      "cart.checkout": "Checkout",
      // New keys for CartWidget
      "cart.subtotal": "Subtotal",
      "cart.discount": "Discount",
      "cart.emailLabel": "Shipping & Contact",
      "cart.emailPlaceholder": "Your email to receive purchase details",
      "cart.invalidEmail": "Enter a valid email",
      "cart.addressLabel": "Address",
      "cart.addressPlaceholder": "Your full address",
      "cart.postalCodeLabel": "Postal code",
      "cart.postalCodePlaceholder": "e.g., 28001",
      "cart.localityLabel": "City / Locality",
      "cart.localityPlaceholder": "e.g., Madrid",
      "cart.provinceLabel": "Province",
      "cart.provincePlaceholder": "e.g., Madrid",
      "cart.addressRequired": "Address is required",
      "cart.postalRequired": "Postal code is required",
      "cart.localityRequired": "City/Locality is required",
      "cart.provinceRequired": "Province is required",
      "cart.promoInvalid": "Invalid promo code",
      "cart.promoError": "Error validating promo code",
      "cart.paymentErrorLoad": "Error loading payment system",
      "cart.paymentErrorRedirect": "Error redirecting to gateway",
      "cart.paymentErrorForm": "Error in payment form",
      "cart.paymentErrorStart": "Error starting payment",
      "cart.paymentErrorProcess": "Error processing payment",
      "cart.paymentSuccess": "Payment completed successfully!",
      "email.receiptMessage":
        "Thank you for your purchase. Here is your receipt.",
      "email.noProducts": "No products",
      "cart.modal.close": "Close",
      "cart.finishPurchase": "Finish Purchase",
      "cart.orderSummary": "Order summary",
      "cart.promoTitle": "Discount code",
      "cart.apply": "Apply",
      "cart.back": "Back",
      "cart.payWithCard": "Pay with card",
      "sports.imageNot available": "Image not available",
      "sports.productsInDevelopment": "Products in development",
      "sports.workingOnProducts": "We are working on specific products for.",
      "sports.soonNews": "We will have news soon!",
      "sports.exploreOtherSports": "Explore Other Sports",
      "sports.sailing": "Nautical",
      "sports.backToSports": "Back to Sports",
      "sports.productsFor": "Products for",
      "sports.discoverSelection":
        "Discover our specialized selection of products for",

      "product.share": "Share",
      "product.linkCopied": "Link copied",
      "product.selectSize": "Select size",
      "product.shareWhatsapp": "Send via WhatsApp",
      "product.copyLink": "Copy link",
      "sports.backToSpecific": "Back to {{sport}}",

      // PaymentResultPage
      "payment.success.title": "Payment completed successfully!",
      "payment.success.description":
        "Thank you for your purchase. We have received your payment.",
      "payment.success.emailInfo":
        "We sent a receipt by email. Check inbox and spam.",
      "payment.error.title": "Payment error",
      "payment.error.description":
        "Sorry, an error occurred while processing your payment.",
      "payment.error.messageLabel": "Message:",
      "payment.error.orderLabel": "Order number:",
      "cta.backHome": "Back to home",

      // Resend UI
      "resend.title": "Didn’t receive the email?",
      "resend.placeholder": "Enter your email to resend",
      "resend.button": "Resend email",
      "resend.loading": "Resending…",
      "resend.success": "Email resent. Check inbox and spam.",
      "resend.invalidEmail": "Enter a valid email.",
      "resend.fail": "We couldn’t resend the email. Please try again later.",

      // Legacy translations (keeping for compatibility)
      imageNotAvailable: "Image not available",
      buy: "Buy",
      comingSoon: "Coming Soon",
      productsInDevelopment: "Products in development",
      workingOnProducts: "We are working on specific products for.",
      soonNews: "We will have news soon!",
      exploreOtherSports: "Explore Other Sports",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // No persistir el idioma para evitar problemas con el lang por defecto
      order: ["htmlTag", "navigator"],
      caches: [],
    },
  });

export default i18n;
