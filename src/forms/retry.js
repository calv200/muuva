import { useEffect, useRef, useState } from "react";

export function retryAfterDelay(value, now = Date.now()) {
  if (typeof value !== "string") return 0;
  value = value.trim();
  let delay;
  if (/^\d+$/.test(value)) delay = Number(value) * 1000;
  else {
    const date = Date.parse(value);
    if (!Number.isFinite(date) || new Date(date).toUTCString() !== value) return 0;
    delay = date - now;
  }
  // Our server's rolling windows return at most one hour; reject unreasonable headers.
  return Number.isSafeInteger(delay) && delay > 0 && delay <= 86400000 ? delay : 0;
}

export function useRetryAfter(onReady) {
  const [blocked, setBlocked] = useState(false);
  const deadline = useRef(0);
  const timer = useRef(null);
  const ready = useRef(onReady);
  ready.current = onReady;
  useEffect(() => () => clearTimeout(timer.current), []);

  function respectRetryAfter(header) {
    const delay = retryAfterDelay(header);
    if (!delay) return;
    deadline.current = Math.max(deadline.current, Date.now() + delay);
    clearTimeout(timer.current);
    setBlocked(true);
    timer.current = setTimeout(() => {
      deadline.current = 0;
      setBlocked(false);
      ready.current?.();
    }, deadline.current - Date.now());
  }
  return { blocked, isBlocked: () => deadline.current > Date.now(), respectRetryAfter };
}
