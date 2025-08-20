import "./App.css";
import Hero from "./sections/hero";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import AboutUs from "./sections/aboutUs";
import Products from "./sections/products";

function App() {
  return (
    <div className="">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AboutUs />
        <Products />
      </main>
      <Footer />
    </div>
  );
}

export default App;
