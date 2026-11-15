import { useEffect, useState } from "react";

const turnstileScript = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise;

// One loader for pages where the newsletter and enquiry widgets coexist.
export function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = turnstileScript;
      script.async = true;
      script.referrerPolicy = "no-referrer";
      script.onload = () => window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile unavailable"));
      script.onerror = () => reject(new Error("Turnstile unavailable"));
      document.head.append(script);
    }).catch((error) => { scriptPromise = undefined; throw error; });
  }
  return scriptPromise;
}
export function useTurnstileSize(container, active, defaultSize = "normal") {
  const [size, setSize] = useState(defaultSize);
  useEffect(() => {
    if (!active || !container.current) return;
    const element = container.current;
    const measure = () => setSize(element.clientWidth < 300 ? "compact" : defaultSize);
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [container, active, defaultSize]);
  return size;
}
