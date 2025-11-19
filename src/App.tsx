import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SportsPage from "./pages/SportsPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import CookieConsent from "./components/cookieConsent";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiesPolicyPage from "./pages/CookiesPolicyPage";
import CollaboratorsLoginPage from "./pages/CollaboratorsLoginPage";
import CollaboratorsDashboardPage from "./pages/CollaboratorsDashboardPage";

function App() {
  return (
    <Router>
      <CookieConsent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sports" element={<SportsPage />} />
        <Route path="/products/:sportId" element={<ProductsPage />} />
        <Route path="/products/:sportId/:slug" element={<ProductDetailPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/products/:sportId/:id" element={<ProductDetailPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/pago-ok" element={<PaymentResultPage />} />
        <Route path="/pago-ko" element={<PaymentResultPage />} />
        <Route path="/privacidad" element={<PrivacyPolicyPage />} />
        <Route path="/cookies" element={<CookiesPolicyPage />} />
        <Route path="/colaboradores" element={<CollaboratorsLoginPage />} />
        <Route path="/colaboradores/panel" element={<CollaboratorsDashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
