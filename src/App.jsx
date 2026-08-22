import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import GuidedRoutinesSection from "./components/GuidedRoutinesSection.jsx";
import LifestyleCarouselSection from "./components/LifestyleCarouselSection.jsx";
import ProductPurchase from "./components/ProductPurchase.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-linen text-ink">
      <Header />
      <main>
        <Hero />
        <ProductPurchase />
        <GuidedRoutinesSection />
        <LifestyleCarouselSection />
      </main>
      <Footer />
    </div>
  );
}
