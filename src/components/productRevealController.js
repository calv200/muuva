// Plays the product reveals inside the product stage. React renders the markup; this module only moves it.
// Elements are found by id: reveal-<id>-layer, reveal-<id>-hotspot, reveal-<id>-specs, reveal-<id>-close.
// Returns a cleanup function.

const FRAMES = 36, COLUMNS = 6, PLAY_MS = 1300, MOVE_MS = 1450;

export function mountProductReveals(stage, reveals) {
  if (!stage) return () => {};
  const composition = stage.querySelector(".product-composition");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const listeners = new AbortController();
  const on = (target, type, handler, options = {}) => target.addEventListener(type, handler, { ...options, signal: listeners.signal });
  const timers = new Set();
  const wait = (ms) => new Promise((resolve) => { const id = setTimeout(() => { timers.delete(id); resolve(); }, ms); timers.add(id); });
  let active = null;

  function makeReveal({ id, sprite: spriteUrl, room, shift }) {
    const $ = (part) => stage.querySelector(`#reveal-${id}-${part}`);
    const layer = $("layer"), hotspot = $("hotspot"), spec = $("specs"), closeButton = $("close");
    if (!layer || !hotspot || !spec || !closeButton) return null;
    const sprite = layer.querySelector(".product-reveal-sprite"), photo = layer.querySelector(".product-reveal-photo");
    let open = false, busy = false, frame = 0, raf = 0, ready = null;

    const load = () => (ready ??= new Promise((resolve) => { const image = new Image(); image.onload = image.onerror = resolve; image.src = spriteUrl; }));
    for (const type of ["pointerenter", "focus", "touchstart"]) on(hotspot, type, load, { passive: true, once: true });

    const showFrame = (index) => {
      frame = Math.max(0, Math.min(FRAMES - 1, index));
      sprite.style.backgroundPosition = `${(frame % COLUMNS) * 20}% ${Math.floor(frame / COLUMNS) * 20}%`;
    };
    const play = (to, duration) => {
      cancelAnimationFrame(raf);
      const from = frame, start = performance.now();
      return new Promise((resolve) => {
        if (duration <= 1) { showFrame(to); resolve(); return; }
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          showFrame(Math.round(from + (to - from) * progress));
          if (progress < 1) raf = requestAnimationFrame(tick); else resolve();
        };
        raf = requestAnimationFrame(tick);
      });
    };

    // Where the enlarged render cell goes; the callouts hang off this cell.
    function layout() {
      const stageBox = stage.getBoundingClientRect();
      layer.style.transform = "none";
      const layerBox = layer.getBoundingClientRect(), cellBox = sprite.getBoundingClientRect();
      const narrow = stageBox.width < 640;
      const restHeight = composition.getBoundingClientRect().height;
      const cell = narrow ? Math.min(stageBox.width * 0.76, 420) : Math.min(stageBox.width * 0.42, 600);
      const [aboveF, belowF] = narrow ? room.narrow : room.wide;
      const above = cell * aboveF, below = cell * belowF;
      const needed = above + cell + below;
      const left = (stageBox.width - cell) / 2 + cell * (narrow ? shift.narrow : shift.wide);
      const top = Math.max(above, (Math.max(needed, restHeight) - cell) / 2 - (below - above) / 2);
      const scale = cell / cellBox.width;
      const offsetX = cellBox.left - layerBox.left, offsetY = cellBox.top - layerBox.top;
      return {
        needed, cell, left, top,
        transform: `translate(${stageBox.left + left - layerBox.left - scale * offsetX}px, ${stageBox.top + top - layerBox.top - scale * offsetY}px) scale(${scale})`,
      };
    }
    function applySpec(target) {
      spec.style.setProperty("--cell", `${target.cell}px`);
      spec.style.setProperty("--hair", String(100 / target.cell));
      Object.assign(spec.style, { width: `${target.cell}px`, height: `${target.cell}px`, transform: `translate(${target.left}px, ${target.top}px)` });
    }

    async function reveal() {
      if (open || busy || active) return;
      busy = true; active = api;
      await load();
      const restHeight = stage.getBoundingClientRect().height;
      stage.style.minHeight = `${restHeight}px`;
      showFrame(0);
      layer.classList.add("is-active"); closeButton.classList.add("is-active");
      stage.classList.add("is-revealing");
      hotspot.setAttribute("aria-expanded", "true");
      spec.hidden = false;
      const target = layout();
      applySpec(target);
      layer.getBoundingClientRect();
      layer.style.transition = `transform ${reducedMotion ? 1 : MOVE_MS}ms cubic-bezier(.6, 0, .2, 1)`;
      layer.style.transform = target.transform;
      stage.style.minHeight = `${Math.max(restHeight, target.needed)}px`;
      await wait(reducedMotion ? 0 : 60);
      photo.style.opacity = "0"; sprite.style.opacity = "1";
      await wait(reducedMotion ? 0 : 90);
      await play(FRAMES - 1, reducedMotion ? 0 : PLAY_MS);
      stage.classList.add("is-specs-in");
      open = true; busy = false;
      closeButton.focus({ preventScroll: true });
    }

    async function conceal() {
      if (!open || busy) return;
      busy = true;
      stage.classList.remove("is-specs-in");
      await wait(reducedMotion ? 0 : 220);
      layer.style.transition = `transform ${reducedMotion ? 1 : 1150}ms cubic-bezier(.6, 0, .2, 1)`;
      layer.style.transform = "none";
      stage.style.minHeight = "";
      await play(0, reducedMotion ? 0 : 1050);
      photo.style.opacity = "1"; sprite.style.opacity = "0";
      stage.classList.remove("is-revealing");
      closeButton.classList.remove("is-active");
      hotspot.setAttribute("aria-expanded", "false");
      await wait(reducedMotion ? 0 : 460);
      layer.classList.remove("is-active");
      spec.hidden = true;
      layer.style.transition = "";
      open = false; busy = false; active = null;
      hotspot.focus({ preventScroll: true });
    }

    function relayout() {
      if (!open || busy) return;
      layer.style.transition = "none";
      const target = layout();
      layer.style.transform = target.transform; applySpec(target);
      stage.style.minHeight = `${Math.max(composition.getBoundingClientRect().height, target.needed)}px`;
    }

    on(hotspot, "click", (event) => { event.stopPropagation(); reveal(); });
    on(closeButton, "click", conceal);
    on(layer, "click", conceal);
    const api = { load, conceal, relayout, isOpen: () => open, stop: () => cancelAnimationFrame(raf) };
    return api;
  }

  const controls = reveals.map(makeReveal).filter(Boolean);
  // Fetch the sprites once the page is idle, so a first tap plays straight away.
  const preload = () => controls.forEach((control) => control.load());
  const idle = "requestIdleCallback" in window ? window.requestIdleCallback(preload, { timeout: 4000 }) : null;
  const fallback = idle === null ? setTimeout(preload, 2500) : null;
  on(window, "keydown", (event) => { if (event.key === "Escape") controls.forEach((control) => control.isOpen() && control.conceal()); });
  on(window, "resize", () => controls.forEach((control) => control.relayout()));

  return () => {
    listeners.abort();
    timers.forEach(clearTimeout);
    controls.forEach((control) => control.stop());
    if (idle !== null) window.cancelIdleCallback?.(idle);
    if (fallback !== null) clearTimeout(fallback);
  };
}
