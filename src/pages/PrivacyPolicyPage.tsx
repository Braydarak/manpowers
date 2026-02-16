import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation();
  const [enter, setEnter] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-primary)] text-black">
      <Header />
      <main
        className={`flex-grow pt-24 md:pt-28 transition-all duration-500 ${
          enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-16">
          <div className="bg-[var(--color-primary)] rounded-xl border border-black/10 shadow-[0_12px_36px_rgba(0,0,0,0.08)] p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-black">
              {t("privacy.title")}
            </h1>
            <p className="text-black/70 mb-4">{t("privacy.intro")}</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.controllerTitle")}
            </h2>
            <p className="text-black/70 mb-4">{t("privacy.controllerText")}</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.purposesTitle")}
            </h2>
            <p className="text-black/70 mb-4">{t("privacy.purposesText")}</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.legalBasisTitle")}
            </h2>
            <p className="text-black/70 mb-4">{t("privacy.legalBasisText")}</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.recipientsTitle")}
            </h2>
            <p className="text-black/70 mb-4">{t("privacy.recipientsText")}</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.rightsTitle")}
            </h2>
            <p className="text-black/70 mb-4">{t("privacy.rightsText")}</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.retentionTitle")}
            </h2>
            <p className="text-black/70 mb-4">{t("privacy.retentionText")}</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.cookiesTitle")}
            </h2>
            <p className="text-black/70 mb-4">
              {t("privacy.cookiesText")}{" "}
              <a
                href="/cookies"
                className="text-[var(--color-secondary)] underline"
              >
                {t("cookies.title")}
              </a>
              .
            </p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.dataCategoriesTitle")}
            </h2>
            <p className="text-black/70 mb-4">
              {t("privacy.dataCategoriesText")}
            </p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.securityTitle")}
            </h2>
            <p className="text-black/70 mb-4">{t("privacy.securityText")}</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.userResponsibilitiesTitle")}
            </h2>
            <p className="text-black/70 mb-4">
              {t("privacy.userResponsibilitiesText")}
            </p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.contactTitle")}
            </h2>
            <p className="text-black/70 mb-4">{t("privacy.contactText")}</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-black">
              {t("privacy.changesTitle")}
            </h2>
            <p className="text-black/70 mb-4">{t("privacy.changesText")}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
