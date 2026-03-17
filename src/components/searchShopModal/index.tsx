import React, { useEffect, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  targetId?: string;
};

const COLLAPSED_KEY = "mp_search_shop_modal:collapsed";
const LEGACY_MOBILE_COLLAPSED_KEY = "mp_search_shop_modal:mobile_collapsed";

const readCollapsed = () => {
  try {
    return (
      window.localStorage.getItem(COLLAPSED_KEY) === "1" ||
      window.localStorage.getItem(LEGACY_MOBILE_COLLAPSED_KEY) === "1"
    );
  } catch {
    return false;
  }
};

const writeCollapsed = (v: boolean) => {
  try {
    window.localStorage.setItem(COLLAPSED_KEY, v ? "1" : "0");
  } catch {
    return;
  }
};

const scrollToId = (id: string) => {
  try {
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  } catch {
    return false;
  }
};

const SearchShopModal: React.FC<Props> = ({ targetId = "shops" }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [enter, setEnter] = useState(false);
  const [inTarget, setInTarget] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() =>
    typeof window === "undefined" ? false : readCollapsed(),
  );
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const onMenuToggle = (e: Event) => {
      const ce = e as CustomEvent<boolean>;
      setMenuOpen(Boolean(ce.detail));
    };
    window.addEventListener("header:menuOpen", onMenuToggle as EventListener);
    return () => {
      window.removeEventListener(
        "header:menuOpen",
        onMenuToggle as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    const handleStickyBarVisibility = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsStickyBarVisible(customEvent.detail);
    };
    window.addEventListener("sticky-bar:visibility", handleStickyBarVisibility);
    return () => {
      window.removeEventListener(
        "sticky-bar:visibility",
        handleStickyBarVisibility,
      );
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, [visible]);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) {
      setInTarget(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInTarget(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [targetId]);

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (inTarget) {
      setEnter(false);
      setVisible(false);
      return;
    }

    setEnter(false);
    setVisible(false);
    timerRef.current = window.setTimeout(() => {
      setCollapsed(false);
      setVisible(true);
    }, 2000);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [inTarget]);

  const handleClose = () => {
    writeCollapsed(true);
    setCollapsed(true);
    setEnter(true);
    setVisible(true);
  };

  const handleOpen = () => {
    try {
      window.dispatchEvent(
        new CustomEvent("shops:open", {
          detail: { targetId },
        }),
      );
    } catch {
      // ignore
    }

    scrollToId(targetId);
    setEnter(false);
    setVisible(false);
  };

  if (!visible || (isMobile && menuOpen)) return null;

  return (
    <div
      className={`fixed left-4 md:left-6 ${
        isMobile && isStickyBarVisible ? "bottom-24" : "bottom-8"
      } md:bottom-6 z-[250] transition-all duration-300 ${
        enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="hidden md:block">
        {collapsed ? (
          <div className="relative group">
            <button
              type="button"
              aria-label={t("shops.searchModal.ariaView")}
              onClick={handleOpen}
              className="h-12 w-12 rounded-full border border-black/10 bg-[var(--color-primary)] shadow-[0_12px_40px_rgba(0,0,0,0.18)] flex items-center justify-center cursor-pointer"
            >
              <MapPin className="h-5 w-5 text-[var(--color-secondary)]" />
            </button>
            <div className="pointer-events-none absolute left-full bottom-1/2 translate-y-1/2 ml-3 whitespace-nowrap rounded-lg border border-black/10 bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-black shadow-lg opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
              {t("shops.searchModal.viewButton")}
            </div>
          </div>
        ) : (
          <div className="w-[300px] rounded-2xl border border-black/10 bg-[var(--color-primary)] shadow-[0_12px_40px_rgba(0,0,0,0.18)] overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div className="text-sm font-bold text-black leading-tight">
                  {t("shops.searchModal.title")}
                </div>
              </div>
              <button
                type="button"
                aria-label={t("shops.searchModal.ariaClose")}
                onClick={handleClose}
                className="h-8 w-8 rounded-full border cursor-pointer border-black/10 bg-white/70 hover:bg-white transition-colors flex items-center justify-center text-black/70 hover:text-black"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={handleOpen}
                className="mt-2 w-full rounded-full cursor-pointer bg-[var(--color-secondary)] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.14)] hover:brightness-95 active:scale-[0.99] transition"
              >
                {t("shops.searchModal.viewButton")}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden">
        {collapsed ? (
          <button
            type="button"
            aria-label={t("shops.searchModal.ariaView")}
            onClick={handleOpen}
            className="h-12 w-12 rounded-full border border-black/10 bg-[var(--color-primary)] shadow-[0_12px_40px_rgba(0,0,0,0.18)] flex items-center justify-center"
          >
            <MapPin className="h-5 w-5 text-[var(--color-secondary)]" />
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-[var(--color-primary)] shadow-[0_12px_40px_rgba(0,0,0,0.18)] pl-2.5 pr-2 py-2">
            <button
              type="button"
              onClick={handleOpen}
              className="flex items-center gap-2 text-sm font-bold text-black"
            >
              <span className="h-8 w-8 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center">
                <MapPin className="h-4.5 w-4.5" />
              </span>
              {t("shops.sectionTitle")}
            </button>
            <button
              type="button"
              aria-label={t("shops.searchModal.ariaClose")}
              onClick={handleClose}
              className="h-8 w-8 rounded-full border border-black/10 bg-white/70 text-black/70 flex items-center justify-center"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchShopModal;
