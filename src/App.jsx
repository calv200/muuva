import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import GuidedRoutinesSection from "./components/GuidedRoutinesSection.jsx";
import LifestyleCarouselSection from "./components/LifestyleCarouselSection.jsx";
import ProductPurchase from "./components/ProductPurchase.jsx";
import Footer from "./components/Footer.jsx";
import GuidedRoutineDetailPage from "./pages/GuidedRoutineDetailPage.jsx";
import GuidedRoutinesPage from "./pages/GuidedRoutinesPage.jsx";

function getRoute() {
  const hash = window.location.hash || "#/";
  if (!hash.startsWith("#/")) {
    return { page: "home", scrollTarget: hash.replace("#", "") };
  }

  const [path, queryString = ""] = hash.slice(1).split("?");
  const params = new URLSearchParams(queryString);
  const parts = path.split("/").filter(Boolean);

  if (parts[0] === "guided-routines" && parts[1]) {
    return {
      page: "routine-detail",
      slug: parts[1],
      returnFilter: params.get("filter") || "",
    };
  }

  if (parts[0] === "guided-routines") {
    return {
      page: "guided-routines",
      filter: params.get("filter") || "",
    };
  }

  return { page: "home" };
}

function HomePage() {
  return (
    <main>
      <Hero />
      <ProductPurchase />
      <GuidedRoutinesSection />
      <LifestyleCarouselSection />
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!route.scrollTarget) return;

    window.requestAnimationFrame(() => {
      document.getElementById(route.scrollTarget)?.scrollIntoView();
    });
  }, [route]);

  const renderPage = () => {
    if (route.page === "guided-routines") {
      return <GuidedRoutinesPage initialFilter={route.filter} />;
    }

    if (route.page === "routine-detail") {
      return (
        <GuidedRoutineDetailPage
          slug={route.slug}
          returnFilter={route.returnFilter}
        />
      );
    }

    return <HomePage />;
  };

  return (
    <div className="min-h-screen bg-linen text-ink">
      <Header />
      {renderPage()}
      <Footer />
    </div>
  );
}
