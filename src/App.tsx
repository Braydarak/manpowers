import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SportsPage from "./pages/SportsPage";
import ProductsPage from "./pages/ProductsPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import CookieConsent from "./components/cookieConsent";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiesPolicyPage from "./pages/CookiesPolicyPage";

function App() {
  return (
    <Router>
      <CookieConsent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sports" element={<SportsPage />} />
        <Route path="/products/:sportId" element={<ProductsPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/pago-ok" element={<PaymentResultPage />} />
        <Route path="/pago-ko" element={<PaymentResultPage />} />
        <Route path="/privacidad" element={<PrivacyPolicyPage />} />
        <Route path="/cookies" element={<CookiesPolicyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
