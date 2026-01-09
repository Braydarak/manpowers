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
    "summary"
  );

  const [paymentError, setPaymentError] = useState<string>("");
  const { t } = useTranslation();

  const [autoCardOnOpen, setAutoCardOnOpen] = useState(false);

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
              i.id === incoming.id ? { ...i, quantity: i.quantity + qty } : i
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
        new CustomEvent("cart:checkoutOpen", { detail: checkoutOpen })
      );
    } catch {
      // ignore
    }
  }, [checkoutOpen]);

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items]
  );
  const checkoutList = checkoutItems ?? items;
  const checkoutTotalItems = useMemo(
    () => checkoutList.reduce((acc, i) => acc + i.quantity, 0),
    [checkoutList]
  );
  const [subtotal, setSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerEmailError, setBuyerEmailError] = useState("");
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

  useEffect(() => {
    const newSubtotal = checkoutList.reduce(
      (acc, i) => acc + parsePrice(i.price) * i.quantity,
      0
    );
    setSubtotal(newSubtotal);
  }, [checkoutList]);

  useEffect(() => {
    const finalPrice = subtotal * (1 - discount / 100);
    setTotalPrice(finalPrice);
  }, [subtotal, discount]);

  const applyPromoCode = async () => {
    try {
      const response = await fetch(
        "https://manpowers.es/backend/api/promo.php"
      );
      const promos = await response.json();
      if (promos[promoCode]) {
        setDiscount(promos[promoCode]);
        setPromoError("");
      } else {
        setDiscount(0);
        setPromoError(t("cart.promoInvalid"));
      }
    } catch {
      setDiscount(0);
      setPromoError(t("cart.promoError"));
    }
  };

  const increment = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decrement = (id: string) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
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
      if (buyerPhone.trim() && !isValidPhone(buyerPhone)) {
        setBuyerPhoneError(t("cart.invalidPhone"));
      }
      // Validación de campos requeridos
      let hasError = false;
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
        sessionStorage.setItem("buyerPhone", buyerPhone.trim());
        sessionStorage.setItem("buyerAddress", address.trim());
        sessionStorage.setItem("buyerPostalCode", postalCode.trim());
        sessionStorage.setItem("buyerLocality", locality.trim());
        sessionStorage.setItem("buyerProvince", province.trim());
        sessionStorage.setItem("marketingOptIn", marketingOptIn ? "Sí" : "No");
        // Log del sessionStorage para depuración
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

  return (
    <div className="m-0">
      {!hideSidebar && (
        <>
          <button
            onClick={() => setOpen(true)}
            className="relative bg-black hover:bg-gray-900 text-white py-2 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center"
            aria-label={t("cart.open")}
          >
            <ShoppingCart className="h-6 w-6 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black rounded-full text-xs px-1.5 py-0.5 min-w-5 text-center ring-1 ring-black">
                {totalItems}
              </span>
            )}
          </button>

          {open && (
            <div
              className="fixed inset-0 bg-black/50 z-[90]"
              onClick={() => setOpen(false)}
            />
          )}

          <aside
            className={`fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-gradient-to-b from-gray-900 to-black text-white z-[100] shadow-2xl transform transition-transform duration-300 ${
              open ? "translate-x-0" : "translate-x-full"
            } flex flex-col`}
            aria-label={t("cart.title")}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <h2 className="text-xl font-bold">{t("cart.title")}</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label={t("cart.close")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-4 overflow-y-hidden sm:overflow-y-auto flex-1 min-h-0">
              {items.length === 0 ? (
                <p className="text-gray-300">{t("cart.empty")}</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-4 bg-gray-800/40 rounded-lg p-3"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-gray-700 flex items-center justify-center text-xs text-gray-300">
                          {t("cart.noImage")}
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{item.name}</span>
                          {item.price !== undefined ? (
                            <span className="text-white font-semibold">
                              €{parsePrice(item.price).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              {t("cart.noPrice")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-gray-700 rounded">
                            <button
                              className="px-2 py-1 hover:bg-gray-700"
                              onClick={() => decrement(item.id)}
                              aria-label={t("cart.decreaseQty")}
                            >
                              −
                            </button>
                            <span className="px-3">{item.quantity}</span>
                            <button
                              className="px-2 py-1 hover:bg-gray-700"
                              onClick={() => increment(item.id)}
                              aria-label={t("cart.increaseQty")}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="text-red-400 hover:text-red-300 text-sm"
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

            <div className="px-5 py-4 border-t border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300">{t("cart.total")}</span>
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
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-4 py-3 transition-colors"
                >
                  {totalItems > 0 ? t("cart.clear") : t("cart.close")}
                </button>
                <button
                  className={`flex-1 font-semibold rounded-lg px-4 py-3 transition-colors ${
                    totalItems > 0
                      ? "bg-white hover:bg-gray-100 text-black"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed"
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
            <div className="w-full h-screen md:max-h-[700px] sm:max-w-md md:max-w-3xl lg:max-w-4xl bg-gradient-to-b from-gray-900 to-black text-white rounded-none md:rounded-xl shadow-2xl border border-gray-700 flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                <h3 className="text-white font-semibold mb-2 text-center">
                  {t("cart.finishPurchase")}
                </h3>
                <button
                  onClick={() => {
                    setCheckoutOpen(false);
                    setCheckoutItems(null);
                    resetPaymentState();
                  }}
                  aria-label={t("cart.modal.close")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-4 flex-1 overflow-y-auto min-h-0">
                {paymentStep === "summary" && (
                  <>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700">
                      <h4 className="font-semibold mb-2 text-white">
                        {t("cart.orderSummary")}
                      </h4>
                      <div className="space-y-1 text-sm">
                        {checkoutList.map((item) => {
                          const itemPrice = parsePrice(item.price);
                          const itemTotal = itemPrice * item.quantity;
                          return (
                            <div
                              key={item.id}
                              className="flex justify-between text-gray-300"
                            >
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <span>€{itemTotal.toFixed(2)}</span>
                            </div>
                          );
                        })}
                        <div className="border-t border-gray-600 pt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t("cart.subtotal")}:</span>
                            <span>€{subtotal.toFixed(2)}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-400">
                              <span>{t("cart.discount")}:</span>
                              <span>-{discount}%</span>
                            </div>
                          )}
                          <div className="font-semibold flex justify-between text-white">
                            <span>{t("cart.total")}:</span>
                            <span>€{totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700">
                      <h4 className="font-semibold mb-2 text-white">
                        {t("cart.emailLabel")}
                      </h4>
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
                        className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      {buyerEmailError && (
                        <p className="text-red-400 text-xs mt-2">
                          {buyerEmailError}
                        </p>
                      )}
                      <div className="mt-3 space-y-2">
                        <label className="block text-sm text-gray-300">
                          {t("cart.phoneLabel")}
                        </label>
                        <input
                          type="tel"
                          value={buyerPhone}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBuyerPhone(val);
                            if (!val.trim()) {
                              setBuyerPhoneError("");
                            } else if (!isValidPhone(val)) {
                              setBuyerPhoneError(t("cart.invalidPhone"));
                            } else {
                              setBuyerPhoneError("");
                            }
                          }}
                          placeholder={t("cart.phonePlaceholder")}
                          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {buyerPhoneError && (
                          <p className="text-red-400 text-xs mt-2">
                            {buyerPhoneError}
                          </p>
                        )}
                      </div>
                      <div className="mt-3 space-y-2">
                        <label className="block text-sm text-gray-300">
                          {t("cart.addressLabel")}
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
                          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {addressError && (
                          <p className="text-red-400 text-xs">{addressError}</p>
                        )}
                        <label className="block text-sm text-gray-300">
                          {t("cart.postalCodeLabel")}
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
                          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {postalCodeError && (
                          <p className="text-red-400 text-xs">
                            {postalCodeError}
                          </p>
                        )}
                        <label className="block text-sm text-gray-300">
                          {t("cart.localityLabel")}
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
                          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {localityError && (
                          <p className="text-red-400 text-xs">
                            {localityError}
                          </p>
                        )}
                        <label className="block text-sm text-gray-300">
                          {t("cart.provinceLabel")}
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
                          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {provinceError && (
                          <p className="text-red-400 text-xs">
                            {provinceError}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-3 p-2 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-gray-600 transition-colors">
                          <input
                            id="marketingOptIn"
                            type="checkbox"
                            checked={marketingOptIn}
                            onChange={(e) =>
                              setMarketingOptIn(e.target.checked)
                            }
                            className="h-5 w-5 rounded border-gray-600 bg-gray-700 accent-yellow-500 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                          />
                          <label
                            htmlFor="marketingOptIn"
                            className="text-sm text-gray-300 cursor-pointer"
                          >
                            {t("cart.marketingOptInLabel")}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700">
                      <h4 className="font-semibold mb-2 text-white">
                        {t("cart.promoTitle")}
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder={t("cart.promoPlaceholder")}
                          aria-label={t("cart.promoAriaLabel")}
                          className="flex-1 bg-gray-700 text-white rounded-md px-3 py-2 text-sm border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-3 py-1 rounded text-sm"
                        >
                          {t("cart.apply")}
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-red-400 text-xs mt-2">
                          {promoError}
                        </p>
                      )}
                    </div>
                    {paymentError && (
                      <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
                        <p className="text-red-300 text-sm">{paymentError}</p>
                      </div>
                    )}
                  </>
                )}

                {paymentStep === "processing" && (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Procesando pago...</p>
                  </div>
                )}
              </div>

              {paymentStep === "summary" && (
                <div className="px-5 py-4 border-t border-gray-700 space-y-3">
                  <button
                    onClick={startRedirectPayment}
                    disabled={
                      checkoutTotalItems === 0 ||
                      !isValidEmail(buyerEmail) ||
                      !address.trim() ||
                      !postalCode.trim() ||
                      !locality.trim() ||
                      !province.trim()
                    }
                    className={`w-full font-semibold rounded-lg px-4 py-3 transition-all duration-200 ${
                      checkoutTotalItems > 0 &&
                      isValidEmail(buyerEmail) &&
                      address.trim() &&
                      postalCode.trim() &&
                      locality.trim() &&
                      province.trim()
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {t("cart.payWithCard")}
                  </button>
                  <button
                    onClick={() => {
                      setCheckoutOpen(false);
                      resetPaymentState();
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg px-4 py-2 transition-all duration-200 border border-gray-600"
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
