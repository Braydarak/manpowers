import "./App.css";
import Hero from "./sections/hero";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import AboutUs from "./sections/aboutUs";
import Products from "./sections/products";
import Locations from "./sections/locations";
import useLanguageUpdater from "./hooks/useLanguageUpdater";

function App() {
  // Hook para actualizar idioma y título dinámicamente
  useLanguageUpdater();

  return (
    <div className="">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AboutUs />
        <Products />
        <Locations />
      </main>
      <Footer />
    </div>
  );
}

export default App;
