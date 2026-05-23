import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ProductPurchase from "./components/ProductPurchase.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-linen text-ink">
      <Header />
      <main>
        <Hero />
        <ProductPurchase />
      </main>
    </div>
  );
}
