import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const ChatWidget: React.FC = () => {
  const { i18n } = useTranslation();
  const baseLang = i18n.resolvedLanguage?.split("-")[0] || i18n.language?.split("-")[0] || "es";
  const lang: "es" | "en" | "ca" = baseLang === "en" ? "en" : baseLang === "ca" ? "ca" : "es";
  const [open, setOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ id: string; text: string; from: "user" | "agent"; at: number; kind?: "welcome"; lang?: "es" | "en" | "ca" }[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const labels = useMemo(() => {
    return {
      title: lang === "es" ? "Chat" : lang === "ca" ? "Xat" : "Chat",
      placeholder: lang === "es" ? "Escribe un mensaje" : lang === "ca" ? "Escriu un missatge" : "Type a message",
      send: lang === "es" ? "Enviar" : lang === "ca" ? "Enviar" : "Send",
      welcome:
        lang === "es"
          ? "Hola 👋 Bienvenido/a a MΛN POWERS, estoy aquí para ayudarte con cualquier pregunta que tengas sobre nosotros o los productos. Pregúntame lo que quieras."
          : lang === "ca"
          ? "Hola 👋 Benvingut/da a MΛN POWERS, estic aquí per ajudar-te amb qualsevol pregunta que tinguis sobre nosaltres o els productes. Pregunta'm el que vulguis."
          : "Hi 👋 Welcome to MΛN POWERS, I'm here to help you with any questions you have about us or our products. Ask me anything.",
    };
  }, [lang]);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("chat:messages");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {
      // Silently ignore localStorage read errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("chat:messages", JSON.stringify(messages));
    } catch {
      // Silently ignore localStorage write errors
    }
  }, [messages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(id);
    }
    setAnimateIn(false);
  }, [open]);

  useEffect(() => {
    if ((open || animatingOut) && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open, animatingOut, isMobile]);

  const handleToggle = () => {
    if (open) {
      setAnimateIn(false);
      setAnimatingOut(true);
      setOpen(false);
      setTimeout(() => {
        setAnimatingOut(false);
      }, 300);
      return;
    }
    setOpen(true);
    const idx = messages.findIndex((m) => m.kind === "welcome");
    if (idx >= 0) {
      const current = messages[idx];
      if (current.text !== labels.welcome || current.lang !== lang) {
        setMessages((m) => {
          const copy = [...m];
          copy[idx] = { ...copy[idx], text: labels.welcome, lang };
          return copy;
        });
      }
    } else {
      const msg = { id: "welcome", text: labels.welcome, from: "agent" as const, at: Date.now(), kind: "welcome" as const, lang };
      setMessages((m) => [...m, msg]);
    }
  };
  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const msg = { id: String(Date.now()), text, from: "user" as const, at: Date.now() };
    setMessages((m) => [...m, msg]);
    setInput("");
    window.dispatchEvent(new CustomEvent("chat:message", { detail: msg }));
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9]">
      {!open && !animatingOut && (
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-2 bg-yellow-500 text-black font-bold px-4 py-2 rounded-full shadow-xl hover:bg-yellow-400 transition-transform duration-300 hover:scale-105"
          aria-label={labels.title}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M2 5a3 3 0 013-3h14a3 3 0 013 3v10a3 3 0 01-3 3H9l-5 4v-4H5a3 3 0 01-3-3V5z" />
          </svg>
          {labels.title}
        </button>
      )}
      {(open || animatingOut) && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-[9998]"
            onClick={handleToggle}
          />
          <div
            className={`fixed bottom-0 right-0 md:bottom-4 md:right-4 transform transition-all duration-300 ease-out z-[9999] ${
              isMobile ? (animateIn ? "translate-y-0 opacity-100" : "translate-y-full opacity-0") : (animateIn ? "opacity-100" : "opacity-0 translate-y-2")
            }`}
            style={{
              willChange: "transform, opacity",
            }}
          >
            <div className="w-screen h-screen md:w-[460px] md:h-[620px] bg-black text-white border border-gray-800 rounded-none md:rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 bg-gray-900">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                    <path d="M2 5a3 3 0 013-3h14a3 3 0 013 3v10a3 3 0 01-3 3H9l-5 4v-4H5a3 3 0 01-3-3V5z" />
                  </svg>
                  <span className="font-semibold">{labels.title}</span>
                </div>
                <button type="button" onClick={handleToggle} className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M6.225 4.811l12.964 12.964-1.414 1.414L4.811 6.225l1.414-1.414z" />
                    <path d="M19.189 4.811L6.225 17.775l-1.414-1.414L17.775 4.811l1.414 1.414z" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col h-[calc(100%-3.5rem)]">
                <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-950">
                  {messages.map((m) => (
                    <div key={m.id} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                      <div className={m.from === "user" ? "bg-yellow-500 text-black px-4 py-2 rounded-2xl max-w-[80%] shadow-lg" : "bg-gray-800 text-white px-4 py-2 rounded-2xl max-w-[80%] shadow-lg"}>
                        <span className="text-sm">{m.text}</span>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-10">{labels.title}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-900 border-t border-gray-800">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                    placeholder={labels.placeholder}
                    className="flex-1 bg-black text-white border border-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    className="bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 active:scale-95 transition-transform"
                  >
                    {labels.send}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWidget;