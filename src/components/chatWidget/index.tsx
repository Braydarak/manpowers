import React, { useMemo, useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { sendChat, type ChatMessage } from "../../services/chat";
import productsService, { type Product } from "../../services/productsService";
import { useTranslation } from "react-i18next";
import gsap from "gsap";

type ProductJson = {
  id: number;
  name: { es: string; en: string; ca?: string };
  description: { es: string; en: string; ca?: string };
  objectives?: { es: string[]; en: string[]; ca?: string[] };
  price: string | number;
  price_formatted?: string;
  size: string;
  image: string;
  category: { es: string; en: string; ca?: string } | string;
  sportId: string;
  available: boolean;
  sku?: string;
  amazonLinks?: { [key: string]: string };
  nutritionalValues?: { es: string; en: string; ca?: string };
  application?: { es: string; en: string; ca?: string };
  recommendations?: { es: string; en: string; ca?: string };
  rating?: number;
  votes?: number;
};

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { t, i18n } = useTranslation();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const [showHint, setShowHint] = useState(false);
  const intervalRef = useRef<number | undefined>(undefined);
  const hideTimeoutRef = useRef<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.25, ease: "power2.out" },
      );
    }
  }, [open]);

  useEffect(() => {
    if (open && messages.length === 0) {
      const intro = t("chat.intro");
      setTimeout(() => {
        setMessages([{ role: "assistant", content: intro }]);
      }, 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i18n.language]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!open && !isMobile) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setShowHint(true);
        if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = window.setTimeout(
          () => setShowHint(false),
          25000,
        );
      }, 15000);
    } else {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
      setShowHint(false);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    };
  }, [open, isMobile]);

  useEffect(() => {
    if (showHint && hintRef.current) {
      gsap.fromTo(
        hintRef.current,
        { y: 10, autoAlpha: 0, scale: 0.95 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.25, ease: "power2.out" },
      );
    }
  }, [showHint]);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!open) return;
      const target = e.target as Node | null;
      if (panelRef.current && target && !panelRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading, open]);

  const baseLang =
    i18n.resolvedLanguage?.split("-")[0] ||
    i18n.language?.split("-")[0] ||
    "es";
  const currentLanguage: "es" | "en" | "ca" =
    baseLang === "en" ? "en" : baseLang === "ca" ? "ca" : "es";

  useEffect(() => {
    const lock = open && isMobile;
    const html = document.documentElement;
    const body = document.body;
    if (lock) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.touchAction = "";
    }
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [open, isMobile]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const items = await productsService.getProducts();
        if (mounted) setProducts(items);
      } catch {
        try {
          const r = await fetch("/products.json");
          const data = await r.json();
          const arr = ((data.products || []) as ProductJson[]).map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            objectives: p.objectives,
            price:
              typeof p.price === "string"
                ? parseFloat(p.price.replace(",", "."))
                : p.price,
            price_formatted: p.price_formatted ?? "",
            size: p.size,
            image: p.image,
            category:
              typeof p.category === "string"
                ? { es: p.category, en: p.category }
                : p.category,
            sportId: p.sportId,
            available: p.available,
            sku: p.sku ?? "",
            amazonLinks: p.amazonLinks,
            nutritionalValues: p.nutritionalValues,
            application: p.application,
            recommendations: p.recommendations,
            rating: p.rating,
            votes: p.votes,
          })) as Product[];
          if (mounted) setProducts(arr);
        } catch {
          if (mounted) setProducts([]);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");

  const context = useMemo(() => {
    const phone = t("phone", { defaultValue: "670 372 239" }) as string;
    const email = t("email", { defaultValue: "info@manpowers.es" }) as string;
    const policy = [
      `Información de contacto: teléfono ${phone}, email ${email}`,
      'Responde solo sobre esta web y sus productos, decile al usuario que no podes responderle y sugiere: "Ver productos por deporte" (LINK:/sports), "Número de contacto" o que podes ayudarlo a elegir el producto que necesita.',
      "Si mencionas un producto concreto siempre añade al final una línea con el formato 'LINK:/products/{sportId}/{slug}' para abrir su ficha.",
      "Si preguntan por necesidades como energía, vigor, agarre, hidratación o recuperación, recomienda productos adecuados del listado.",
      "Si te preguntan disponibilidad, usa el campo 'available' del producto.",
      "Si te preguntan precio, usa 'price_formatted' si está disponible; si no, 'price'.",
      "Devoluciones en 14 días naturales. Para las devoluciones ponerse en contacto con info@manpowers.es.",
      "Realizamos envios atraves de Tipsa a toda España",
      "El sistema de pago esta implementado a traves del sistema de redsys, explica el porque es seguro si lo preguntan",
      "Si te preguntan sobre aviso legal, politica de cookies, politica de privacidad los links son los siguientes: https://manpowers.es/aviso-legal, https://manpowers.es/cookies, https://manpowers.es/privacidad",
    ].join(" \n");

    if (!products || products.length === 0) return policy;

    const max = 30;
    const lines = products.slice(0, max).map((p) => {
      const name = p.name?.[currentLanguage] || p.name?.es || "";
      const category =
        typeof p.category === "string"
          ? p.category
          : p.category?.[currentLanguage] || p.category?.es || "";
      const slug = toSlug(name);
      const parts = [
        `${p.sportId}/${slug}`,
        name,
        category,
        p.price_formatted ||
          (Number(p.price) ? `€ ${Number(p.price).toFixed(2)}` : ""),
        p.size || "",
        p.available ? "Disponible" : "No disponible",
      ].filter(Boolean);
      return parts.join(" | ");
    });
    return policy + `\nListado de productos (max ${max}):\n` + lines.join("\n");
  }, [products, t, currentLanguage]);

  const getLinksFromReply = (text: string): string[] => {
    const matches = Array.from(text.matchAll(/LINK:\s*(\/[\S]+)/gi));
    return matches.map((m) => m[1]);
  };

  const stripLinkDirectives = (text: string): string => {
    return text.replace(/LINK:\s*\/[\S]+/gi, "").replace(/\n\s*\n/g, "\n");
  };

  const renderAssistantContent = (text: string) => {
    const clean = stripLinkDirectives(text);
    const regex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(clean)) !== null) {
      const start = m.index;
      if (start > lastIndex) nodes.push(clean.slice(lastIndex, start));
      const url = m[0];
      const raw = url.replace(/[),.;:]+$/g, "");
      const initialHref = raw.startsWith("www.") ? `https://${raw}` : raw;
      let href = initialHref;
      try {
        const u = new URL(initialHref);
        if (u.hostname.endsWith("manpowers.es")) {
          const path = u.pathname.replace(/\.+$/g, "");
          href = `${u.origin}${path}`;
        }
      } catch {
        href = initialHref;
      }
      nodes.push(
        <a
          key={`u-${start}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-secondary)] underline break-all"
        >
          {href}
        </a>,
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < clean.length) nodes.push(clean.slice(lastIndex));
    return nodes;
  };

  const toggle = () => setOpen((v) => !v);

  const showHintForAWhile = () => {
    if (isMobile) return;
    setShowHint(true);
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => setShowHint(false), 5000);
  };

  const onSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const userMsg: ChatMessage = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await sendChat(next, context, i18n.language);
      const assistantMsg: ChatMessage = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError("No se pudo enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  if (!open)
    return (
      <div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        onMouseEnter={showHintForAWhile}
      >
        {showHint && (
          <div
            ref={hintRef}
            className="hidden md:block bg-[var(--color-primary)] border border-black/10 text-black px-3 py-2 rounded-lg shadow-lg pointer-events-none"
          >
            {t("chat.hint", "¿Necesitas ayuda?")}
          </div>
        )}
        <button
          onClick={toggle}
          aria-label="Abrir chat"
          className="bg-[var(--color-secondary)] text-white p-5 rounded-full shadow-xl transition-transform hover:scale-105 cursor-pointer hover:brightness-90"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      </div>
    );

  return (
    <div
      ref={panelRef}
      className="fixed bottom-0 left-0 right-0 md:bottom-4 md:right-2 md:left-auto z-[300] w-screen md:w-[480px] md:max-w-lg h-full md:h-[40vh] bg-[var(--color-primary)] border border-black/10 rounded-t-xl md:rounded-xl shadow-2xl flex flex-col backdrop-blur"
    >
      <div className="flex items-center justify-between p-3 border-b border-black/10 rounded-t-xl bg-[var(--color-primary)] text-black">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[var(--color-secondary)]" />
          <span className="font-semibold">Chat</span>
        </div>
        <button
          onClick={toggle}
          aria-label="Cerrar"
          className="p-1 cursor-pointer text-black/60 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={listRef}
        className="p-3 flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-3 chat-scroll"
      >
        {messages.length === 0 && (
          <div className="text-sm text-black/60">
            Escribe tu pregunta sobre la web o los productos.
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={
                m.role === "user"
                  ? "bg-[var(--color-secondary)] text-white px-3 py-2 rounded-lg max-w-[85%] shadow-sm transition-transform"
                  : "bg-[var(--color-primary)] text-black px-3 py-2 rounded-lg max-w-[85%] shadow-sm transition-transform border border-black/10"
              }
            >
              {m.role === "assistant"
                ? renderAssistantContent(m.content)
                : m.content}
              {m.role === "assistant" &&
                getLinksFromReply(m.content).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getLinksFromReply(m.content).map((href, k) => (
                      <a
                        key={k}
                        href={href}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-secondary)] text-white hover:brightness-90 text-sm"
                      >
                        {href.startsWith("/products/")
                          ? t("product.viewDetails", "Ver producto")
                          : t("contact", "Contactar")}
                      </a>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--color-primary)] text-black px-3 py-2 rounded-lg max-w-[85%] shadow-sm border border-black/10">
              <div className="flex items-center gap-1">
                <span
                  className="w-2 h-2 bg-black/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-black/40 rounded-full animate-bounce"
                  style={{ animationDelay: "100ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-black/40 rounded-full animate-bounce"
                  style={{ animationDelay: "200ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}
        {error && <div className="text-red-500 text-xs">{error}</div>}
      </div>

      <div className="p-3 border-t border-black/10 flex items-center gap-2 bg-[var(--color-primary)]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
          placeholder="Escribe tu mensaje"
          className="flex-1 bg-[var(--color-primary)] border border-black/15 rounded-full text-black px-4 py-2 focus:outline-none placeholder:text-black/40"
        />
        <button
          onClick={onSend}
          disabled={loading}
          className="px-3 py-2 rounded-full bg-[var(--color-secondary)] text-white hover:brightness-90 disabled:opacity-50 active:scale-[0.98]"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
