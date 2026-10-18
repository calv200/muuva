import { useEffect, useState } from "react";
import { handleInternalLink, navigationEvent, synchronizeLocation } from "./routing/navigation.js";
import { parseLocation } from "./routing/urls.js";
import { RouteContext } from "./routing/RouteContext.jsx";
import SeoMetadata from "./seo/SeoMetadata.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import GuidedRoutinesSection from "./components/GuidedRoutinesSection.jsx";
import LifestyleCarouselSection from "./components/LifestyleCarouselSection.jsx";
import ProductPurchase from "./components/ProductPurchase.jsx";
import Footer from "./components/Footer.jsx";
import GuidedRoutineDetailPage from "./pages/GuidedRoutineDetailPage.jsx";
import GuidedRoutinesPage from "./pages/GuidedRoutinesPage.jsx";

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

export default function App({ initialRoute }) {
  const [route, setRoute] = useState(() => initialRoute ?? parseLocation(window.location));

  useEffect(() => {
    const updateRoute = () => setRoute(synchronizeLocation());
    const events = ["popstate", "hashchange", navigationEvent];
    events.forEach((event) => window.addEventListener(event, updateRoute));
    // Apply request queries/anchors after hydration of the canonical static page.
    updateRoute();
    return () => events.forEach((event) => window.removeEventListener(event, updateRoute));
  }, []);

  useEffect(() => {
    if (route.hash) {
      const frame = window.requestAnimationFrame(() => {
        document.getElementById(route.hash.slice(1))?.scrollIntoView();
      });
      return () => window.cancelAnimationFrame(frame);
    }
    if (route.page === "home") window.scrollTo({ top: 0, behavior: "auto" });
  }, [route.page, route.slug, route.hash]);

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
    <RouteContext.Provider value={route}>
      <SeoMetadata route={route} />
      <div className="min-h-screen bg-linen text-ink" onClick={handleInternalLink}>
        <Header />
        {renderPage()}
        <Footer />
      </div>
    </RouteContext.Provider>
  );
}
