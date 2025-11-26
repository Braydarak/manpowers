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
    title: "MΛN POWERS - Suplementos Premium desde Madrid | España",
    description:
      "Descubre MΛN POWERS, empresa líder en suplementos nutricionales premium desde Madrid. Maca Andina, Omega 3, protector solar y más productos de bienestar para toda España.",
    keywords:
      "suplementos nutricionales, maca andina, omega 3, protector solar, Mallorca, Manacor, España, bienestar, salud, productos premium, MΛN POWERS",
    ogTitle: "MΛN POWERS - Suplementos Premium desde Mallorca",
    ogDescription:
      "Empresa líder en suplementos nutricionales premium desde Manacor, Mallorca. Productos de bienestar para toda España.",
    ogImage: "/MAN-LOGO-BLANCO.png",
    canonicalUrl: "https://manpowers.es/",
  },
  sports: {
    title: "Deportes | MΛN POWERS",
    description:
      "Explora deportes y categorías: tiro con arco, golf, ciclismo, esgrima y náutica. Productos y geles de agarre MΛN POWERS.",
    keywords:
      "deportes, tiro con arco, golf, ciclismo, esgrima, náutica, MΛN POWERS",
    ogTitle: "Deportes | MΛN POWERS",
    ogDescription: "Explora nuestras categorías y accesorios para deportistas.",
    canonicalUrl: "https://manpowers.es/sports",
  },
  products: {
    title: "Productos MΛN POWERS - Suplementos Premium | Mallorca España",
    description:
      "Catálogo completo de productos MΛN POWERS: Maca Forte 5000mg, Omega 3 puro, Protector Solar SPF 50+. Suplementos premium desde Madrid para toda España.",
    keywords:
      "maca forte, omega 3, protector solar SPF 50, suplementos premium, productos MΛN POWERS, Madrid, España, maca andina 5000mg",
    ogTitle: "Productos MΛN POWERS - Suplementos Premium",
    ogDescription:
      "Catálogo completo de suplementos nutricionales premium desde Mallorca.",
    canonicalUrl: "https://manpowers.es/products",
  },
  about: {
    title: "Sobre MΛN POWERS - Historia y Misión | Empresa de Mallorca",
    description:
      "Conoce la historia de MΛN POWERS, empresa fundada en Madrid. Nuestra misión, visión y compromiso con la calidad en suplementos nutricionales para España.",
    keywords:
      "MΛN POWERS historia, empresa Madrid, Madrid, misión visión, calidad premium, suplementos España, fundación empresa",
    ogTitle: "Sobre MΛN POWERS - Historia y Misión",
    ogDescription:
      "Conoce la historia y misión de MΛN POWERS, empresa de suplementos premium desde Mallorca.",
    canonicalUrl: "https://manpowers.es/nosotros",
  },
};

export const productSeoConfigs: Record<number, SEOConfig> = {
  1: {
    title: "MΛN POWERS Maca Forte 10:1 - 5000 | MΛN POWERS",
    description:
      "Suplemento premium elaborado a partir de raíz de Maca Andina concentrada, que ofrece una potencia de 5000mg por cápsula. Su fórmula está diseñada para brindarte energía explosiva, resistencia física y un mayor enfoque mental.",
    keywords: "MΛN POWERS Maca Forte 10:1 - 5000, suplementos, MΛN POWERS",
    ogTitle: "MΛN POWERS Maca Forte 10:1 - 5000 | MΛN POWERS",
    ogDescription:
      "Suplemento premium elaborado a partir de raíz de Maca Andina concentrada, que ofrece una potencia de 5000mg por cápsula. Su fórmula está diseñada para brindarte energía explosiva, resistencia física y un mayor enfoque mental.",
    ogImage: "/products/MACA-500.jpg",
  },
  2: {
    title: "Omega 3 - Puro aceite de pescado | MΛN POWERS",
    description:
      "Omega 3 puro aceite de pescado, enriquecido con Vitamina E. Esencial para la salud cardiovascular, función cerebral y bienestar general.",
    keywords: "Omega 3 - Puro aceite de pescado, suplementos, MΛN POWERS",
    ogTitle: "Omega 3 - Puro aceite de pescado | MΛN POWERS",
    ogDescription:
      "Omega 3 puro aceite de pescado, enriquecido con Vitamina E. Esencial para la salud cardiovascular, función cerebral y bienestar general.",
    ogImage: "/products/OMEGA-3.jpg",
  },
  3: {
    title: "MΛN POWERS Protector Solar Facial y Corporal SPF 50+ | MΛN POWERS",
    description:
      "Tu aliado perfecto para el verano. Este innovador protector solar SPF 50+ te ofrece una protección total frente a los rayos UVA/UVB, combinada con un acelerador del bronceado. Su fórmula avanzada está enriquecida con Ácido Hialurónico.",
    keywords: "Protector Solar SPF 50+, cuidado, MΛN POWERS",
    ogTitle:
      "MΛN POWERS Protector Solar Facial y Corporal SPF 50+ | MΛN POWERS",
    ogDescription:
      "Tu aliado perfecto para el verano. Este innovador protector solar SPF 50+ te ofrece una protección total frente a los rayos UVA/UVB, combinada con un acelerador del bronceado. Su fórmula avanzada está enriquecida con Ácido Hialurónico.",
    ogImage: "/products/MAN-PROTECTOR-SOLAR.jpg",
  },
  4: {
    title: "Creatina Monohidrato Premium | MΛN POWERS",
    description:
      "Creatina monohidrato de máxima pureza para aumentar la fuerza, potencia y masa muscular. Ideal para entrenamientos de alta intensidad y deportes de fuerza.",
    keywords: "Creatina Monohidrato Premium, suplementos, MΛN POWERS",
    ogTitle: "Creatina Monohidrato Premium | MΛN POWERS",
    ogDescription:
      "Creatina monohidrato de máxima pureza para aumentar la fuerza, potencia y masa muscular. Ideal para entrenamientos de alta intensidad y deportes de fuerza.",
    ogImage: "/products/CREATINA.jpg",
  },
  5: {
    title: "Crema Anti-Rozaduras | MΛN POWERS",
    description:
      "Antes de enfundarte la chaqueta y el plastrón, prepara la piel para los asaltos. Esta crema anti‑rozaduras crea una barrera invisible que reduce la fricción en axilas, ingles y cintura, incluso bajo el calor de la máscara. Se mantiene firme con el sudor y permite moverte con libertad en cada finta y desplazamiento.",
    keywords: "Crema Anti-Rozaduras, cuidado, MΛN POWERS",
    ogTitle: "Crema Anti-Rozaduras | MΛN POWERS",
    ogDescription:
      "Antes de enfundarte la chaqueta y el plastrón, prepara la piel para los asaltos. Esta crema anti‑rozaduras crea una barrera invisible que reduce la fricción en axilas, ingles y cintura, incluso bajo el calor de la máscara. Se mantiene firme con el sudor y permite moverte con libertad en cada finta y desplazamiento.",
    ogImage: "/products/CREMA-ANTI-ROZADURAS.jpg",
  },
  6: {
    title: "Gel de Aloe Vera Puro | MΛN POWERS",
    description:
      "Gel de aloe vera 100% puro para hidratar, calmar y regenerar la piel. Ideal para quemaduras solares, irritaciones y cuidado diario de la piel.",
    keywords: "Gel de Aloe Vera Puro, cuidado, MΛN POWERS",
    ogTitle: "Gel de Aloe Vera Puro | MΛN POWERS",
    ogDescription:
      "Gel de aloe vera 100% puro para hidratar, calmar y regenerar la piel. Ideal para quemaduras solares, irritaciones y cuidado diario de la piel.",
    ogImage: "/products/GEL-DE-ALOE-VERA.jpg",
  },
  7: {
    title: "Champú Anti-Caída Fortalecedor | MΛN POWERS",
    description:
      'El Champú Anticaída Manpowers - Anti Hair Loss, con la fórmula "Hair Denseer", es un tratamiento capilar de uso diario diseñado para combatir las principales causas de la caída del cabello masculino. Su mezcla de ingredientes activos estimula la raíz y fortalece la estructura capilar. No solo limpia, sino que trata el cuero cabelludo, ofreciendo un cabello más fuerte, denso y con mayor vitalidad.',
    keywords: "Champú Anti-Caída Fortalecedor, cuidado, MΛN POWERS",
    ogTitle: "Champú Anti-Caída Fortalecedor | MΛN POWERS",
    ogDescription:
      'El Champú Anticaída Manpowers - Anti Hair Loss, con la fórmula "Hair Denseer", es un tratamiento capilar de uso diario diseñado para combatir las principales causas de la caída del cabello masculino. Su mezcla de ingredientes activos estimula la raíz y fortalece la estructura capilar. No solo limpia, sino que trata el cuero cabelludo, ofreciendo un cabello más fuerte, denso y con mayor vitalidad.',
    ogImage: "/products/CHAMPU-ANTI-CAIDA-TIRADORES.jpg",
  },
  8: {
    title: "Crema para Masajes Relajante | MΛN POWERS",
    description:
      "Termina la regata y notas hombros y zona lumbar cargados. Esta crema de masaje se desliza con facilidad y ayuda a descomprimir la tensión tras las maniobras y las horas de mar. Textura cómoda, aroma discreto y una sensación de descanso que te prepara para la siguiente salida.",
    keywords: "Crema para Masajes Relajante, cuidado, MΛN POWERS",
    ogTitle: "Crema para Masajes Relajante | MΛN POWERS",
    ogDescription:
      "Termina la regata y notas hombros y zona lumbar cargados. Esta crema de masaje se desliza con facilidad y ayuda a descomprimir la tensión tras las maniobras y las horas de mar. Textura cómoda, aroma discreto y una sensación de descanso que te prepara para la siguiente salida.",
    ogImage: "/products/CREMA-MASAJE.jpg",
  },
  9: {
    title: "Crema para Pies con Aceite de Espliego | MΛN POWERS",
    description:
      "Tras jornadas en cubierta —con zapato náutico o descalzo—, los pies piden alivio. Esta crema con aceite de espliego hidrata, calma y ayuda a neutralizar el olor, dejando una sensación fresca para el próximo bordo. Ideal para talones y plantas que aguantan largas guardias.",
    keywords: "Crema para Pies con Aceite de Espliego, cuidado, MΛN POWERS",
    ogTitle: "Crema para Pies con Aceite de Espliego | MΛN POWERS",
    ogDescription:
      "Tras jornadas en cubierta —con zapato náutico o descalzo—, los pies piden alivio. Esta crema con aceite de espliego hidrata, calma y ayuda a neutralizar el olor, dejando una sensación fresca para el próximo bordo. Ideal para talones y plantas que aguantan largas guardias.",
    ogImage: "/products/CREMA-PIES.jpg",
  },
  10: {
    title: "Crema Anti-Rozaduras Deportivo | MΛN POWERS",
    description:
      "Antes de salir, protege los puntos de contacto con el sillín. Nuestro stick anti‑rozaduras forma una película resistente al sudor y al agua que reduce la fricción en rutas largas, manteniendo la piel cómoda bajo el culotte. Ligero y de fácil aplicación para entrenos y marchas.",
    keywords: "Crema Anti-Rozaduras Deportivo, deportes, MΛN POWERS",
    ogTitle: "Crema Anti-Rozaduras Deportivo | MΛN POWERS",
    ogDescription:
      "Antes de salir, protege los puntos de contacto con el sillín. Nuestro stick anti‑rozaduras forma una película resistente al sudor y al agua que reduce la fricción en rutas largas, manteniendo la piel cómoda bajo el culotte. Ligero y de fácil aplicación para entrenos y marchas.",
    ogImage: "/products/ANTI-ROZADURAS-CICLISMO.jpg",
  },
  11: {
    title: "Agarre Táctico Profesional | MΛN POWERS",
    description:
      "A mitad de serie, las manos sudan y la sujeción del arco debe seguir siendo constante. Este gel de agarre técnico ofrece una firmeza seca y controlada para que tu mano soporte el tiro sin deslizamientos, cuidando la piel durante la sesión. Integra el agarre en tu rutina previa al disparo.",
    keywords: "Agarre Táctico Profesional, deportes, MΛN POWERS, agarre tiro, agarre tiradores",
    ogTitle: "Agarre Táctico Profesional | MΛN POWERS",
    ogDescription:
      "A mitad de serie, las manos sudan y la sujeción del arco debe seguir siendo constante. Este gel de agarre técnico ofrece una firmeza seca y controlada para que tu mano soporte el tiro sin deslizamientos, cuidando la piel durante la sesión. Integra el agarre en tu rutina previa al disparo.",
    ogImage: "/products/agarre-tactico.avif",
  },
  12: {
    title: "Crema Efecto Frío | MΛN POWERS",
    description:
      "Entre tandas, un respiro para antebrazos y hombros. Nuestra crema efecto frío ofrece una sensación refrescante que ayuda a aliviar la carga tras las repeticiones de tiro, dejándote preparado para el siguiente end. Se absorbe rápido y no deja residuos, ideal para uso en campo.",
    keywords: "Crema Efecto Frío, deportes, MΛN POWERS",
    ogTitle: "Crema Efecto Frío | MΛN POWERS",
    ogDescription:
      "Entre tandas, un respiro para antebrazos y hombros. Nuestra crema efecto frío ofrece una sensación refrescante que ayuda a aliviar la carga tras las repeticiones de tiro, dejándote preparado para el siguiente end. Se absorbe rápido y no deja residuos, ideal para uso en campo.",
    ogImage: "/products/CREMA-EFECTO-FRIO-TIRADORES.jpg",
  },
  13: {
    title: "Cremigel Masaje Muscular | MΛN POWERS",
    description:
      "Después de la práctica, trabaja la zona escapular y el manguito rotador con un masaje cómodo. Este cremigel ayuda a suavizar la tensión acumulada por el gesto del disparo, con deslizamiento justo y rápida absorción para recuperar sensaciones.",
    keywords: "Cremigel Masaje Muscular, deportes, MΛN POWERS",
    ogTitle: "Cremigel Masaje Muscular | MΛN POWERS",
    ogDescription:
      "Después de la práctica, trabaja la zona escapular y el manguito rotador con un masaje cómodo. Este cremigel ayuda a suavizar la tensión acumulada por el gesto del disparo, con deslizamiento justo y rápida absorción para recuperar sensaciones.",
    ogImage: "/products/CREMIGEL-MASAJE-MUSCULAR-TIRADORES.jpg",
  },
  14: {
    title: "Gel efecto calor | MΛN POWERS",
    description:
      "Calienta antes de la primera serie. Nuestro gel efecto calor proporciona una sensación térmica progresiva en hombros, espalda y muñecas para activar antes de entrar a tirar. Integra el calentamiento en tu ritual, con textura que no molesta al agarre.",
    keywords: "Gel efecto calor, deportes, MΛN POWERS",
    ogTitle: "Gel efecto calor | MΛN POWERS",
    ogDescription:
      "Calienta antes de la primera serie. Nuestro gel efecto calor proporciona una sensación térmica progresiva en hombros, espalda y muñecas para activar antes de entrar a tirar. Integra el calentamiento en tu ritual, con textura que no molesta al agarre.",
    ogImage: "/products/CREMA-EFECTO-CALOR.jpg",
  },
  15: {
    title: "Gel efecto calor | MΛN POWERS",
    description:
      "En la sala, antes del asalto, activa piernas y brazos. El gel efecto calor despierta gemelos, cuádriceps y antebrazos con una sensación térmica suave que acompaña tu calentamiento sin saturar la piel. Ideal para reaccionar rápido desde el primer toque.",
    keywords: "Gel efecto calor, deportes, MΛN POWERS",
    ogTitle: "Gel efecto calor | MΛN POWERS",
    ogDescription:
      "En la sala, antes del asalto, activa piernas y brazos. El gel efecto calor despierta gemelos, cuádriceps y antebrazos con una sensación térmica suave que acompaña tu calentamiento sin saturar la piel. Ideal para reaccionar rápido desde el primer toque.",
    ogImage: "/products/CREMA-EFECTO-CALOR.jpg",
  },
  16: {
    title: "Cremigel | MΛN POWERS",
    description:
      "Tras paradas y ripostas, los antebrazos quedan tensos. Este cremigel de masaje ayuda a soltar la carga y recuperar movilidad en muñecas y codos, con una textura cómoda que se integra en tu rutina de vuelta a la calma.",
    keywords: "Cremigel, cuidado, MΛN POWERS",
    ogTitle: "Cremigel | MΛN POWERS",
    ogDescription:
      "Tras paradas y ripostas, los antebrazos quedan tensos. Este cremigel de masaje ayuda a soltar la carga y recuperar movilidad en muñecas y codos, con una textura cómoda que se integra en tu rutina de vuelta a la calma.",
    ogImage: "/products/CREMIGEL-MASAJE-MUSCULAR.jpg",
  },
  17: {
    title: "Calcio + Magnesio Vitamina K | MΛN POWERS",
    description:
      "Calcio + Magnesio Vitamina K es una combinación de nutrientes esenciales para el bienestar del cuerpo. El calcio ayuda a fortalecer los músculos y las articulaciones, mientras que el magnesio mejora la función muscular y la sensación de cuerpo. La vitamina K es crucial para el funcionamiento del sistema nervioso y muscular, y ayuda a prevenir lesiones y enfermedades. Esta combinación nutricional es esencial para mejorar el rendimiento deportivo y prevenir lesiones en atletas profesionales.",
    keywords: "Calcio + Magnesio Vitamina K, suplementos, MΛN POWERS",
    ogTitle: "Calcio + Magnesio Vitamina K | MΛN POWERS",
    ogDescription:
      "Calcio + Magnesio Vitamina K es una combinación de nutrientes esenciales para el bienestar del cuerpo. El calcio ayuda a fortalecer los músculos y las articulaciones, mientras que el magnesio mejora la función muscular y la sensación de cuerpo. La vitamina K es crucial para el funcionamiento del sistema nervioso y muscular, y ayuda a prevenir lesiones y enfermedades. Esta combinación nutricional es esencial para mejorar el rendimiento deportivo y prevenir lesiones en atletas profesionales.",
    ogImage: "/products/CALCIO-MAGNESIO-VITAMINA-K-MAN-POWERS.jpg",
  },
  18: {
    title: "Crema Efecto Frío | MΛN POWERS",
    description:
      "Termina el asalto y dedica un minuto a bajar pulsaciones. Nuestra crema efecto frío aporta una sensación refrescante que ayuda a aliviar la fatiga en antebrazos, hombros y piernas después de tirar. Se absorbe rápido y acompaña la recuperación entre combates.",
    keywords: "Crema Efecto Frío, deportes, MΛN POWERS",
    ogTitle: "Crema Efecto Frío | MΛN POWERS",
    ogDescription:
      "Termina el asalto y dedica un minuto a bajar pulsaciones. Nuestra crema efecto frío aporta una sensación refrescante que ayuda a aliviar la fatiga en antebrazos, hombros y piernas después de tirar. Se absorbe rápido y acompaña la recuperación entre combates.",
    ogImage: "/products/CREMA-EFECTO-FRIO.jpg",
  },
  19: {
    title: "Agarre técnico Profesional | MΛN POWERS",
    description:
      "Gel de agarre técnico para golf, diseñado para mejorar la sujeción del palo en condiciones de humedad, sudor o tensión competitiva. Su fórmula crea una película antideslizante que mantiene las manos firmes y secas, incrementando el control del swing y la precisión en el impacto. Ideal para entrenamientos y torneos; se aplica en palma y dedos sin dejar residuos pegajosos ni marcar el grip. Ingredientes respetuosos con la piel que ayudan a prevenir rozaduras y fatiga de manos durante la vuelta.",
    keywords: "Agarre técnico Profesional, deportes, MΛN POWERS, agarre golf, agarre golfistas",
    ogTitle: "Agarre técnico Profesional | MΛN POWERS",
    ogDescription:
      "Gel de agarre técnico para golf, diseñado para mejorar la sujeción del palo en condiciones de humedad, sudor o tensión competitiva. Su fórmula crea una película antideslizante que mantiene las manos firmes y secas, incrementando el control del swing y la precisión en el impacto.",
    ogImage: "/products/GEL-AGARRE-TECNICO.jpg",
  },
  20: {
    title: "Crema Efecto Frío | MΛN POWERS",
    description:
      "Tras el campo de prácticas o los últimos nueve hoyos, refresca antebrazos y hombros. Esta crema efecto frío ayuda a aliviar la fatiga del swing repetido, dejando la piel cómoda y lista para seguir. Textura ligera, se absorbe rápido y no deja residuo en el grip.",
    keywords: "Crema Efecto Frío, deportes, MΛN POWERS",
    ogTitle: "Crema Efecto Frío | MΛN POWERS",
    ogDescription:
      "Tras el campo de prácticas o los últimos nueve hoyos, refresca antebrazos y hombros. Esta crema efecto frío ayuda a aliviar la fatiga del swing repetido, dejando la piel cómoda y lista para seguir.",
    ogImage: "/products/CREMA-EFECTO-FRIO-GOLF.jpg",
  },
  21: {
    title: "Cremigel | MΛN POWERS",
    description:
      "Al terminar la vuelta, mima zona lumbar, hombros y antebrazos. Este cremigel de masaje ofrece el deslizamiento justo para trabajar la tensión del swing, con absorción rápida para una recuperación cómoda antes de la siguiente ronda.",
    keywords: "Cremigel, cuidado, MΛN POWERS",
    ogTitle: "Cremigel | MΛN POWERS",
    ogDescription:
      "Al terminar la vuelta, mima zona lumbar, hombros y antebrazos. Este cremigel de masaje ofrece el deslizamiento justo para trabajar la tensión del swing, con absorción rápida para una recuperación cómoda antes de la siguiente ronda.",
    ogImage: "/products/CREMIGEL-MASAJE-MUSCULAR-GOLF.jpg",
  },
  22: {
    title: "Gel efecto calor | MΛN POWERS",
    description:
      "Antes de salir al tee 1, activa la movilidad. El gel efecto calor aporta una sensación térmica gradual en hombros, muñecas y espalda para preparar el cuerpo, sin dejar sensación pegajosa ni molestar el agarre.",
    keywords: "Gel efecto calor, deportes, MΛN POWERS",
    ogTitle: "Gel efecto calor | MΛN POWERS",
    ogDescription:
      "Antes de salir al tee 1, activa la movilidad. El gel efecto calor aporta una sensación térmica gradual en hombros, muñecas y espalda para preparar el cuerpo, sin dejar sensación pegajosa ni molestar el agarre.",
    ogImage: "/products/GEL-EFECTO-CALOR-GOLF.jpg",
  },
  23: {
    title: "Champú Anti-Caída Fortalecedor | MΛN POWERS",
    description:
      "Sol, viento y horas en el campo pueden castigar el cabello. Este champú fortalecedor limpia sudor y residuos con suavidad, dejando el cuero cabelludo fresco tras la ronda. Con activos que ayudan a reforzar desde la raíz, acompaña tu juego día tras día.",
    keywords: "Champú Anti-Caída Fortalecedor, cuidado, MΛN POWERS",
    ogTitle: "Champú Anti-Caída Fortalecedor | MΛN POWERS",
    ogDescription:
      "Sol, viento y horas en el campo pueden castigar el cabello. Este champú fortalecedor limpia sudor y residuos con suavidad, dejando el cuero cabelludo fresco tras la ronda.",
    ogImage: "/products/CHAMPÚ-ANTICAIDA-GOLF.jpg",
  },
};

export const updateSEOTags = (config: SEOConfig) => {
  // Update title
  document.title = config.title;

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", config.description);
  }

  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute("content", config.keywords);
  }

  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && config.ogTitle) {
    ogTitle.setAttribute("content", config.ogTitle);
  }

  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  );
  if (ogDescription && config.ogDescription) {
    ogDescription.setAttribute("content", config.ogDescription);
  }

  // Update canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && config.canonicalUrl) {
    canonical.setAttribute("href", config.canonicalUrl);
  }
};
