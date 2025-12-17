import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";

const AutoEmailSender = () => {
  const location = useLocation();
  const hasSentRef = useRef(false);

  useEffect(() => {
    // Solo enviar en /pago-ok
    if (location.pathname !== "/pago-ok") return;
    // Evitar dobles envíos en dev/StrictMode
    if (hasSentRef.current) return;

    // Dump de sessionStorage para depuración
    try {
      const dump: Record<string, string | null> = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k) dump[k] = sessionStorage.getItem(k);
      }
      console.log('[sessionStorage dump en /pago-ok] ', dump);
    } catch (err) {
      console.warn("No se pudo leer sessionStorage:", err);
    }

    // Email desde sessionStorage
    let email = "";
    try {
      const savedEmail = sessionStorage.getItem("buyerEmail");
      if (savedEmail) email = savedEmail.trim();
    } catch (error) {
      console.warn("No se pudo acceder al sessionStorage (buyerEmail):", error);
    }
    if (!email) {
      console.warn("No hay email en sessionStorage (buyerEmail). Se aborta envío.");
      return;
    }

    // orderId: sessionStorage o query param ?order=
    let orderId = "N/A";
    try {
      const savedOrderId = sessionStorage.getItem("orderId");
      if (savedOrderId && savedOrderId.trim() !== "") orderId = savedOrderId.trim();
    } catch (error) {
      console.warn("No se pudo acceder al sessionStorage (orderId):", error);
    }
    if (orderId === "N/A") {
      const params = new URLSearchParams(location.search);
      const qOrder = params.get("order");
      if (qOrder) orderId = qOrder;
    }

    // Nombres de productos: sessionStorage -> fallback localStorage(cart)
    let namesArr: string[] = [];
    try {
      const savedNames = sessionStorage.getItem("productNames");
      if (savedNames && savedNames.trim() !== "") {
        namesArr = savedNames.split("|").map((n) => n.trim()).filter(Boolean);
      }
    } catch (error) {
      console.warn("No se pudo acceder al sessionStorage (productNames):", error);
    }
    if (namesArr.length === 0) {
      try {
        const raw = localStorage.getItem("cart");
        if (raw) {
          const parsed = JSON.parse(raw) as Array<{ name: string }>;
          namesArr = parsed.map((i) => i.name);
        }
      } catch (err) {
        console.warn("No se pudo derivar productos desde localStorage(cart):", err);
      }
    }

    // Lista HTML para {{{product_names}}}
    const productListHtml =
      namesArr.length > 0
        ? namesArr.map((n) => `<li>${n}</li>`).join("")
        : "<li>Sin productos</li>";

    // Leer totalPrice desde sessionStorage o calcular desde localStorage(cart)
    let totalPrice = "";
    try {
      const tp = sessionStorage.getItem("totalPrice");
      if (tp && tp.trim() !== "") totalPrice = tp.trim();
    } catch (error) {
      console.warn("No se pudo acceder al sessionStorage (totalPrice):", error);
    }
    if (!totalPrice) {
      try {
        const raw = localStorage.getItem("cart");
        if (raw) {
          const parsed = JSON.parse(raw) as Array<{ price?: number; quantity?: number }>;
          const sum = parsed.reduce((acc, i) => acc + (typeof i.price === "number" ? i.price : 0) * (i.quantity ?? 1), 0);
          totalPrice = sum.toFixed(2);
        }
      } catch (err) {
        console.warn("No se pudo calcular totalPrice desde localStorage(cart):", err);
      }
    }

    // Dirección del comprador desde sessionStorage
    let buyerAddress = "";
    let buyerPostalCode = "";
    let buyerLocality = "";
    let buyerProvince = "";
    let buyerPhone = "";
    let marketingOptIn = "";
    try {
      buyerAddress = (sessionStorage.getItem("buyerAddress") || "").trim();
      buyerPostalCode = (sessionStorage.getItem("buyerPostalCode") || "").trim();
      buyerLocality = (sessionStorage.getItem("buyerLocality") || "").trim();
      buyerProvince = (sessionStorage.getItem("buyerProvince") || "").trim();
      buyerPhone = (sessionStorage.getItem("buyerPhone") || "").trim();
      marketingOptIn = (sessionStorage.getItem("marketingOptIn") || "").trim();
    } catch (err) {
      console.warn("No se pudo leer dirección del comprador desde sessionStorage:", err);
    }
    const buyerAddressFull = [buyerAddress, buyerPostalCode, buyerLocality, buyerProvince]
      .filter(Boolean)
      .join(", ");

    // Debug: mostrar datos clave y payload
    const payload = {
      message: "Gracias por tu compra. Aquí tienes el comprobante.",
      order_id: orderId,
      user_email: email,
      email: email,
      product_names: productListHtml,
      total_price: totalPrice,
      website_link: "https://manpowers.es",
      year: new Date().getFullYear(),
      buyer_address: buyerAddress,
      buyer_postal_code: buyerPostalCode,
      buyer_locality: buyerLocality,
      buyer_province: buyerProvince,
      buyer_address_full: buyerAddressFull,
      buyer_phone: buyerPhone,
      marketing_opt_in: marketingOptIn === "true" ? "Sí" : marketingOptIn === "false" ? "No" : marketingOptIn,
    };

    // Flag para evitar duplicar por pedido
    const sentKey = `emailSent:${orderId}`;
    try {
      if (sessionStorage.getItem(sentKey) === "1") {
        hasSentRef.current = true;
        return;
      }
    } catch (error) {
      console.warn("No se pudo leer flag de envío en sessionStorage:", error);
    }

    // Envío con EmailJS usando el template acordado
    emailjs
      .send(
        "service_gu7sauk",
        "template_2d2243c",
        payload,
        "Gim0n7JTTYUJVWPuC"
      )
      .then(() => {
        try {
          sessionStorage.setItem(sentKey, "1");
        } catch (error) {
          console.warn("No se pudo escribir flag de envío en sessionStorage:", error);
        }
        hasSentRef.current = true;
      })
      .catch((error) => {
        console.error("Error al enviar el email:", error);
      });
  }, [location.pathname, location.search]);

  // Sin UI
  return null;
};

export default AutoEmailSender;
export { AutoEmailSender };