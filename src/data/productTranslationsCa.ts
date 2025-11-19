type CaTrans = {
  name?: { ca: string };
  description?: { ca: string };
  category?: { ca: string };
  nutritionalValues?: { ca: string };
  application?: { ca: string };
  recommendations?: { ca: string };
  objectives?: { ca: string[] };
};

const translations: { [id: number]: CaTrans } = {
  1: {
    name: { ca: "MAN POWERS Maca Forte 10:1 - 5000" },
    description: { ca: "Suplement premium elaborat a partir d'arrel de Maca andina concentrada, que ofereix una potència de 5000 mg per càpsula. La seva fórmula està dissenyada per aportar energia explosiva, resistència física i més enfocament mental." },
    category: { ca: "suplements" },
  },
  2: {
    name: { ca: "Omega 3 - Oli de peix pur" },
    description: { ca: "Omega 3 d'oli de peix pur, enriquit amb Vitamina E. Essencial per a la salut cardiovascular, la funció cerebral i el benestar general." },
    category: { ca: "suplements" },
  },
  3: {
    name: { ca: "MAN Protector Solar Facial i Corporal SPF 50+" },
    description: { ca: "El teu aliat perfecte per a l'estiu. Aquest protector solar SPF 50+ ofereix protecció total davant els raigs UVA/UVB, combinada amb un accelerador del bronzejat. Fórmula avançada enriquida amb Àcid Hialurònic." },
    category: { ca: "cura" },
  },
  4: {
    name: { ca: "Creatina Monohidrat Premium" },
    description: { ca: "Creatina monohidrat de màxima puresa per augmentar força, potència i massa muscular. Ideal per a entrenaments d'alta intensitat i esports de força." },
    category: { ca: "suplements" },
  },
  5: {
    name: { ca: "Crema anti-friccions" },
    description: { ca: "Abans d'equipar-te amb jaqueta i plastró, prepara la pell per als assalts. Aquesta crema anti‑friccions crea una barrera invisible que redueix la fricció a aixelles, engonals i cintura, fins i tot sota la calor de la màscara. Resistent a la suor i pensada per al moviment en cada finta i desplaçament." },
    category: { ca: "cura" },
  },
  6: {
    name: { ca: "Gel d'Aloe Vera Pur" },
    description: { ca: "Gel d'àloe vera 100% pur per hidratar, calmar i regenerar la pell. Ideal per a cremades solars, irritacions i cura diària." },
    category: { ca: "cura" },
  },
  7: {
    name: { ca: "Xampú Anticaiguda Fortalidor" },
    description: { ca: "El Xampú Anticaiguda Manpowers, amb la fórmula 'Hair Denseer', és un tractament diari dissenyat per combatre les principals causes de la caiguda del cabell masculí. La seva mescla d'actius estimula l'arrel i reforça l'estructura capil·lar. Neteja i tracta el cuir cabellut, oferint un cabell més fort, dens i amb vitalitat." },
    category: { ca: "cura" },
    objectives: { ca: [
      "Reducció de la caiguda: disminuir activament la pèrdua de cabell.",
      "Activació del creixement: estimular el fol·licle per promoure cabell nou.",
      "Enfortiment del cabell: augmentar la resistència de la fibra capil·lar.",
      "Increment de densitat: aportar un aspecte més gruixut i voluminos." ] },
  },
  8: {
    name: { ca: "Crema de massatge relaxant" },
    description: { ca: "Després de la regata, espatlles i zona lumbar carregades. Aquesta crema de massatge llisca amb facilitat i ajuda a descarregar la tensió després de les maniobres i les hores de mar. Textura còmoda, aroma discret i sensació de descans que et prepara per a la següent sortida." },
    category: { ca: "cura" },
  },
  9: {
    name: { ca: "Crema per als peus amb oli d'espígol" },
    description: { ca: "Després d'hores a coberta, els peus necessiten alleujament. Aquesta crema amb oli d'espígol hidrata, calma i ajuda a neutralitzar l'olor, deixant una sensació fresca per al proper bord. Ideal per a talons i plantes." },
    category: { ca: "cura" },
  },
  10: {
    name: { ca: "Crema anti-friccions esportiva" },
    description: { ca: "Protegeix els punts de contacte amb el selló abans de la ruta. El nostre stick anti‑friccions forma una pel·lícula resistent a la suor i a l'aigua que redueix la fricció en rutes llargues, mantenint la pell còmoda sota el culot. Lleuger i fàcil d'aplicar." },
    category: { ca: "cura" },
  },
  11: {
    name: { ca: "Grip tàctic professional" },
    description: { ca: "A mitja sèrie, les mans suen i la subjecció de l'arc ha de ser constant. Aquest gel de grip tècnic aporta fermesa seca i controlada perquè la mà resisteixi sense lliscaments, cuidant la pell durant la sessió." },
    category: { ca: "esports" },
  },
  12: {
    name: { ca: "Crema efecte fred" },
    description: { ca: "Entre tandes, un respir per a avantbraços i espatlles. La crema efecte fred aporta una sensació refrescant que ajuda a alleujar la càrrega després dels tirs repetits. Absorció ràpida i sense residus." },
    category: { ca: "esports" },
  },
  13: {
    name: { ca: "Cremigel massatge muscular" },
    description: { ca: "Després de la pràctica, treballa zona escapular i maneguet dels rotadors amb un massatge còmode. Aquest cremigel ajuda a suavitzar la tensió acumulada pel gest del tir." },
    category: { ca: "esports" },
  },
  14: {
    name: { ca: "Gel efecte calor" },
    description: { ca: "Escalfa abans de la primera sèrie. El gel efecte calor proporciona una sensació tèrmica progressiva en espatlles, esquena i canells per activar abans de tirar." },
    category: { ca: "esports" },
  },
  15: {
    name: { ca: "Gel efecte calor" },
    description: { ca: "A la sala, abans de l'assalt, activa cames i braços. El gel efecte calor desperta bessons, quàdriceps i avantbraços amb una sensació tèrmica suau que acompanya l'escalfament." },
    category: { ca: "esports" },
  },
  16: {
    name: { ca: "Cremigel de massatge" },
    description: { ca: "Després de parades i respostes, els avantbraços queden tensos. Aquest cremigel ajuda a alliberar la càrrega i recuperar mobilitat a canells i colzes." },
    category: { ca: "cura" },
  },
  17: {
    name: { ca: "Calci + Magnesi Vitamina K" },
    description: { ca: "Combinació de nutrients essencials per al benestar del cos. El calci reforça músculs i articulacions; el magnesi millora la funció muscular; la vitamina K és clau per al sistema nerviós i muscular. Ajuden al rendiment esportiu i a prevenir lesions." },
    category: { ca: "suplements" },
  },
  18: {
    name: { ca: "Crema efecte fred" },
    description: { ca: "Després d'un assalt, dedica un minut a baixar pulsacions. La nostra crema efecte fred ajuda a alleujar la fatiga en avantbraços, espatlles i cames. Absorció ràpida." },
    category: { ca: "esports" },
  },
  19: {
    name: { ca: "Grip tècnic professional" },
    description: { ca: "Gel de grip tècnic per a golf, dissenyat per millorar la subjecció del pal en humitat, suor o tensió competitiva. Forma una pel·lícula antilliscant que manté les mans seques i fermes, millorant el control del swing i la precisió." },
    category: { ca: "esports" },
  },
  20: {
    name: { ca: "Crema efecte fred" },
    description: { ca: "Després del camp de pràctiques o els últims nou forats, refresca avantbraços i espatlles. Aquesta crema efecte fred ajuda a alleujar la fatiga del swing repetit." },
    category: { ca: "esports" },
  },
  21: {
    name: { ca: "Cremigel de massatge" },
    description: { ca: "En acabar la volta, cuida zona lumbar, espatlles i avantbraços. Cremigel amb el lliscament just per treballar la tensió del swing, amb absorció ràpida." },
    category: { ca: "cura" },
  },
  22: {
    name: { ca: "Gel efecte calor" },
    description: { ca: "Abans de sortir al tee 1, activa la mobilitat. El gel efecte calor dona sensació tèrmica gradual a espatlles, canells i esquena per preparar el cos, sense enganxar." },
    category: { ca: "esports" },
  },
  23: {
    name: { ca: "Xampú Anticaiguda Fortalidor" },
    description: { ca: "Sol, vent i hores al camp poden castigar el cabell. Aquest xampú fortalecidor neteja suaument suor i residus, deixant el cuir cabellut fresc. Amb actius que ajuden a reforçar des de l'arrel." },
    category: { ca: "cura" },
    objectives: { ca: [
      "Reducció de la caiguda: disminuir activament la pèrdua de cabell.",
      "Activació del creixement: estimular el fol·licle per promoure cabell nou.",
      "Enfortiment del cabell: augmentar la resistència de la fibra capil·lar.",
      "Increment de densitat: aportar un aspecte més gruixut i voluminos." ] },
  },
};

export default translations;