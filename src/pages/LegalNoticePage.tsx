import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const LegalNoticePage: React.FC = () => {
  const [enter, setEnter] = useState(false);
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  type MammothOptions = { styleMap?: string[] };
  type Mammoth = {
    convertToHtml: (
      input: { arrayBuffer: ArrayBuffer },
      options?: MammothOptions
    ) => Promise<{ value: string }>;
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadMammoth = () =>
      new Promise<Mammoth>((resolve, reject) => {
        const w = window as unknown as { mammoth?: Mammoth };
        if (w.mammoth) {
          resolve(w.mammoth);
          return;
        }
        const s = document.createElement("script");
        s.src = "https://unpkg.com/mammoth@1.6.0/mammoth.browser.min.js";
        s.async = true;
        s.onload = () =>
          resolve((window as unknown as { mammoth: Mammoth }).mammoth);
        s.onerror = () => reject(new Error("mammoth-load-error"));
        document.head.appendChild(s);
      });

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const mammoth = await loadMammoth();
        const url = encodeURI("/MDM_AVISO LEGAL.docx");
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("docx-fetch-error");
        const buf = await resp.arrayBuffer();
        const result = await mammoth.convertToHtml(
          { arrayBuffer: buf },
          {
            styleMap: [
              "p[style-name='Title'] => h1:fresh",
              "p[style-name='Heading 1'] => h2:fresh",
              "p[style-name='Heading 2'] => h3:fresh",
            ],
          }
        );
        if (!cancelled) setHtml(result?.value || "");
      } catch {
        if (!cancelled)
          setError("No se pudo cargar el documento de aviso legal.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      <Header />
      <main
        className={`flex-grow pt-24 md:pt-28 transition-all duration-500 ${
          enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-16">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            Aviso Legal
          </h1>
          <div className="bg-gray-900/60 rounded-xl border border-gray-800 shadow-xl p-4 md:p-6">
            {loading && (
              <div className="py-10 text-center text-gray-300">
                Cargando documento…
              </div>
            )}
            {error && !loading && (
              <div className="py-6 text-red-400">{error}</div>
            )}
            {!loading && !error && html && (
              <>
                <style>{`
                  .docx-content { color: #d1d5db; overflow-wrap: anywhere; word-wrap: break-word; }
                  .docx-content h1 { font-size: 1.5rem; line-height: 1.75rem; font-weight: 700; margin: 0.75rem 0; color: #fff; }
                  .docx-content h2 { font-size: 1.25rem; line-height: 1.5rem; font-weight: 600; margin: 0.75rem 0; color: #fff; }
                  .docx-content h3 { font-size: 1.125rem; line-height: 1.5rem; font-weight: 600; margin: 0.5rem 0; color: #fff; }
                  .docx-content p { margin-bottom: 0.75rem; }
                  .docx-content ul, .docx-content ol { margin: 0.75rem 0 1rem 1.25rem; }
                  .docx-content a { color: #60a5fa; text-decoration: underline; }
                  .docx-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; display: block; overflow-x: auto; max-width: 100%; }
                  .docx-content th, .docx-content td { border: 1px solid #374151; padding: 0.5rem; color: #d1d5db; white-space: nowrap; }
                  @media (min-width: 768px) {
                    .docx-content h1 { font-size: 1.75rem; line-height: 2rem; margin: 1rem 0; }
                    .docx-content h2 { font-size: 1.5rem; line-height: 1.75rem; margin: 1rem 0; }
                    .docx-content h3 { font-size: 1.25rem; line-height: 1.5rem; margin: 0.75rem 0; }
                    .docx-content th, .docx-content td { white-space: normal; }
                  }
                `}</style>
                <div
                  className="docx-content"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalNoticePage;
