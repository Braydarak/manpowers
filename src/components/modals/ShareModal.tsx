import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Share2, Check } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  url: string;
  productName?: string;
};

const ShareModal: React.FC<Props> = ({ open, onClose, url, productName }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => {
      setShow(false);
      setTimeout(() => onClose(), 250);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const message = productName ? `${productName} - ${url}` : url;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 250);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <div
          className={`w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl bg-gradient-to-b from-gray-900 to-black text-white transition-all duration-300 transform ${
            show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-yellow-400" />
              <h3 className="text-white font-semibold">{t('product.share')}</h3>
            </div>
            <button onClick={handleClose} className="text-gray-300 hover:text-white transition-transform duration-200 hover:scale-110">
              ✕
            </button>
          </div>
          <div className="px-5 py-5 space-y-5">
            <div className="text-sm text-gray-300 break-all bg-gray-800/40 border border-gray-700 rounded-lg p-3">
              {message}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-black font-bold py-3 px-6 rounded-lg text-center transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:scale-[1.02] active:scale-95"
              >
                {t('product.shareWhatsapp')}
              </a>
              <button
                onClick={handleCopy}
                className={`flex-1 font-semibold py-3 px-6 rounded-lg border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 ${
                  copied
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-black border-green-700'
                    : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white border-gray-600 hover:from-gray-700 hover:to-gray-600'
                }`}
              >
                {copied ? (
                  <span className="inline-flex items-center gap-2">
                    <Check className="w-5 h-5" /> {t('product.linkCopied')}
                  </span>
                ) : (
                  t('product.copyLink')
                )}
              </button>
            </div>
            {/* feedback inline eliminado para un diseño más limpio */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;