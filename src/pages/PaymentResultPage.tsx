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

  useEffect(() => {
    // Input de reenvío eliminado; usamos el email de sessionStorage directamente
  }, [paymentSuccess]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (paymentSuccess) {
      try {
        localStorage.removeItem("cart");
      } catch {
        /* empty */
      }
    }
  }, [paymentSuccess]);

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
              t("resend.throttle", { seconds: windowSec - elapsedSec })
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
          err
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
            0
          );
          totalPrice = sum.toFixed(2);
        }
      } catch (err) {
        console.warn(
          "No se pudo calcular totalPrice desde localStorage(cart):",
          err
        );
      }
    }

    // Dirección del comprador desde sessionStorage
    let buyerAddress = "";
    let buyerPostalCode = "";
    let buyerLocality = "";
    let buyerProvince = "";
    try {
      buyerAddress = (sessionStorage.getItem("buyerAddress") || "").trim();
      buyerPostalCode = (
        sessionStorage.getItem("buyerPostalCode") || ""
      ).trim();
      buyerLocality = (sessionStorage.getItem("buyerLocality") || "").trim();
      buyerProvince = (sessionStorage.getItem("buyerProvince") || "").trim();
    } catch (err) {
      console.warn(
        "No se pudo leer dirección del comprador desde sessionStorage:",
        err
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

    const payload = {
      message: t("email.receiptMessage"),
      order_id: orderId,
      user_email: emailToSend,
      email: emailToSend,
      product_names: productListHtml,
      total_price: totalPrice,
      website_link: "https://manpowers.es",
      year: new Date().getFullYear(),
      buyer_address: buyerAddress,
      buyer_postal_code: buyerPostalCode,
      buyer_locality: buyerLocality,
      buyer_province: buyerProvince,
      buyer_address_full: buyerAddressFull,
    };

    try {
      await emailjs.send(
        "service_gu7sauk",
        "template_2d2243c",
        payload,
        "Gim0n7JTTYUJVWPuC"
      );
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
    <div className="flex flex-col min-h-screen mt-30 bg-gradient-to-b from-gray-950 to-black text-white">
      <Header />
      <main
        className={`flex-grow pt-24 md:pt-28 transition-all duration-500 ${
          enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-16">
          {paymentSuccess ? (
            <div className="bg-gray-800 border border-green-500 rounded-lg p-8 shadow-2xl text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500 mb-6">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="font-bold text-3xl mb-4 text-white">
                {t("payment.success.title")}
              </h2>
              <p className="text-gray-300 mb-6">
                {t("payment.success.description")}
              </p>

              {/* Envío automático del correo en background */}
              <AutoEmailTest />
              <p className="text-gray-400 mt-4">
                {t("payment.success.emailInfo")}
              </p>

              {/* Reenvío manual */}
              <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4 text-left inline-block w-full max-w-lg mx-auto">
                <h3 className="text-white font-semibold mb-2 text-center">
                  {t("resend.title")}
                </h3>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleManualResend}
                    disabled={resending}
                    className={`w-full px-4 py-2 rounded-md font-bold text-sm transition-all ${
                      resending
                        ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                        : "bg-yellow-500 text-black hover:bg-yellow-400"
                    }`}
                  >
                    {resending ? t("resend.loading") : t("resend.button")}
                  </button>
                  {resendMsg && (
                    <p className="text-center text-sm">{resendMsg}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 border border-red-500 rounded-lg p-8 shadow-2xl text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500 mb-6">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="font-bold text-3xl mb-4 text-white">
                {t("payment.error.title")}
              </h2>
              <p className="text-gray-300 mb-6">
                {t("payment.error.description")}
              </p>
              <div className="bg-gray-900 rounded-lg p-4 text-left inline-block max-w-full overflow-x-auto">
                {decodedMessage && (
                  <p className="text-gray-400">
                    <strong className="text-white">
                      {t("payment.error.messageLabel")}
                    </strong>{" "}
                    {decodedMessage}
                  </p>
                )}
                {displayOrderId && (
                  <p className="text-gray-400">
                    <strong className="text-white">
                      {t("payment.error.orderLabel")}
                    </strong>{" "}
                    {displayOrderId}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
            >
              {t("cta.backHome")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PaymentResultPage;
