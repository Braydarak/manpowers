import { useSearchParams, Link, useLocation } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import AutoEmailTest from "../components/sendEmail";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

function PaymentResultPage() {
  const [enter, setEnter] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { t } = useTranslation();

  // Determinar éxito/error:
  // - Prioridad por ruta (/pago-ok o /pago-ko)
  // - Fallback al parámetro legacy "success"
  const paymentSuccess =
    location.pathname === "/pago-ok"
      ? true
      : location.pathname === "/pago-ko"
        ? false
        : searchParams.get("success") === "true";

  const order = searchParams.get("order");
  const message = searchParams.get("message");
  const decodedMessage = message ? decodeURIComponent(message) : null;

  // Usar orderId desde sessionStorage con fallback al query param
  const displayOrderId = (() => {
    try {
      const savedOrderId = sessionStorage.getItem("orderId");
      if (savedOrderId && savedOrderId.trim() !== "")
        return savedOrderId.trim();
    } catch (err) {
      console.warn("No se pudo leer orderId de sessionStorage para UI:", err);
    }
    return order || "";
  })();

  // Estado para reenvío manual
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {}, [paymentSuccess]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (location.pathname === "/pago-ok") {
      try {
        localStorage.removeItem("cart");
      } catch {
        void 0;
      }
    }
  }, [location.pathname]);

  const handleManualResend = async () => {
    setResending(true);
    setResendMsg("");

    // Obtener email desde sessionStorage
    let emailToSend = "";
    try {
      const savedEmail = sessionStorage.getItem("buyerEmail");
      if (savedEmail) emailToSend = savedEmail.trim();
    } catch (err) {
      console.warn("No se pudo leer buyerEmail de sessionStorage:", err);
    }

    // Validar email
    if (!emailToSend || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToSend)) {
      setResendMsg(t("resend.invalidEmail"));
      setResending(false);
      return;
    }

    // Throttle: permitir un reenvío cada 2 minutos (120s)
    try {
      const lastResendAt = sessionStorage.getItem("lastResendAt");
      if (lastResendAt) {
        const last = parseInt(lastResendAt, 10);
        if (!Number.isNaN(last)) {
          const now = Date.now();
          const elapsedSec = Math.floor((now - last) / 1000);
          const windowSec = 120;
          if (elapsedSec < windowSec) {
            setResendMsg(
              t("resend.throttle", { seconds: windowSec - elapsedSec }),
            );
            setResending(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn("No se pudo validar el throttle de reenvío:", err);
    }

    // orderId: sessionStorage o query param
    let orderId = "N/A";
    try {
      const savedOrderId = sessionStorage.getItem("orderId");
      if (savedOrderId && savedOrderId.trim() !== "")
        orderId = savedOrderId.trim();
    } catch (err) {
      console.warn("No se pudo leer orderId de sessionStorage:", err);
    }
    if (orderId === "N/A" && order) orderId = order;

    // productos: sessionStorage -> fallback localStorage(cart)
    let namesArr: string[] = [];
    try {
      const savedNames = sessionStorage.getItem("productNames");
      if (savedNames && savedNames.trim() !== "") {
        namesArr = savedNames
          .split("|")
          .map((n) => n.trim())
          .filter(Boolean);
      }
    } catch (err) {
      console.warn("No se pudo leer productNames de sessionStorage:", err);
    }
    if (namesArr.length === 0) {
      try {
        const raw = localStorage.getItem("cart");
        if (raw) {
          const parsed = JSON.parse(raw) as Array<{ name: string }>;
          namesArr = parsed.map((i) => i.name);
        }
      } catch (err) {
        console.warn(
          "No se pudo derivar productos desde localStorage(cart):",
          err,
        );
      }
    }

    const productListHtml =
      namesArr.length > 0
        ? namesArr.map((n) => `<li>${n}</li>`).join("")
        : `<li>${t("email.noProducts")}</li>`;

    // totalPrice: sessionStorage -> fallback localStorage(cart)
    let totalPrice = "";
    try {
      const tp = sessionStorage.getItem("totalPrice");
      if (tp && tp.trim() !== "") totalPrice = tp.trim();
    } catch (err) {
      console.warn("No se pudo leer totalPrice de sessionStorage:", err);
    }
    if (!totalPrice) {
      try {
        const raw = localStorage.getItem("cart");
        if (raw) {
          const parsed = JSON.parse(raw) as Array<{
            price?: number;
            quantity?: number;
          }>;
          const sum = parsed.reduce(
            (acc, i) =>
              acc +
              (typeof i.price === "number" ? i.price : 0) * (i.quantity ?? 1),
            0,
          );
          totalPrice = sum.toFixed(2);
        }
      } catch (err) {
        console.warn(
          "No se pudo calcular totalPrice desde localStorage(cart):",
          err,
        );
      }
    }

    // Dirección del comprador desde sessionStorage
    let buyerFirstName = "";
    let buyerLastName = "";
    let buyerSecondLastName = "";
    let buyerAddress = "";
    let buyerPostalCode = "";
    let buyerLocality = "";
    let buyerProvince = "";
    let buyerPhone = "";
    let promoCode = "";
    let discountPercent = "";
    let marketingOptIn = "";
    try {
      buyerFirstName = (sessionStorage.getItem("buyerFirstName") || "").trim();
      buyerLastName = (sessionStorage.getItem("buyerLastName") || "").trim();
      buyerSecondLastName = (
        sessionStorage.getItem("buyerSecondLastName") || ""
      ).trim();
      buyerAddress = (sessionStorage.getItem("buyerAddress") || "").trim();
      buyerPostalCode = (
        sessionStorage.getItem("buyerPostalCode") || ""
      ).trim();
      buyerLocality = (sessionStorage.getItem("buyerLocality") || "").trim();
      buyerProvince = (sessionStorage.getItem("buyerProvince") || "").trim();
      buyerPhone = (sessionStorage.getItem("buyerPhone") || "").trim();
      promoCode = (sessionStorage.getItem("promoCode") || "").trim();
      discountPercent = (
        sessionStorage.getItem("discountPercent") || ""
      ).trim();
      marketingOptIn = (sessionStorage.getItem("marketingOptIn") || "").trim();
    } catch (err) {
      console.warn(
        "No se pudo leer dirección del comprador desde sessionStorage:",
        err,
      );
    }
    const buyerAddressFull = [
      buyerAddress,
      buyerPostalCode,
      buyerLocality,
      buyerProvince,
    ]
      .filter(Boolean)
      .join(", ");

    let cartItems: Array<{
      id?: string;
      name?: string;
      price?: number;
      image?: string;
      quantity?: number;
    }> = [];
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const parsed = JSON.parse(raw) as Array<{
          id?: string;
          name?: string;
          price?: number;
          image?: string;
          quantity?: number;
        }>;
        cartItems = parsed.filter((i) => typeof i?.name === "string" && i.name);
      }
    } catch {
      cartItems = [];
    }

    const payload = {
      message: t("email.receiptMessage"),
      order_id: orderId,
      user_email: emailToSend,
      email: emailToSend,
      product_names: productListHtml,
      total_price: totalPrice,
      website_link: "https://manpowers.es",
      year: new Date().getFullYear(),
      buyer_first_name: buyerFirstName,
      buyer_last_name: buyerLastName,
      buyer_second_last_name: buyerSecondLastName,
      buyer_address: buyerAddress,
      buyer_postal_code: buyerPostalCode,
      buyer_locality: buyerLocality,
      buyer_province: buyerProvince,
      buyer_address_full: buyerAddressFull,
      buyer_phone: buyerPhone,
      promo_code: promoCode,
      discount_percent: discountPercent,
      marketing_opt_in:
        marketingOptIn === "true"
          ? "Sí"
          : marketingOptIn === "false"
            ? "No"
            : marketingOptIn,
    };

    try {
      const emailPromise = emailjs.send(
        "service_gu7sauk",
        "template_2d2243c",
        payload,
        "Gim0n7JTTYUJVWPuC",
      );

      const savedKey = `purchaseSaved:${orderId}`;
      const savePromise = (async () => {
        try {
          if (sessionStorage.getItem(savedKey) === "1") return;
        } catch {
          void 0;
        }
        try {
          const r = await fetch("/backend/save_purchase.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, items: cartItems }),
          });
          if (!r.ok) throw new Error(`save_purchase_http_${r.status}`);
          try {
            await r.json();
          } catch {
            void 0;
          }
          try {
            sessionStorage.setItem(savedKey, "1");
          } catch {
            void 0;
          }
        } catch (e) {
          console.error("Error al guardar compra en backend:", e);
        }
      })();

      const results = await Promise.allSettled([emailPromise, savePromise]);
      const emailResult = results[0];
      if (emailResult.status !== "fulfilled") {
        throw emailResult.reason;
      }
      setResendMsg(t("resend.success"));
      try {
        sessionStorage.setItem("lastResendAt", Date.now().toString());
      } catch (err) {
        console.warn("No se pudo guardar lastResendAt en sessionStorage:", err);
      }
    } catch (error) {
      console.error("Error al reenviar el email:", error);
      setResendMsg(t("resend.fail"));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-primary)] text-black">
      <Header />
      <main
        className={`flex-grow pt-24 md:pt-28 transition-all duration-500 ${
          enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="flex flex-col items-center text-center">
            <img
              src="/MAN-BLANCO.png"
              alt="MΛN POWERS"
              className="h-10 md:h-12 invert opacity-80 drop-shadow-[0_0_4px_rgba(0,0,0,0.15)]"
            />

            {paymentSuccess ? (
              <>
                <div className="mt-8 flex items-center justify-center h-14 w-14 rounded-full border border-green-700/20 text-green-700">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="mt-6 font-extrabold text-3xl md:text-5xl tracking-tight text-black">
                  {t("payment.success.title")}
                </h2>
                <p className="mt-3 text-black/70 text-base md:text-lg max-w-2xl">
                  {t("payment.success.description")}
                </p>
              </>
            ) : (
              <>
                <div className="mt-8 flex items-center justify-center h-14 w-14 rounded-full border border-red-700/20 text-red-700">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="mt-6 font-extrabold text-3xl md:text-5xl tracking-tight text-black">
                  {t("payment.error.title")}
                </h2>
                <p className="mt-3 text-black/70 text-base md:text-lg max-w-2xl">
                  {t("payment.error.description")}
                </p>
              </>
            )}

            <div className="mt-8 w-full flex justify-center">
              <Link
                to="/"
                className="inline-flex w-full sm:w-auto items-center justify-center bg-[var(--color-secondary)] text-white font-bold py-3 px-10 rounded-lg hover:brightness-90 transition-all duration-300"
              >
                {t("cta.backHome")}
              </Link>
            </div>
          </div>

          <div className="mt-10 border-t border-black/10 pt-8 text-center">
            <div className="text-sm md:text-base text-black/70">
              {t("cta.tamdDiscover")}
            </div>
            <div className="mt-4 flex justify-center">
              <a
                href="https://www.tamdcosmetics.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center border border-black/15 bg-transparent text-black font-bold py-3 px-10 rounded-lg hover:bg-black/5 transition-all duration-300"
              >
                {t("cta.visitTamd")}
              </a>
            </div>
          </div>

          {(decodedMessage || displayOrderId) && (
            <div className="mt-10 border-t border-black/10 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {decodedMessage && (
                  <div className="text-left">
                    <div className="text-xs font-semibold text-black/60">
                      {t("payment.error.messageLabel")}
                    </div>
                    <div className="mt-2 text-sm md:text-base text-black/80 break-words">
                      {decodedMessage}
                    </div>
                  </div>
                )}
                {displayOrderId && (
                  <div className="text-left">
                    <div className="text-xs font-semibold text-black/60">
                      {t("payment.error.orderLabel")}
                    </div>
                    <code className="mt-2 inline-block text-sm md:text-base font-bold text-[var(--color-secondary)] bg-black/5 px-3 py-1.5 rounded-lg">
                      {displayOrderId}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}

          {paymentSuccess && (
            <div className="mt-10 border-t border-black/10 pt-8">
              <div className="text-center">
                <div className="text-sm md:text-base text-black/70">
                  {t("payment.success.emailInfo")}
                </div>
              </div>

              <div className="mt-6 max-w-lg mx-auto">
                <button
                  onClick={handleManualResend}
                  disabled={resending}
                  className={`w-full px-4 py-3 rounded-lg font-bold text-sm md:text-base transition-all ${
                    resending
                      ? "bg-black/10 text-black/40 cursor-not-allowed"
                      : "bg-black text-white hover:brightness-90"
                  }`}
                >
                  {resending ? t("resend.loading") : t("resend.button")}
                </button>
                {resendMsg && (
                  <div className="mt-3 text-center text-sm text-black/70">
                    {resendMsg}
                  </div>
                )}
              </div>

              <AutoEmailTest />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PaymentResultPage;
