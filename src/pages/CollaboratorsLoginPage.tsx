import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CollaboratorsLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [enter, setEnter] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!username) {
      setError(t("collabLogin.errorMissing"));
      return;
    }
    if (!password) {
      setError(t("collabLogin.errorMissing"));
      return;
    }
    try {
      setLoading(true);
      let list: Array<{
        username: string;
        password: string;
        name?: string;
        discount_code?: string;
        discount?: number;
      }> = [];
      try {
        const r1 = await fetch("/backend/collaborators.php", {
          cache: "no-store",
        });
        if (r1.ok) {
          const j1 = await r1.json();
          list = Array.isArray(j1?.users)
            ? j1.users
            : Array.isArray(j1)
              ? j1
              : [];
        }
      } catch {
        void 0;
      }
      if (!list.length) {
        const r2 = await fetch("/collaborators.json", { cache: "no-store" });
        if (!r2.ok) throw new Error("fetch_failed");
        const j2 = await r2.json();
        list = Array.isArray(j2?.users)
          ? j2.users
          : Array.isArray(j2)
            ? j2
            : [];
      }
      const uname = username.trim().toLowerCase();
      const user = list.find(
        (u) => (u.username || "").trim().toLowerCase() === uname,
      );
      if (!user) {
        setError(t("collabLogin.errorInvalid"));
        return;
      }
      if (String(user.password) !== String(password)) {
        setError(t("collabLogin.errorInvalid"));
        return;
      }
      const session = {
        user: {
          username: user.username,
          name: user.name || user.username,
          discount_code: user.discount_code || null,
          discount: user.discount ?? null,
        },
        token: null,
        remember: false,
        ts: Date.now(),
      };
      try {
        sessionStorage.setItem("collab_session", JSON.stringify(session));
      } catch {
        void 0;
      }
      setSuccess(true);
      navigate("/colaboradores/panel");
    } catch {
      setError(t("collabLogin.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-primary)] text-black">
      <Header />
      <main
        className={`flex-grow pt-24 md:pt-28 transition-all duration-500 ${enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="max-w-md mx-auto px-4 md:px-6 lg:px-8 py-14">
          <h1 className="text-3xl font-bold mb-2">{t("collabLogin.title")}</h1>
          <p className="text-black/70 mb-8">{t("collabLogin.subtitle")}</p>
          <form
            onSubmit={onSubmit}
            className="bg-[var(--color-primary)] border border-black/10 rounded-xl p-6 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm text-black/80 mb-1"
              >
                {t("collabLogin.username")}
              </label>
              <input
                id="username"
                type="text"
                className="w-full bg-white border border-black/20 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-[var(--color-secondary)]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-black/80 mb-1"
              >
                {t("collabLogin.password")}
              </label>
              <input
                id="password"
                type="password"
                className="w-full bg-white border border-black/20 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-[var(--color-secondary)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm">
                {t("collabLogin.success")}
              </p>
            )}
            <button
              disabled={loading}
              type="submit"
              className={`w-full bg-[var(--color-secondary)] text-white font-bold py-2.5 rounded-lg transition-all ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:brightness-90"
              }`}
            >
              {loading ? "..." : t("collabLogin.signIn")}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollaboratorsLoginPage;
