import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingCart, X } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price?: number;
  image?: string;
  quantity: number;
};

type CategoryI18n = {
  es?: string;
  en?: string;
  ca?: string;
};

type PromoCategories =
  | null
  | string[]
  | {
      es?: string[];
      en?: string[];
      ca?: string[];
    };

type PromoEntry = {
  percent: number;
  categories?: PromoCategories;
};

type PromoResponse = Record<string, number | PromoEntry>;

const STORAGE_KEY = "cart";

// Helper function to convert European price format to number
const parsePrice = (price: string | number | undefined): number => {
  if (typeof price === "number") return isNaN(price) ? 0 : price;
  if (typeof price === "string") {
    // Convert European format "36,30" to 36.30
    const cleanPrice = price.replace(",", ".").replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleanPrice);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Helper function to validate email
const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email.trim());
const isValidPhone = (phone: string) =>
  /^(\+?\d[\d\s-]{6,})$/.test(phone.trim());

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getBaseProductIdNumber = (value: string) => {
  const base = value.split("-")[0] || "";
  const n = Number(base);
  return Number.isFinite(n) ? n : null;
};

const resolvePromoCategoriesList = (
  promoCategories: PromoCategories,
  currentLanguage: "es" | "en" | "ca",
) => {
  if (promoCategories === null) return null;
  if (Array.isArray(promoCategories)) return promoCategories;
  const preferred = promoCategories[currentLanguage];
  if (preferred?.length) return preferred;
  return [
    ...(promoCategories.es || []),
    ...(promoCategories.en || []),
    ...(promoCategories.ca || []),
  ];
};

const CartWidget: React.FC<{ className?: string; hideSidebar?: boolean }> = ({
  hideSidebar,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[] | null>(null);
  const [paymentStep, setPaymentStep] = useState<"summary" | "processing">(
    "summary",
  );

  const [paymentError, setPaymentError] = useState<string>("");
  const { t, i18n } = useTranslation();

  const [autoCardOnOpen, setAutoCardOnOpen] = useState(false);

  const baseLang =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "es";
  const currentLanguage: "es" | "en" | "ca" =
    baseLang === "en" ? "en" : baseLang === "ca" ? "ca" : "es";

  // Guardar carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Permitir añadir al carrito desde otras partes (opcional)
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{
        id: string;
        name: string;
        price?: number;
        image?: string;
        quantity?: number;
        openCart?: boolean;
        openCheckout?: boolean;
        buyNow?: boolean;
      }>;
      const incoming = ce.detail as Omit<CartItem, "quantity"> & {
        quantity?: number;
        openCart?: boolean;
        openCheckout?: boolean;
        buyNow?: boolean;
      };
      if (!incoming?.id || !incoming?.name) return;

      const qty = Math.max(1, incoming.quantity ?? 1);
      if (incoming.buyNow) {
        setCheckoutItems([
          {
            id: incoming.id,
            name: incoming.name,
            price: incoming.price,
            image: incoming.image,
            quantity: qty,
          },
        ]);
        setAutoCardOnOpen(!autoCardOnOpen);
      } else {
        setItems((prev) => {
          const existing = prev.find((i) => i.id === incoming.id);
          if (existing) {
            return prev.map((i) =>
              i.id === incoming.id ? { ...i, quantity: i.quantity + qty } : i,
            );
          }
          return [
            ...prev,
            {
              id: incoming.id,
              name: incoming.name,
              price: incoming.price,
              image: incoming.image,
              quantity: qty,
            },
          ];
        });
      }

      const shouldOpenCart =
        (incoming.openCart ?? (!incoming.buyNow && !incoming.openCheckout)) &&
        !hideSidebar;
      if (shouldOpenCart) {
        setOpen(true);
      }
      if (incoming.openCheckout || incoming.buyNow) {
        setCheckoutOpen(true);
      }
    };

    window.addEventListener("cart:add", handler as EventListener);
    return () =>
      window.removeEventListener("cart:add", handler as EventListener);
  }, [autoCardOnOpen, t, hideSidebar]);

  useEffect(() => {
    try {
      window.dispatchEvent(
        new CustomEvent("cart:checkoutOpen", { detail: checkoutOpen }),
      );
    } catch {
      // ignore
    }
  }, [checkoutOpen]);

  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent("cart:open", { detail: open }));
    } catch {
      // ignore
    }
  }, [open]);

  useEffect(() => {
    const shouldLock = open || checkoutOpen;
    if (!shouldLock) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [open, checkoutOpen]);

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items],
  );
  const checkoutList = checkoutItems ?? items;
  const checkoutTotalItems = useMemo(
    () => checkoutList.reduce((acc, i) => acc + i.quantity, 0),
    [checkoutList],
  );
  const [subtotal, setSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoCategories, setPromoCategories] = useState<PromoCategories>(null);
  const [categoryByProductId, setCategoryByProductId] = useState<
    Record<number, CategoryI18n>
  >({});
  const [eligibleSubtotal, setEligibleSubtotal] = useState(0);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerEmailError, setBuyerEmailError] = useState("");
  const [buyerFirstName, setBuyerFirstName] = useState("");
  const [buyerLastName, setBuyerLastName] = useState("");
  const [buyerSecondLastName, setBuyerSecondLastName] = useState("");
  const [buyerFirstNameError, setBuyerFirstNameError] = useState("");
  const [buyerLastNameError, setBuyerLastNameError] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerPhoneError, setBuyerPhoneError] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  // Campos de dirección requeridos
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [locality, setLocality] = useState("");
  const [province, setProvince] = useState("");
  const [addressError, setAddressError] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");
  const [localityError, setLocalityError] = useState("");
  const [provinceError, setProvinceError] = useState("");

  const promoCategoriesList = useMemo(
    () => resolvePromoCategoriesList(promoCategories, currentLanguage),
    [promoCategories, currentLanguage],
  );
  const promoCategoriesLabel = useMemo(() => {
    if (!promoCategoriesList?.length) return "";
    const uniq = Array.from(
      new Map(promoCategoriesList.map((c) => [normalizeText(c), c])).values(),
    );
    return uniq.join(", ");
  }, [promoCategoriesList]);

  useEffect(() => {
    const load = async () => {
      try {
        const [mpRes, tamdRes] = await Promise.allSettled([
          fetch("/products.json?v=" + new Date().getTime()),
          fetch("/tamdProducts.json?v=" + new Date().getTime()),
        ]);

        const next: Record<number, CategoryI18n> = {};

        if (mpRes.status === "fulfilled" && mpRes.value.ok) {
          const data = await mpRes.value.json();
          const products = (data?.products || []) as Array<{
            id: number;
            category?: string | CategoryI18n;
          }>;
          products.forEach((p) => {
            if (!p?.id) return;
            const cat =
              typeof p.category === "string"
                ? { es: p.category, en: p.category }
                : p.category;
            if (cat) next[p.id] = cat;
          });
        }

        if (tamdRes.status === "fulfilled" && tamdRes.value.ok) {
          const data = await tamdRes.value.json();
          const products = (data?.products || []) as Array<{
            id: number;
            category?: string | CategoryI18n;
          }>;
          products.forEach((p) => {
            const id = Number(p?.id);
            if (!Number.isFinite(id)) return;
            const offsetId = id + 10000;
            const cat =
              typeof p.category === "string"
                ? { es: p.category, en: p.category }
                : p.category;
            if (cat) next[offsetId] = cat;
          });
        }

        setCategoryByProductId(next);
      } catch {
        setCategoryByProductId({});
      }
    };

    load();
  }, []);

  useEffect(() => {
    const promoCats = resolvePromoCategoriesList(
      promoCategories,
      currentLanguage,
    );
    const promoSet = promoCats ? new Set(promoCats.map(normalizeText)) : null;

    let newSubtotal = 0;
    let newEligibleSubtotal = 0;

    checkoutList.forEach((item) => {
      const itemTotal = parsePrice(item.price) * 1.21 * item.quantity;
      newSubtotal += itemTotal;

      if (!promoSet) {
        newEligibleSubtotal += itemTotal;
        return;
      }

      const baseId = getBaseProductIdNumber(item.id);
      if (baseId === null) return;

      const category = categoryByProductId[baseId];
      const candidates = [
        category?.[currentLanguage],
        category?.es,
        category?.en,
        category?.ca,
      ].filter((v): v is string => Boolean(v && typeof v === "string"));

      const isEligible = candidates.some((c) => promoSet.has(normalizeText(c)));
      if (isEligible) newEligibleSubtotal += itemTotal;
    });

    setSubtotal(newSubtotal);
    setEligibleSubtotal(newEligibleSubtotal);
  }, [checkoutList, promoCategories, categoryByProductId, currentLanguage]);

  useEffect(() => {
    const nextDiscountAmount = eligibleSubtotal * (discount / 100);
    setTotalPrice(Math.max(0, subtotal - nextDiscountAmount));
  }, [subtotal, eligibleSubtotal, discount]);

  const applyPromoCode = async () => {
    try {
      const rawCode = promoCode.trim();
      if (!rawCode) {
        setDiscount(0);
        setPromoCategories(null);
        setPromoError("");
        return;
      }

      const res1 = await fetch("/backend/promo.php");
      const response = res1.ok
        ? res1
        : await fetch("https://manpowers.es/backend/api/promo.php");
      if (!response.ok) throw new Error("promo");

      const promos = (await response.json()) as PromoResponse;
      const entry =
        promos[rawCode] ??
        promos[rawCode.toUpperCase()] ??
        promos[rawCode.toLowerCase()] ??
        promos[
          Object.keys(promos).find(
            (k) => k.toLowerCase() === rawCode.toLowerCase(),
          ) || ""
        ];

      if (typeof entry === "number") {
        setDiscount(entry);
        setPromoCategories(null);
        setPromoError("");
        return;
      }

      if (
        entry &&
        typeof entry === "object" &&
        typeof entry.percent === "number"
      ) {
        setDiscount(entry.percent);
        setPromoCategories(entry.categories ?? null);
        setPromoError("");
        return;
      } else {
        setDiscount(0);
        setPromoCategories(null);
        setPromoError(t("cart.promoInvalid"));
      }
    } catch {
      setDiscount(0);
      setPromoCategories(null);
      setPromoError(t("cart.promoError"));
    }
  };

  const increment = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  };

  const decrement = (id: string) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const resetPaymentState = () => {
    setPaymentStep("summary");
    setPaymentError("");
  };

  const startRedirectPayment = async () => {
    try {
      // Validación de email obligatoria
      if (!isValidEmail(buyerEmail)) {
        setBuyerEmailError(t("cart.invalidEmail"));
        setPaymentError(t("cart.invalidEmail"));
        return;
      }

      // Validación de campos requeridos
      let hasError = false;
      if (!buyerFirstName.trim()) {
        setBuyerFirstNameError(t("cart.firstNameRequired"));
        hasError = true;
      }
      if (!buyerLastName.trim()) {
        setBuyerLastNameError(t("cart.lastNameRequired"));
        hasError = true;
      }
      if (!buyerPhone.trim()) {
        setBuyerPhoneError(t("cart.phoneRequired"));
        hasError = true;
      } else if (!isValidPhone(buyerPhone)) {
        setBuyerPhoneError(t("cart.invalidPhone"));
        hasError = true;
      }
      if (!address.trim()) {
        setAddressError(t("cart.addressRequired"));
        hasError = true;
      }
      if (!postalCode.trim()) {
        setPostalCodeError(t("cart.postalRequired"));
        hasError = true;
      }
      if (!locality.trim()) {
        setLocalityError(t("cart.localityRequired"));
        hasError = true;
      }
      if (!province.trim()) {
        setProvinceError(t("cart.provinceRequired"));
        hasError = true;
      }
      if (hasError) {
        return;
      }

      // Guardar email y dirección del comprador
      try {
        sessionStorage.setItem("buyerEmail", buyerEmail.trim());
        sessionStorage.setItem("buyerFirstName", buyerFirstName.trim());
        sessionStorage.setItem("buyerLastName", buyerLastName.trim());
        sessionStorage.setItem(
          "buyerSecondLastName",
          buyerSecondLastName.trim(),
        );
        sessionStorage.setItem("buyerPhone", buyerPhone.trim());
        sessionStorage.setItem("buyerAddress", address.trim());
        sessionStorage.setItem("buyerPostalCode", postalCode.trim());
        sessionStorage.setItem("buyerLocality", locality.trim());
        sessionStorage.setItem("buyerProvince", province.trim());
        sessionStorage.setItem("promoCode", promoCode.trim());
        sessionStorage.setItem("discountPercent", String(discount));
        sessionStorage.setItem("marketingOptIn", marketingOptIn ? "Sí" : "No");
        try {
          const dump: Record<string, string | null> = {};
          for (let i = 0; i < sessionStorage.length; i++) {
            const k = sessionStorage.key(i);
            if (k) dump[k] = sessionStorage.getItem(k);
          }
          console.log("[sessionStorage dump antes de redirigir]", dump);
        } catch (err) {
          console.warn("No se pudo leer sessionStorage:", err);
        }
      } catch {
        /* empty */
      }

      // Generar un orderId y persistir datos para la página de resultado
      const order = String(Math.floor(100000000 + Math.random() * 900000000));
      try {
        sessionStorage.setItem("orderId", order);
        const names = checkoutList.map((i) => i.name).join("|");
        sessionStorage.setItem("productNames", names);
        sessionStorage.setItem("totalPrice", String(totalPrice.toFixed(2)));
      } catch {
        /* empty */
      }

      setPaymentError("");
      setPaymentStep("processing");

      // Enviar formulario al backend para redirección clásica (sin iframe)
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/backend/redsys-config.php";

      const add = (name: string, value: string) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      add("order", order);
      add("amount", Math.round(totalPrice * 100).toString());

      document.body.appendChild(form);
      form.submit();
    } catch {
      setPaymentError(t("cart.paymentErrorRedirect"));
      setPaymentStep("summary");
    }
  };

  const requiredMark = (
    <span className="text-red-600 ml-1" aria-hidden="true">
      *
    </span>
  );

  return (
    <div className="m-0">
      {!hideSidebar && (
        <>
          <button
            onClick={() => setOpen(true)}
            className="relative bg-transparent hover:bg-transparent text-black py-2 rounded-lg transition-all duration-200 flex items-center justify-center"
            aria-label={t("cart.open")}
          >
            <ShoppingCart className="h-6 w-6 text-black" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white rounded-full text-xs px-1.5 py-0.5 min-w-5 text-center ring-1 ring-black">
                {totalItems}
              </span>
            )}
          </button>

          {open && (
            <div
              className="fixed top-0 left-0 h-screen w-full sm:w-[calc(100%-420px)] bg-black/40 z-[90] cart-overlay-fade-in"
              onClick={() => setOpen(false)}
            />
          )}

          <aside
            className={`fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-[var(--color-primary)] text-black z-[100] shadow-2xl transform transition-transform duration-300 border-l border-black/10 ${
              open ? "translate-x-0" : "translate-x-full"
            } flex flex-col`}
            aria-label={t("cart.title")}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
              <h2 className="text-xl font-bold">{t("cart.title")}</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-black/60 hover:text-black transition-colors"
                aria-label={t("cart.close")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-4 overflow-y-auto overscroll-contain flex-1 min-h-0">
              {items.length === 0 ? (
                <p className="text-black/70">{t("cart.empty")}</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-4 bg-black/5 rounded-lg p-3"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-black/5 flex items-center justify-center text-xs text-black/50">
                          {t("cart.noImage")}
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{item.name}</span>
                          {item.price !== undefined ? (
                            <div className="flex flex-col items-end">
                              <span className="text-black font-semibold">
                                €{(parsePrice(item.price) * 1.21).toFixed(2)}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                IVA incluido
                              </span>
                              <span className="text-[10px] text-gray-400">
                                (sin IVA: €
                                {(
                                  parsePrice(item.price) * item.quantity
                                ).toFixed(2)}
                                )
                              </span>
                            </div>
                          ) : (
                            <span className="text-black/50 text-sm">
                              {t("cart.noPrice")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-black/20 rounded">
                            <button
                              className="px-2 py-1 hover:bg-black/5"
                              onClick={() => decrement(item.id)}
                              aria-label={t("cart.decreaseQty")}
                            >
                              −
                            </button>
                            <span className="px-3">{item.quantity}</span>
                            <button
                              className="px-2 py-1 hover:bg-black/5"
                              onClick={() => increment(item.id)}
                              aria-label={t("cart.increaseQty")}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="text-red-600 hover:text-red-500 text-sm"
                            onClick={() => removeItem(item.id)}
                          >
                            {t("cart.remove")}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="px-5 py-4 border-t border-black/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-black/70">
                  {t("cart.total")} <span className="text-xs">(incl. IVA)</span>
                </span>
                <span className="text-2xl font-bold">
                  €{totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (totalItems > 0) {
                      clearCart();
                    }
                    setOpen(false);
                    setCheckoutOpen(false);
                  }}
                  className="flex-1 border border-black/20 hover:bg-black/5 text-black rounded-lg px-4 py-3 transition-colors"
                >
                  {totalItems > 0 ? t("cart.clear") : t("cart.close")}
                </button>
                <button
                  className={`flex-1 font-semibold rounded-lg px-4 py-3 transition-colors ${
                    totalItems > 0
                      ? "bg-black hover:bg-black/90 text-white"
                      : "bg-black/10 text-black/40 cursor-not-allowed"
                  }`}
                  onClick={() => setCheckoutOpen(true)}
                  disabled={totalItems === 0}
                >
                  {t("cart.checkout")}
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Modal de Checkout */}
      {checkoutOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-[110] md:h-[100vh]"
            onClick={() => {
              setCheckoutOpen(false);
              setCheckoutItems(null);
              resetPaymentState();
            }}
          />
          <div className="fixed inset-0 z-[120] flex items-stretch md:items-center justify-center p-0 md:p-4 md:h-[100vh]">
            <div className="w-full h-screen md:max-h-[700px] sm:max-w-md md:max-w-3xl lg:max-w-4xl bg-[var(--color-primary)] text-black rounded-none md:rounded-xl shadow-2xl border border-black/10 flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
                <h3 className="text-black font-semibold mb-2 text-center">
                  {t("cart.finishPurchase")}
                </h3>
                <button
                  onClick={() => {
                    setCheckoutOpen(false);
                    setCheckoutItems(null);
                    resetPaymentState();
                  }}
                  aria-label={t("cart.modal.close")}
                  className="text-black/60 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-4 flex-1 overflow-y-auto min-h-0">
                {paymentStep === "summary" && (
                  <>
                    <div className="bg-black/5 rounded-lg p-3 border border-black/10">
                      <h4 className="font-semibold mb-2 text-black">
                        {t("cart.orderSummary")}
                      </h4>
                      <div className="space-y-1 text-sm">
                        {checkoutList.map((item) => {
                          const itemPrice = parsePrice(item.price) * 1.21;
                          const itemTotal = itemPrice * item.quantity;
                          return (
                            <div
                              key={item.id}
                              className="flex justify-between text-black/80"
                            >
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <div className="flex flex-col items-end">
                                <span>€{itemTotal.toFixed(2)}</span>
                                <span className="text-[10px] text-gray-500">
                                  IVA incluido
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  (sin IVA: €
                                  {(
                                    parsePrice(item.price) * item.quantity
                                  ).toFixed(2)}
                                  )
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        <div className="border-t border-black/10 pt-2 space-y-2">
                          <div className="flex justify-between text-sm text-black/60">
                            <span>{t("cart.subtotal")}:</span>
                            <span>€{subtotal.toFixed(2)}</span>
                          </div>

                          {discount > 0 &&
                            (promoCategories === null ||
                              eligibleSubtotal > 0) && (
                              <div className="flex justify-between text-sm text-green-700">
                                <span>
                                  {promoCategories !== null
                                    ? t("cart.discountApplied")
                                    : t("cart.discount")}
                                  :
                                </span>
                                <span>
                                  -€
                                  {(
                                    (eligibleSubtotal * discount) /
                                    100
                                  ).toFixed(2)}{" "}
                                  ({discount}%)
                                </span>
                              </div>
                            )}
                          <div className="font-semibold flex justify-between text-black">
                            <span>
                              {t("cart.total")}{" "}
                              <span className="text-xs font-normal">
                                (IVA incluido)
                              </span>
                              :
                            </span>
                            <span>€{totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-black/5 rounded-lg p-3 border border-black/10">
                      <h4 className="font-semibold mb-2 text-black">
                        {t("cart.promoTitle")}
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder={t("cart.promoPlaceholder")}
                          aria-label={t("cart.promoAriaLabel")}
                          className="flex-1 bg-[var(--color-primary)] text-black rounded-md px-3 py-2 text-sm border border-black/20 focus:ring-2 focus:ring-black/20 focus:outline-none"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-3 py-1 rounded text-sm"
                        >
                          {t("cart.apply")}
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-red-600 text-xs mt-2">
                          {promoError}
                        </p>
                      )}
                      {!promoError &&
                        discount > 0 &&
                        promoCategories !== null &&
                        eligibleSubtotal <= 0 && (
                          <p className="text-amber-700 text-xs mt-2">
                            {t("cart.promoExclusiveCategory", {
                              category: promoCategoriesLabel,
                            })}
                          </p>
                        )}
                    </div>
                    <div className="bg-black/5 rounded-lg p-3 border border-black/10">
                      <h4 className="font-semibold mb-2 text-black">
                        {t("cart.emailLabel")}
                      </h4>
                      <label className="block text-sm text-black/80">
                        {t("cart.emailInputLabel")}
                        {requiredMark}
                      </label>
                      <input
                        type="email"
                        required
                        value={buyerEmail}
                        onChange={(e) => {
                          setBuyerEmail(e.target.value);
                          if (buyerEmailError) setBuyerEmailError("");
                          if (paymentError) setPaymentError("");
                        }}
                        placeholder={t("cart.emailPlaceholder")}
                        className="w-full bg-[var(--color-primary)] text-black rounded-md px-3 py-2 text-sm border border-black/20 focus:ring-2 focus:ring-black/20 focus:outline-none"
                      />
                      {buyerEmailError && (
                        <p className="text-red-600 text-xs mt-2">
                          {buyerEmailError}
                        </p>
                      )}
                      <div className="mt-4">
                        <h5 className="text-sm font-semibold text-black mb-2">
                          {t("cart.contactDetailsTitle")}
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-black/80">
                              {t("cart.firstNameLabel")}
                              {requiredMark}
                            </label>
                            <input
                              type="text"
                              required
                              value={buyerFirstName}
                              onChange={(e) => {
                                setBuyerFirstName(e.target.value);
                                if (buyerFirstNameError)
                                  setBuyerFirstNameError("");
                                if (paymentError) setPaymentError("");
                              }}
                              className="w-full bg-[var(--color-primary)] text-black rounded-md px-3 py-2 text-sm border border-black/20 focus:ring-2 focus:ring-black/20 focus:outline-none"
                            />
                            {buyerFirstNameError && (
                              <p className="text-red-600 text-xs mt-2">
                                {buyerFirstNameError}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm text-black/80">
                              {t("cart.lastNameLabel")}
                              {requiredMark}
                            </label>
                            <input
                              type="text"
                              required
                              value={buyerLastName}
                              onChange={(e) => {
                                setBuyerLastName(e.target.value);
                                if (buyerLastNameError)
                                  setBuyerLastNameError("");
                                if (paymentError) setPaymentError("");
                              }}
                              className="w-full bg-[var(--color-primary)] text-black rounded-md px-3 py-2 text-sm border border-black/20 focus:ring-2 focus:ring-black/20 focus:outline-none"
                            />
                            {buyerLastNameError && (
                              <p className="text-red-600 text-xs mt-2">
                                {buyerLastNameError}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          <div>
                            <label className="block text-sm text-black/80">
                              {t("cart.secondLastNameLabel")}
                            </label>
                            <input
                              type="text"
                              value={buyerSecondLastName}
                              onChange={(e) => {
                                setBuyerSecondLastName(e.target.value);
                                if (paymentError) setPaymentError("");
                              }}
                              className="w-full bg-[var(--color-primary)] text-black rounded-md px-3 py-2 text-sm border border-black/20 focus:ring-2 focus:ring-black/20 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-black/80">
                              {t("cart.phoneLabel")}
                              {requiredMark}
                            </label>
                            <input
                              type="tel"
                              required
                              value={buyerPhone}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBuyerPhone(val);
                                if (!val.trim()) {
                                  setBuyerPhoneError(t("cart.phoneRequired"));
                                } else if (!isValidPhone(val)) {
                                  setBuyerPhoneError(t("cart.invalidPhone"));
                                } else {
                                  setBuyerPhoneError("");
                                }
                              }}
                              placeholder={t("cart.phonePlaceholder")}
                              className="w-full bg-[var(--color-primary)] text-black rounded-md px-3 py-2 text-sm border border-black/20 focus:ring-2 focus:ring-black/20 focus:outline-none"
                            />
                            {buyerPhoneError && (
                              <p className="text-red-600 text-xs mt-2">
                                {buyerPhoneError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-black/10">
                        <h5 className="text-sm font-semibold text-black mb-2">
                          {t("cart.shippingDetailsTitle")}
                        </h5>
                        <div className="space-y-2">
                          <label className="block text-sm text-black/80">
                            {t("cart.addressLabel")}
                            {requiredMark}
                          </label>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);
                              if (addressError) setAddressError("");
                            }}
                            placeholder={t("cart.addressPlaceholder")}
                            className="w-full bg-[var(--color-primary)] text-black rounded-md px-3 py-2 text-sm border border-black/20 focus:ring-2 focus:ring-black/20 focus:outline-none"
                          />
                          {addressError && (
                            <p className="text-red-600 text-xs">
                              {addressError}
                            </p>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm text-black/80">
                                {t("cart.postalCodeLabel")}
                                {requiredMark}
                              </label>
                              <input
                                type="text"
                                required
                                value={postalCode}
                                onChange={(e) => {
                                  setPostalCode(e.target.value);
                                  if (postalCodeError) setPostalCodeError("");
                                }}
                                placeholder={t("cart.postalCodePlaceholder")}
                                className="w-full bg-[var(--color-primary)] text-black rounded-md px-3 py-2 text-sm border border-black/20 focus:ring-2 focus:ring-black/20 focus:outline-none"
                              />
                              {postalCodeError && (
                                <p className="text-red-600 text-xs mt-2">
                                  {postalCodeError}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm text-black/80">
                                {t("cart.localityLabel")}
                                {requiredMark}
                              </label>
                              <input
                                type="text"
                                required
                                value={locality}
                                onChange={(e) => {
                                  setLocality(e.target.value);
                                  if (localityError) setLocalityError("");
                                }}
                                placeholder={t("cart.localityPlaceholder")}
                                className="w-full bg-[var(--color-primary)] text-black rounded-md px-3 py-2 text-sm border border-black/20 focus:ring-2 focus:ring-black/20 focus:outline-none"
                              />
                              {localityError && (
                                <p className="text-red-600 text-xs mt-2">
                                  {localityError}
                                </p>
                              )}
                            </div>
                          </div>

                          <label className="block text-sm text-black/80">
                            {t("cart.provinceLabel")}
                            {requiredMark}
                          </label>
                          <input
                            type="text"
                            required
                            value={province}
                            onChange={(e) => {
                              setProvince(e.target.value);
                              if (provinceError) setProvinceError("");
                            }}
                            placeholder={t("cart.provincePlaceholder")}
                            className="w-full bg-[var(--color-primary)] text-black rounded-md px-3 py-2 text-sm border border-black/20 focus:ring-2 focus:ring-black/20 focus:outline-none"
                          />
                          {provinceError && (
                            <p className="text-red-600 text-xs">
                              {provinceError}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-3 p-2 rounded-lg border border-black/10 bg-black/5 hover:border-black/20 transition-colors">
                          <input
                            id="marketingOptIn"
                            type="checkbox"
                            checked={marketingOptIn}
                            onChange={(e) =>
                              setMarketingOptIn(e.target.checked)
                            }
                            className="h-5 w-5 rounded border-black/30 bg-[var(--color-primary)] accent-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)] cursor-pointer"
                          />
                          <label
                            htmlFor="marketingOptIn"
                            className="text-sm text-black/80 cursor-pointer"
                          >
                            {t("cart.marketingOptInLabel")}
                          </label>
                        </div>
                      </div>
                    </div>
                    {paymentError && (
                      <div className="bg-red-100 border border-red-400 rounded-lg p-3">
                        <p className="text-red-700 text-sm">{paymentError}</p>
                      </div>
                    )}
                  </>
                )}

                {paymentStep === "processing" && (
                  <div className="bg-black/5 rounded-lg p-6 border border-black/10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-black">Procesando pago...</p>
                  </div>
                )}
              </div>

              {paymentStep === "summary" && (
                <div className="px-5 py-4 border-t border-black/10 space-y-3">
                  <button
                    onClick={startRedirectPayment}
                    disabled={
                      checkoutTotalItems === 0 ||
                      !isValidEmail(buyerEmail) ||
                      !buyerFirstName.trim() ||
                      !buyerLastName.trim() ||
                      !buyerPhone.trim() ||
                      !isValidPhone(buyerPhone) ||
                      !address.trim() ||
                      !postalCode.trim() ||
                      !locality.trim() ||
                      !province.trim()
                    }
                    className={`w-full font-semibold rounded-lg px-4 py-3 transition-all duration-200 ${
                      checkoutTotalItems > 0 &&
                      isValidEmail(buyerEmail) &&
                      buyerFirstName.trim() &&
                      buyerLastName.trim() &&
                      buyerPhone.trim() &&
                      isValidPhone(buyerPhone) &&
                      address.trim() &&
                      postalCode.trim() &&
                      locality.trim() &&
                      province.trim()
                        ? "bg-black hover:bg-black/90 text-white"
                        : "bg-black/10 text-black/40 cursor-not-allowed"
                    }`}
                  >
                    {t("cart.payWithCard")}
                  </button>
                  <button
                    onClick={() => {
                      setCheckoutOpen(false);
                      resetPaymentState();
                    }}
                    className="w-full border border-black/20 hover:bg-black/5 text-black rounded-lg px-4 py-2 transition-all duration-200"
                  >
                    {t("cart.modal.close")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartWidget;
