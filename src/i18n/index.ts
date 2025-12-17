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
        "MΛN POWERS nació en Madrid, España, con una misión clara: desarrollar suplementos deportivos de máxima calidad para potenciar el rendimiento atlético.",
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
        "En MΛN POWERS, tu rendimiento deportivo es nuestra prioridad. Cada suplemento está formulado con ingredientes de élite y pasa por rigurosos controles de calidad para garantizar resultados excepcionales.",
      aboutSuccess: "Tu máximo rendimiento, nuestro compromiso",

      accordion: {
        description: "Descripción",
        objectives: "Objetivos",
        nutritionalValues: "Valores nutricionales",
        application: "Aplicación",
        recommendations: "Recomendaciones",
      },

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
        "Mantente al tanto de nuestras novedades desde Madrid, España, y sé el primero en conocer cuando nuestros suplementos nutricionales estén disponibles para la venta en España. Cada producto MΛN POWERS está respaldado por nuestra garantía de calidad premium y años de experiencia en el sector del bienestar.",

      recommendedTogether: {
        title: "Recomendado para comprar juntos",
        total: "Precio total",
      },

      faq: {
        title: "Preguntas más frecuentes",
      },

      payments: {
        methods: "Métodos de pago",
        processedByRedsys: "Pagos procesados por Redsys",
        acceptedCards: "Tarjetas aceptadas",
      },
      shipping: {
        tipsa: "Envíos realizados a través de",
      },
      returns: {
        fourteenDays: "Devoluciones en 14 días naturales",
      },

      // Product Names and Descriptions
      macaName: "MΛN POWERS Maca Forte 10:1 - 5000",
      macaDescription:
        "Suplemento premium elaborado a partir de raíz de Maca Andina concentrada, que ofrece una potencia de 5000mg por cápsula. Su fórmula está diseñada para brindarte energía explosiva, resistencia física y un mayor enfoque mental.",
      omegaName: "Omega 3 - Puro aceite de pescado",
      omegaDescription:
        "Omega 3 puro aceite de pescado, enriquecido con Vitamina E. Esencial para la salud cardiovascular, función cerebral y bienestar general.",
      solarName: "MΛN POWERS Protector Solar Facial y Corporal SPF 50+",
      solarDescription:
        "Tu aliado perfecto para el verano. Este innovador protector solar SPF 50+ te ofrece una protección total frente a los rayos UVA/UVB, combinada con un acelerador del bronceado. Su fórmula avanzada está enriquecida con Ácido Hialurónico.",

      // Footer
      footerCompany:
        "Empresa líder en suplementos premium y productos de bienestar desde Madrid, España.",
      footerContact: "Contacto",
      footerAddress: "C. Severo Ochoa, 5, 28860 Paracuellos de Jarama, Madrid",
      footerCopyright: "© MΛN POWERS. Todos los derechos reservados.",
      footerPrivacy: "Política de Privacidad",
      footerCookies: "Política de Cookies",
      footerLegal: "Aviso Legal",
      headerCollaborators: "Colaboradores",
      "collabLogin.title": "Acceso para colaboradores",
      "collabLogin.subtitle":
        "Ingresa con tus credenciales para acceder al área de colaboradores.",
      "collabLogin.username": "Nombre",
      "collabLogin.password": "Contraseña",
      "collabLogin.remember": "Recordarme",
      "collabLogin.signIn": "Iniciar sesión",
      "collabLogin.helper":
        "Si no tienes acceso, contacta con el administrador.",
      "collabLogin.error": "Revisa tu email y contraseña.",
      "collabLogin.errorInvalid": "Usuario o contraseña incorrectos.",
      "collabLogin.errorMissing": "Ingresa nombre y contraseña.",
      "collabLogin.errorPromo": "La promoción no existe o no está activa.",
      "collabLogin.success": "Inicio de sesión correcto.",
      "collabDashboard.hello": "Hola",
      "collabDashboard.subtitle":
        "Aquí tienes un resumen de tus ventas con tu código.",
      "collabDashboard.yourCode": "Tu código de descuento",
      "collabDashboard.noCode": "Sin código",
      "collabDashboard.copy": "Copiar",
      "collabDashboard.orders": "Pedidos",
      "collabDashboard.units": "Unidades",
      "collabDashboard.sales": "Ventas",
      "collabDashboard.error":
        "No se pudieron cargar las estadísticas. Mostrando datos base.",

      // Page Title
      pageTitle:
        "MΛN POWERS - Suplementos Premium y Productos de Bienestar | España",

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
      "cart.phoneLabel": "Teléfono (con código de país)",
      "cart.phonePlaceholder": "+34 600 123 456",
      "cart.invalidPhone": "Introduce un teléfono válido",
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
      "cart.marketingOptInLabel":
        "Acepto recibir promociones e información de MΛN POWERS",
      "email.receiptMessage":
        "Gracias por tu compra. Aquí tienes el comprobante.",
      "email.noProducts": "Sin productos",
      "cart.modal.close": "Cerrar",
      "cart.finishPurchase": "Finalizar Compra",
      "cart.orderSummary": "Resumen del pedido",
      "cart.promoTitle": "Código de Descuento",
      "cart.promoPlaceholder": "Introduce tu código",
      "cart.promoAriaLabel": "Código de descuento",
      "cart.apply": "Aplicar",
      "cart.back": "Volver",
      "cart.payWithCard": "Pagar con tarjeta",
      "sports.imageNotAvailable": "Imagen no disponible",
      "sports.imageNot available": "Imagen no disponible",
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
      "product.selectSize": "Selecciona medida",
      "product.vatShipping": "IVA incl. + gastos de envío",
      "product.deliveryTime": "Plazo de entrega 3–5 días laborables",
      "product.contentSizeLabel": "Tamaño del contenido:",
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
      // Privacy Policy
      "privacy.title": "Política de Privacidad",
      "privacy.intro":
        "En MΛN POWERS tratamos tus datos con transparencia y responsabilidad, cumpliendo el RGPD (Reglamento (UE) 2016/679) y la LOPDGDD (Ley Orgánica 3/2018). Esta política explica qué datos recopilamos, para qué los usamos y qué derechos podés ejercer.",
      "privacy.controllerTitle": "Responsable del tratamiento",
      "privacy.controllerText":
        "MΛN POWERS es marca registrada (nº M4308707(8)) perteneciente a TAMD Cosmetics (CIF B22689434). Dirección: C. Severo Ochoa, 5, 28860 Paracuellos de Jarama, Madrid. Email: info@manpowers.es.",
      "privacy.purposesTitle": "Finalidades del tratamiento",
      "privacy.purposesText":
        "Gestionamos pedidos y pagos, brindamos atención al cliente, enviamos comunicaciones relacionadas con productos y promociones cuando lo autorizás, mejoramos la experiencia del sitio y cumplimos con nuestras obligaciones legales.",
      "privacy.legalBasisTitle": "Legitimación",
      "privacy.legalBasisText":
        "Basamos el tratamiento en la ejecución de un contrato, el cumplimiento de obligaciones legales y nuestro interés legítimo. Para fines de marketing y analítica utilizamos tu consentimiento, que podés retirar en cualquier momento.",
      "privacy.recipientsTitle": "Destinatarios",
      "privacy.recipientsText":
        "Compartimos datos con proveedores esenciales para la operativa (pasarela de pago, logística, alojamiento) y, cuando aceptás cookies no esenciales, con herramientas de analítica y marketing. Firmamos acuerdos para garantizar su correcta protección.",
      "privacy.rightsTitle": "Derechos",
      "privacy.rightsText":
        "Podés ejercer tus derechos de acceso, rectificación, supresión, limitación, oposición y portabilidad escribiendo a info@manpowers.es. Respondemos tus solicitudes en los plazos previstos por la normativa.",
      "privacy.retentionTitle": "Conservación",
      "privacy.retentionText":
        "Conservamos tus datos solo el tiempo necesario para cumplir con las finalidades del tratamiento y los plazos legales aplicables. Luego los eliminamos o los anonimizamos de forma segura.",
      "privacy.cookiesTitle": "Cookies",
      "privacy.cookiesText":
        "En nuestra Política de Cookies explicamos detalladamente el uso de tecnologías de seguimiento, tipos de cookies y cómo gestionar tus preferencias.",
      "privacy.dataCategoriesTitle": "Categorías de datos",
      "privacy.dataCategoriesText":
        "Identificativos, contacto, transaccionales, preferencias, datos de navegación y, cuando proceda, información necesaria para la entrega y facturación.",
      "privacy.securityTitle": "Seguridad",
      "privacy.securityText":
        "Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos frente a accesos no autorizados, pérdida o alteración.",
      "privacy.userResponsibilitiesTitle": "Responsabilidades del usuario",
      "privacy.userResponsibilitiesText":
        "Debés proporcionar información veraz y mantenerla actualizada. Si compartís datos de terceros, garantizás contar con su consentimiento previo.",
      "privacy.contactTitle": "Contacto",
      "privacy.contactText":
        "Para consultas sobre privacidad o ejercicio de derechos, escríbenos a info@manpowers.es.",
      "privacy.changesTitle": "Cambios en esta política",
      "privacy.changesText":
        "Podemos actualizar esta política para reflejar cambios legales o de servicio. Publicaremos la versión vigente en este sitio.",

      // Cookies Policy
      "cookies.title": "Política de Cookies",
      "cookies.intro":
        "Usamos cookies propias y de terceros para que el sitio funcione correctamente, medir su rendimiento y personalizar contenido. Las cookies no esenciales se activan solo con tu consentimiento. MΛN POWERS es marca registrada (nº M4308707(8)) perteneciente a TAMD Cosmetics (CIF B22689434).",
      "cookies.whatTitle": "¿Qué son las cookies?",
      "cookies.whatText":
        "Las cookies son pequeños archivos que tu navegador guarda en tu dispositivo. Permiten recordar preferencias, mejorar la experiencia de navegación y realizar mediciones de uso.",
      "cookies.typesTitle": "Tipos de cookies que usamos",
      "cookies.typesNecessary":
        "Necesarias: imprescindibles para que el sitio funcione (autenticación, seguridad, preferencias básicas).",
      "cookies.typesAnalytics":
        "Analíticas: ayudan a entender el uso del sitio para mejorar rendimiento y usabilidad.",
      "cookies.typesMarketing":
        "Marketing: personalizan contenido y publicidad según tus intereses.",
      "cookies.manageTitle": "Gestión de cookies",
      "cookies.manageText":
        "Podés gestionar tus preferencias desde el banner de cookies o la configuración del navegador. Algunas funciones pueden verse afectadas si desactivás determinadas cookies.",
      "cookies.revokeTitle": "Revocar consentimiento",
      "cookies.revokeText":
        "Podés borrar el almacenamiento del navegador para restablecer el banner de consentimiento o escribirnos a info@manpowers.es si necesitás ayuda.",
      "cookies.detailCookiesTitle": "Información detallada",
      "cookies.functionalTitle": "Cookies funcionales",
      "cookies.functionalText":
        "Permiten recordar tus preferencias y opciones, ofreciendo una experiencia más personalizada.",
      "cookies.performanceTitle": "Rendimiento y medición",
      "cookies.performanceText":
        "Recopilan información agregada sobre el rendimiento del sitio para detectar incidencias y optimizarlo.",
      "cookies.thirdPartiesTitle": "Cookies de terceros",
      "cookies.thirdPartiesText":
        "Algunas cookies son gestionadas por terceros (p. ej., analítica). Te recomendamos revisar sus políticas para conocer cómo tratan tus datos.",
      "cookies.consentTitle": "Tu consentimiento",
      "cookies.consentText":
        "Solo activamos cookies no esenciales cuando das tu consentimiento. Puedes cambiarlo en cualquier momento.",
      "cookies.updateTitle": "Actualizaciones",
      "cookies.updateText":
        "Podemos actualizar esta política para reflejar cambios legales, técnicos o de servicio. Te recomendamos revisarla periódicamente.",
      "cookies.changePreferences": "Cambiar preferencias de cookies",
      "search.placeholder": "Buscar productos",
      "search.suggestions": "Sugerencias",
      "search.loading": "Cargando…",
      "search.noResults": "Sin resultados",
      "menu.aboutUs": "Sobre nosotros",
      "menu.viewBySport": "Ver productos por deporte",
      "menu.legal": "Legal",
      "allProducts.title": "Todos los productos",
      "relatedProducts.title": "Productos relacionados",
      "chat.intro":
        "Hola, soy el asistente de MΛN POWERS. Puedo ayudarte a encontrar el producto adecuado para mejorar tu rendimiento deportivo o mantenerte en tu máximo nivel. También puedo darte datos de contacto (teléfono y email), nuestra dirección, información legal (privacidad, cookies, aviso legal), cómo funciona el pago con tarjeta y por qué es seguro, y las condiciones de envíos y devoluciones. ¿En qué te ayudo?",
      "chat.hint": "¿Necesitas ayuda?",
    },
  },
  ca: {
    translation: {
      phone: "670 372 239",
      email: "info@manpowers.es",
      heroSubtitle: "Potencia el teu Rendiment Esportiu",
      heroDescription:
        "Explora la nostra gamma de suplements esportius adaptats a la teva disciplina. Descobreix a continuació els productes especialitzats per al teu esport i maximitza el teu rendiment",
      heroSportsButton: "Veure tots els esports",
      heroDirectToSport: "O entra directament al teu esport",
      aboutTitle: "La nostra Història",
      aboutSubtitle:
        "Des de Madrid, Espanya, creem suplements esportius d'elit per a atletes",
      aboutOriginsTitle: "Els nostres Orígens",
      aboutOrigins1:
        "MΛN POWERS va néixer a Madrid, Espanya, amb una missió clara: desenvolupar suplements esportius de màxima qualitat per potenciar el rendiment atlètic.",
      aboutOrigins2:
        "Des dels nostres inicis a la capital espanyola, ens hem especialitzat en nutrició esportiva avançada, creant productes que ajuden els atletes a assolir el seu màxim potencial.",
      aboutValuesTitle: "Els nostres Valors",
      aboutQuality: "Qualitat Premium",
      aboutQualityDesc:
        "Utilitzem només els millors ingredients i processos de fabricació.",
      aboutInnovation: "Innovació Constant",
      aboutInnovationDesc:
        "Investiguem i desenvolupem contínuament noves fórmules.",
      aboutCommitment: "Compromís Total",
      aboutCommitmentDesc:
        "Ens dediquem completament al benestar dels nostres clients.",
      aboutMissionTitle: "La nostra Missió",
      aboutMission:
        "Desenvolupar suplements esportius d'elit que maximitzin el rendiment atlètic, utilitzant ingredients de màxima puresa i fórmules avalades científicament per a esportistes d'alt nivell.",
      aboutVisionTitle: "La nostra Visió",
      aboutVision:
        "Utilitzar tecnologia avançada per desenvolupar productes innovadors que maximitzin el rendiment atlètic i ajudin els esportistes a assolir el seu màxim potencial a través de la ciència i la innovació.",
      aboutStatsTitle: "Més sobre nosaltres",
      aboutYears: "Anys d'Experiència",
      aboutClients: "Clients Satisfets",
      aboutProducts: "Productes Premium",
      aboutQualityGuarantee: "Qualitat Garantida",
      aboutCommitmentTitle: "El nostre Compromís amb Tu",
      aboutCommitmentText:
        "A MΛN POWERS, el teu rendiment esportiu és la nostra prioritat. Cada suplement està formulat amb ingredients d'elit i passa per rigorosos controls de qualitat per garantir resultats excepcionals.",
      aboutSuccess: "El teu màxim rendiment, el nostre compromís",
      accordion: {
        description: "Descripció",
        objectives: "Objectius",
        nutritionalValues: "Valors nutricionals",
        application: "Aplicació",
        recommendations: "Recomanacions",
      },
      productsTitle: "Els nostres Suplements",
      productsSubtitle:
        "Descobreix la nostra gamma de suplements esportius d'elit dissenyats per maximitzar el teu rendiment atlètic",
      productsComingSoon: "Proximament Disponibles",
      productsComingSoonDesc:
        "Estem finalitzant els últims detalls per al llançament de la nostra botiga en línia. Molt aviat podràs adquirir els nostres suplements esportius premium.",
      productsAvailableSoon: "Pròximament Disponible",
      productsInterested: "Interessat en els nostres productes?",
      productsInterestedDesc:
        "Mantén-te al corrent de les nostres novetats des de Madrid, Espanya, i sigues el primer a conèixer quan els nostres suplements nutricionals estiguin disponibles per a la venda a Espanya. Cada producte MΛN POWERS està avalat per la nostra garantia de qualitat premium i anys d'experiència en el sector del benestar.",
      recommendedTogether: {
        title: "Recomanat per comprar junts",
        total: "Preu total",
      },
      faq: {
        title: "Preguntes freqüents",
      },
      payments: {
        methods: "Mètodes de pagament",
        processedByRedsys: "Pagaments processats per Redsys",
        acceptedCards: "Targetes acceptades",
      },
      shipping: {
        tipsa: "Enviaments realitzats a través de",
      },
      returns: {
        fourteenDays: "Devolucions en 14 dies naturals",
      },
      macaName: "MΛN POWERS Maca Forte 10:1 - 5000",
      macaDescription:
        "Suplement premium elaborat a partir d'arrel de Maca andina concentrada, que ofereix una potència de 5000mg per càpsula. La seva fórmula està dissenyada per aportar energia explosiva, resistència física i major enfocament mental.",
      omegaName: "Omega 3 - Oli de peix pur",
      omegaDescription:
        "Omega 3 oli de peix pur, enriquit amb Vitamina E. Essencial per a la salut cardiovascular, la funció cerebral i el benestar general.",
      solarName: "Protector Solar Facial i Corporal SPF 50+",
      solarDescription:
        "El teu aliat perfecte per a l'estiu. Aquest innovador protector solar SPF 50+ t'ofereix protecció total davant els raigs UVA/UVB, combinada amb un accelerador del bronzejat. La seva fórmula avançada està enriquida amb Àcid Hialurònic.",
      footerCompany:
        "Empresa líder en suplements premium i productes de benestar des de Madrid, Espanya.",
      footerContact: "Contacte",
      footerAddress: "C. Severo Ochoa, 5, 28860 Paracuellos de Jarama, Madrid",
      footerCopyright: "© MΛN POWERS. Tots els drets reservats.",
      footerPrivacy: "Política de Privacitat",
      footerCookies: "Política de Cookies",
      footerLegal: "Avís Legal",
      headerCollaborators: "Col·laboradors",
      "collabLogin.title": "Accés per a col·laboradors",
      "collabLogin.subtitle":
        "Entra amb les teves credencials per accedir a l'àrea de col·laboradors.",
      "collabLogin.username": "Nom",
      "collabLogin.password": "Contrasenya",
      "collabLogin.remember": "Recorda'm",
      "collabLogin.signIn": "Inicia sessió",
      "collabLogin.helper": "Si no tens accés, contacta amb l'administrador.",
      "collabLogin.error": "Revisa el teu email i contrasenya.",
      "collabLogin.errorInvalid": "Usuari o contrasenya incorrectes.",
      "collabLogin.errorMissing": "Introdueix nom i contrasenya.",
      "collabLogin.errorPromo": "La promoció no existeix o no està activa.",
      "collabLogin.success": "Inici de sessió correcte.",
      "collabDashboard.hello": "Hola",
      "collabDashboard.subtitle":
        "Aquí tens un resum de les teves vendes amb el teu codi.",
      "collabDashboard.yourCode": "El teu codi de descompte",
      "collabDashboard.noCode": "Sense codi",
      "collabDashboard.copy": "Copia",
      "collabDashboard.orders": "Comandes",
      "collabDashboard.units": "Unitats",
      "collabDashboard.sales": "Vendes",
      "collabDashboard.error":
        "No s'han pogut carregar les estadístiques. Mostrant dades base.",
      pageTitle:
        "MΛN POWERS - Suplements Premium i Productes de Benestar | Espanya",
      buyOn: "Comprar",
      buyOn100ml: "100ml",
      buyOn50ml: "50ml",
      home: "Inici",
      products: "Productes",
      about: "Nosaltres",
      contact: "Contacte",
      productsMobileAvailableSoon: "Pròximament",
      locationsTitle: "Les nostres Ubicacions",
      locationsSubtitle:
        "Ens trobem en dues ubicacions estratègiques per oferir-te el millor servei i suplements esportius d'elit.",
      locationsMadridTitle: "Madrid",
      locationsMadridType: "Seu Principal",
      locationsMallorcaTitle: "Mallorca",
      locationsMallorcaType: "Oficina Regional",
      locationsMessage:
        "Visita'ns en qualsevol de les nostres ubicacions o contacta'ns per a més informació sobre els nostres suplements esportius.",
      sportsTitle: "Esports",
      sportsSubtitle:
        "Desenvolupem productes especialitzats per als següents esports",
      sportsButton: "Veure Productes",
      "sports.archery": "Tir",
      "sports.archeryDesc":
        "Suplements per millorar la concentració, estabilitat i precisió en esports de tir.",
      "sports.archerySlogan": "Precisió i concentració absoluta",
      "sports.fencing": "Esgrima",
      "sports.fencingDesc":
        "Productes dissenyats per potenciar l'agilitat, reflexos i resistència en esgrima.",
      "sports.fencingSlogan": "Elegància i destresa en cada moviment",
      "sports.golf": "Golf",
      "sports.golfDesc":
        "Suplementació especialitzada per mantenir la concentració i resistència durant rondes llargues.",
      "sports.golfSlogan": "Perfecció en cada cop",
      "sports.cycling": "Ciclisme",
      "sports.cyclingDesc":
        "Productes específics per a ciclistes que necessiten energia sostinguda i recuperació muscular.",
      "sports.cyclingSlogan": "Velocitat i resistència sense límits",
      "sports.waterSports": "Nàutica",
      "sports.waterSportsDesc":
        "Suplements per a esports nàutics enfocats a la resistència i força en entorns marins.",
      "sports.waterSportsSlogan": "Domina les aigües amb confiança",
      sportShootingTitle: "Tir",
      sportShootingDescription:
        "Suplements per millorar la concentració, estabilitat i precisió en esports de tir.",
      sportFencingTitle: "Esgrima",
      sportFencingDescription:
        "Productes dissenyats per potenciar l'agilitat, reflexos i resistència en esgrima.",
      sportGolfTitle: "Golf",
      sportGolfDescription:
        "Suplementació especialitzada per mantenir la concentració i resistència durant rondes llargues.",
      sportCyclingTitle: "Ciclisme",
      sportCyclingDescription:
        "Productes específics per a ciclistes que necessiten energia sostinguda i recuperació muscular.",
      sportNauticalTitle: "Nàutica",
      sportNauticalDescription:
        "Suplements per a esports nàutics enfocats a la resistència i força en entorns marins.",
      backToSports: "Tornar a Esports",
      "sports.buy": "Comprar",
      "sports.addToCart": "Afegir al carret",
      "sports.available": "Disponible",
      "sports.comingSoon": "Pròximament",
      "cart.added": "Producte afegit al carret",
      "cart.open": "Obrir carret",
      "cart.title": "El teu carret",
      "cart.close": "Tancar carret",
      "cart.empty": "El teu carret està buit.",
      "cart.noImage": "Sense imatge",
      "cart.noPrice": "Sense preu",
      "cart.decreaseQty": "Disminuir quantitat",
      "cart.increaseQty": "Augmentar quantitat",
      "cart.remove": "Treure",
      "cart.total": "Total",
      "cart.clear": "Buidar",
      "cart.checkout": "Pagar",
      "cart.subtotal": "Subtotal",
      "cart.discount": "Descompte",
      "cart.emailLabel": "Enviament i contacte",
      "cart.emailPlaceholder": "El teu email per rebre les dades de la compra",
      "cart.invalidEmail": "Introdueix un email vàlid",
      "cart.phoneLabel": "Telèfon (amb codi de país)",
      "cart.phonePlaceholder": "+34 600 123 456",
      "cart.invalidPhone": "Introdueix un telèfon vàlid",
      "cart.addressLabel": "Adreça",
      "cart.addressPlaceholder": "La teva adreça completa",
      "cart.postalCodeLabel": "Codi postal",
      "cart.postalCodePlaceholder": "Ex.: 28001",
      "cart.localityLabel": "Localitat",
      "cart.localityPlaceholder": "Ex.: Madrid",
      "cart.provinceLabel": "Província",
      "cart.provincePlaceholder": "Ex.: Madrid",
      "cart.addressRequired": "L'adreça és obligatòria",
      "cart.postalRequired": "El codi postal és obligatori",
      "cart.localityRequired": "La localitat és obligatòria",
      "cart.provinceRequired": "La província és obligatòria",
      "cart.promoInvalid": "Codi de promoció no vàlid",
      "cart.promoError": "Error en validar el codi de promoció",
      "cart.paymentErrorLoad": "Error carregant el sistema de pagament",
      "cart.paymentErrorRedirect": "Error redirigint a la passarel·la",
      "cart.paymentErrorForm": "Error en el formulari de pagament",
      "cart.paymentErrorStart": "Error iniciant el pagament",
      "cart.paymentErrorProcess": "Error processant el pagament",
      "cart.paymentSuccess": "Pagament realitzat amb èxit!",
      "cart.marketingOptInLabel":
        "Accepto rebre promocions i informació de MΛN POWERS",
      "email.receiptMessage":
        "Gràcies per la teva compra. Aquí tens el comprovant.",
      "email.noProducts": "Sense productes",
      "cart.modal.close": "Tancar",
      "cart.finishPurchase": "Finalitzar Compra",
      "cart.orderSummary": "Resum de la comanda",
      "cart.promoTitle": "Codi de Descompte",
      "cart.promoPlaceholder": "Introdueix el teu codi",
      "cart.promoAriaLabel": "Codi de descompte",
      "cart.apply": "Aplicar",
      "cart.back": "Tornar",
      "cart.payWithCard": "Pagar amb targeta",
      "sports.imageNotAvailable": "Imatge no disponible",
      "sports.imageNot available": "Imatge no disponible",
      "sports.productsInDevelopment": "Productes en desenvolupament",
      "sports.workingOnProducts":
        "Estem treballant en productes específics per a.",
      "sports.soonNews": "Aviat tindrem novetats!",
      "sports.exploreOtherSports": "Explora Altres Esports",
      "sports.sailing": "Nàutica",
      "sports.backToSports": "Tornar a Esports",
      "sports.productsFor": "Productes per a",
      "sports.discoverSelection":
        "Descobreix la nostra selecció especialitzada de productes per a",
      "product.share": "Compartir",
      "product.linkCopied": "Enllaç copiat",
      "product.selectSize": "Selecciona talla",
      "product.vatShipping": "IVA inclòs + despeses d'enviament",
      "product.deliveryTime": "Termini d'entrega 3–5 dies laborables",
      "product.contentSizeLabel": "Mida del contingut:",
      "product.shareWhatsapp": "Enviar per WhatsApp",
      "product.copyLink": "Copiar enllaç",
      "sports.backToSpecific": "Tornar a {{sport}}",
      "payment.success.title": "Pagament completat amb èxit!",
      "payment.success.description":
        "Gràcies per la teva compra. Hem rebut el teu pagament correctament.",
      "payment.success.emailInfo":
        "T'hem enviat un comprovant per email. Revisa la safata d'entrada i el correu brossa.",
      "payment.error.title": "Error en el pagament",
      "payment.error.description":
        "Ho sentim, ha ocorregut un error en processar el teu pagament.",
      "payment.error.messageLabel": "Missatge:",
      "payment.error.orderLabel": "Número de comanda:",
      "cta.backHome": "Tornar a l'inici",
      "resend.title": "No t'ha arribat el correu?",
      "resend.placeholder": "Escriu el teu email per reenviar",
      "resend.button": "Reenviar correu",
      "resend.loading": "Reenviant…",
      "resend.success":
        "Correu reenviat. Revisa safata d'entrada i correu brossa.",
      "resend.invalidEmail": "Introdueix un email vàlid.",
      "resend.fail":
        "No hem pogut reenviar el correu. Torna-ho a provar més tard.",
      "search.placeholder": "Cerca productes",
      "search.suggestions": "Suggeriments",
      "search.loading": "Carregant…",
      "search.noResults": "Sense resultats",
      "menu.aboutUs": "Sobre nosaltres",
      "menu.viewBySport": "Veure productes per esport",
      "menu.legal": "Legal",
      "allProducts.title": "Tots els productes",
      "relatedProducts.title": "Productes relacionats",
      "chat.intro":
        "Hola! Soc l’assistent de MΛN POWERS. Et puc ajudar a trobar el producte adequat per millorar el teu rendiment esportiu o mantenir-te al màxim nivell. També puc facilitar dades de contacte, la nostra adreça, informació legal (privacitat, cookies, avís legal), com funciona el pagament amb targeta i per què és segur, i la política d’enviaments i devolucions. En què et puc ajudar?",
      "chat.hint": "Necessites ajuda?",
      "cookies.changePreferences": "Canviar preferències de cookies",
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
        "MΛN POWERS was born in Madrid, Spain, with a clear mission: to develop premium sports supplements to enhance athletic performance.",
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
        "At MΛN POWERS, your athletic performance is our priority. Every supplement is formulated with elite ingredients and undergoes rigorous quality controls to guarantee exceptional results.",
      aboutSuccess: "Your maximum performance, our commitment",

      accordion: {
        description: "Description",
        objectives: "Objectives",
        nutritionalValues: "Nutritional values",
        application: "Application",
        recommendations: "Recommendations",
      },

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
        "Stay tuned for our news from Madrid, Spain, and be the first to know when our nutritional supplements are available for sale in Spain. Every MΛN POWERS product is backed by our premium quality guarantee and years of experience in the wellness sector.",

      recommendedTogether: {
        title: "Frequently bought together",
        total: "Total price",
      },

      faq: {
        title: "Frequently Asked Questions",
      },

      payments: {
        methods: "Payment methods",
        processedByRedsys: "Payments processed by Redsys",
        acceptedCards: "Accepted cards",
      },
      shipping: {
        tipsa: "Shipping handled by",
      },
      returns: {
        fourteenDays: "Returns within 14 calendar days",
      },

      // Product Names and Descriptions
      macaName: "MΛN POWERS Maca Forte 10:1 - 5000",
      macaDescription:
        "Premium supplement made from concentrated Andean Maca root, offering a potency of 5000mg per capsule. Its formula is designed to provide explosive energy, physical endurance and greater mental focus.",
      omegaName: "Omega 3 - Pure fish oil",
      omegaDescription:
        "Pure fish oil Omega 3, enriched with Vitamin E. Essential for cardiovascular health, brain function and general wellbeing.",
      solarName: "MΛN POWERS Facial and Body Sunscreen SPF 50+",
      solarDescription:
        "Your perfect summer ally. This innovative SPF 50+ sunscreen offers total protection against UVA/UVB rays, combined with a tanning accelerator. Its advanced formula is enriched with Hyaluronic Acid.",

      // Footer
      footerCompany:
        "Leading company in premium supplements and wellness products from Madrid, Spain.",
      footerContact: "Contact",
      footerAddress: "C. Severo Ochoa, 5, 28860 Paracuellos de Jarama, Madrid",
      footerCopyright: "© MΛN POWERS. All rights reserved.",
      footerPrivacy: "Privacy Policy",
      footerCookies: "Cookies Policy",
      footerLegal: "Legal Notice",
      headerCollaborators: "Collaborators",
      "collabLogin.title": "Collaborators Login",
      "collabLogin.subtitle":
        "Sign in with your credentials to access the collaborators area.",
      "collabLogin.username": "Name",
      "collabLogin.password": "Password",
      "collabLogin.remember": "Remember me",
      "collabLogin.forgot": "Forgot your password?",
      "collabLogin.signIn": "Sign in",
      "collabLogin.helper":
        "If you need access, please contact the administrator.",
      "collabLogin.error": "Check your email and password.",
      "collabLogin.errorInvalid": "Invalid username or password.",
      "collabLogin.errorMissing": "Enter name and password.",
      "collabLogin.errorPromo": "Promotion does not exist or is not active.",
      "collabLogin.success": "Signed in successfully.",
      "collabDashboard.hello": "Hello",
      "collabDashboard.subtitle": "Here is your sales summary with your code.",
      "collabDashboard.yourCode": "Your discount code",
      "collabDashboard.noCode": "No code",
      "collabDashboard.copy": "Copy",
      "collabDashboard.orders": "Orders",
      "collabDashboard.units": "Units",
      "collabDashboard.sales": "Sales",
      "collabDashboard.error": "Couldn't load stats. Showing base data.",

      // Page Title
      pageTitle:
        "MΛN POWERS - Premium Supplements and Wellness Products | Spain",

      // Amazon Buttons
      buyOn: "Buy",
      buyOn100ml: "100ml",
      buyOn50ml: "50ml",

      // Breadcrumbs
      home: "Home",
      products: "Products",
      about: "About",
      contact: "Contact",
      "search.placeholder": "Search products",
      "search.suggestions": "Suggestions",
      "search.loading": "Loading…",
      "search.noResults": "No results",
      "menu.aboutUs": "About us",
      "menu.viewBySport": "Browse products by sport",
      "menu.legal": "Legal",
      "allProducts.title": "All products",
      "relatedProducts.title": "Related products",
      "cookies.changePreferences": "Change cookie preferences",
      "chat.intro":
        "Hi! I’m the MΛN POWERS assistant. I can help you find the right product to boost your performance or keep you at your highest level. I can also provide contact details, our address, legal information (privacy, cookies, legal notice), how card payments work and why they’re secure, and our shipping and returns policy. How can I help?",
      "chat.hint": "Need help?",

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
      "cart.phoneLabel": "Phone (with country code)",
      "cart.phonePlaceholder": "e.g., +34 600 123 456",
      "cart.invalidPhone": "Enter a valid phone number",
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
      "cart.marketingOptInLabel":
        "I agree to receive promotions and information from MΛN POWERS",
      "email.receiptMessage":
        "Thank you for your purchase. Here is your receipt.",
      "email.noProducts": "No products",
      "cart.modal.close": "Close",
      "cart.finishPurchase": "Finish Purchase",
      "cart.orderSummary": "Order summary",
      "cart.promoTitle": "Discount code",
      "cart.promoPlaceholder": "Enter your code",
      "cart.promoAriaLabel": "Discount code",
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
      "product.vatShipping": "VAT incl. + shipping",
      "product.deliveryTime": "Delivery time 3–5 business days",
      "product.contentSizeLabel": "Content size:",
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
      // Privacy Policy
      "privacy.title": "Privacy Policy",
      "privacy.intro":
        "At MΛN POWERS, we respect your privacy and comply with GDPR and applicable Spanish laws.",
      "privacy.controllerTitle": "Data Controller",
      "privacy.controllerText":
        "MΛN POWERS is a registered brand (trademark no. M4308707(8)) belonging to TAMD Cosmetics (CIF B22689434). Address: C. Severo Ochoa, 5, 28860 Paracuellos de Jarama, Madrid. Email: info@manpowers.es.",
      "privacy.purposesTitle": "Processing Purposes",
      "privacy.purposesText":
        "Manage orders and payments, customer support, product-related communications, service improvement, and legal compliance.",
      "privacy.legalBasisTitle": "Legal Basis",
      "privacy.legalBasisText":
        "Contract performance, legal obligations and legitimate interest. For marketing and analytics, we will request your consent.",
      "privacy.recipientsTitle": "Recipients",
      "privacy.recipientsText":
        "Service providers necessary for operations (e.g., payment gateway, logistics) and, where applicable, analytics/marketing when you accept non-essential cookies.",
      "privacy.rightsTitle": "Your Rights",
      "privacy.rightsText":
        "You can exercise access, rectification, erasure, restriction, objection and portability by writing to info@manpowers.es.",
      "privacy.retentionTitle": "Data Retention",
      "privacy.retentionText":
        "Data is retained for the time necessary for the stated purposes and legal obligations.",
      "privacy.cookiesTitle": "Cookies",
      "privacy.cookiesText":
        "See the Cookies Policy for details about tracking technologies.",
      "privacy.dataCategoriesTitle": "Data Categories",
      "privacy.dataCategoriesText":
        "Identification, contact, transactional, preferences, browsing data and, where necessary, delivery and invoicing information.",
      "privacy.securityTitle": "Security",
      "privacy.securityText":
        "We apply appropriate technical and organizational measures to protect your data against unauthorized access, loss or alteration.",
      "privacy.userResponsibilitiesTitle": "User Responsibilities",
      "privacy.userResponsibilitiesText":
        "You must provide truthful information and keep it updated. If you share third-party data, you confirm having their consent.",
      "privacy.contactTitle": "Contact",
      "privacy.contactText":
        "For privacy inquiries or to exercise your rights, write to info@manpowers.es.",
      "privacy.changesTitle": "Changes to this Policy",
      "privacy.changesText":
        "We may update this policy to reflect legal or service changes. We will publish the current version on this site.",

      // Cookies Policy
      "cookies.title": "Cookies Policy",
      "cookies.intro":
        "We use our own and third-party cookies for necessary, analytics and marketing purposes, always with your consent when not strictly necessary. MΛN POWERS is a registered brand (trademark no. M4308707(8)) belonging to TAMD Cosmetics (CIF B22689434).",
      "cookies.whatTitle": "What are cookies?",
      "cookies.whatText":
        "Files stored on your device to remember preferences, improve experience and perform usage measurement.",
      "cookies.typesTitle": "Types of cookies we use",
      "cookies.typesNecessary":
        "Necessary: essential for the site to function (authentication, security, basic preferences).",
      "cookies.typesAnalytics":
        "Analytics: help us understand site usage to improve performance and usability.",
      "cookies.typesMarketing":
        "Marketing: personalize content and advertising based on your interests.",
      "cookies.manageTitle": "Managing cookies",
      "cookies.manageText":
        "You can configure your preferences in the cookies banner or from your browser settings.",
      "cookies.revokeTitle": "Withdraw consent",
      "cookies.revokeText":
        "You can clear your browser storage to reset the consent banner or contact us at info@manpowers.es.",
      "cookies.detailCookiesTitle": "Detailed information",
      "cookies.functionalTitle": "Functional cookies",
      "cookies.functionalText":
        "Allow remembering your preferences and options for a more personalized experience.",
      "cookies.performanceTitle": "Performance and measurement",
      "cookies.performanceText":
        "Collect anonymous information about site performance to optimize it.",
      "cookies.thirdPartiesTitle": "Third-party cookies",
      "cookies.thirdPartiesText":
        "Some cookies are managed by third parties. Check their policies to know how they process data.",
      "cookies.consentTitle": "Your consent",
      "cookies.consentText":
        "We only activate non-essential cookies when you consent. You can change this at any time.",
      "cookies.updateTitle": "Updates",
      "cookies.updateText":
        "We may update this policy to reflect legal or technical changes. Please review it periodically.",
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
