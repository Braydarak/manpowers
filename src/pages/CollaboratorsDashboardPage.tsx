import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type Session = {
  user: {
    username?: string | null;
    email?: string | null;
    name?: string | null;
    role?: string | null;
    discount_code?: string | null;
  };
  token?: string | null;
  remember?: boolean;
  ts?: number;
};

const CollaboratorsDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<{
    orders: number;
    sales: number;
    units: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const session: Session | null = useMemo(() => {
    try {
      const ls = localStorage.getItem("collab_session");
      const ss = sessionStorage.getItem("collab_session");
      return ls ? JSON.parse(ls) : ss ? JSON.parse(ss) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) {
      navigate("/colaboradores");
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/backend/colaboradores_stats.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discount_code: session.user.discount_code || "",
          }),
        });
        const json = await res.json();
        if (!res.ok || !json?.ok)
          throw new Error(json?.error || "stats_failed");
        setStats(json.data);
      } catch {
        setError("");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate, session, t]);

  const name = session?.user?.name || "";
  const code = session?.user?.discount_code || "";

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-primary)] text-black">
      <Header />
      <main className="flex-grow pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold mb-2">
            {t("collabDashboard.hello")} {name}
          </h1>
          <p className="text-black/70 mb-8">{t("collabDashboard.subtitle")}</p>

          <div className="bg-[var(--color-primary)] border border-black/10 rounded-xl p-6 mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <span className="text-black/60 text-sm block mb-1">
              {t("collabDashboard.yourCode")}
            </span>
            <div className="flex items-center gap-3">
              <code className="text-[var(--color-secondary)] text-xl bg-black/5 px-3 py-1 rounded">
                {code || t("collabDashboard.noCode")}
              </code>
              {code && (
                <button
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="text-sm text-[var(--color-secondary)] hover:brightness-90"
                >
                  {t("collabDashboard.copy")}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--color-primary)] border border-black/10 rounded-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <div className="text-sm text-black/60">
                {t("collabDashboard.orders")}
              </div>
              <div className="text-3xl font-bold text-black">
                {loading ? "—" : (stats?.orders ?? 0)}
              </div>
            </div>
            <div className="bg-[var(--color-primary)] border border-black/10 rounded-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <div className="text-sm text-black/60">
                {t("collabDashboard.units")}
              </div>
              <div className="text-3xl font-bold text-black">
                {loading ? "—" : (stats?.units ?? 0)}
              </div>
            </div>
            <div className="bg-[var(--color-primary)] border border-black/10 rounded-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <div className="text-sm text-black/60">
                {t("collabDashboard.sales")}
              </div>
              <div className="text-3xl font-bold text-[var(--color-secondary)]">
                {loading ? "—" : `€ ${(stats?.sales ?? 0).toFixed(2)}`}
              </div>
            </div>
          </div>

          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollaboratorsDashboardPage;
