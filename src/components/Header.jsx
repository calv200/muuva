import muuvaLogo from "../assets/images/muuvaLogo.png";
import SiteContainer from "./SiteContainer.jsx";

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[22px] w-[22px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path strokeLinecap="round" d="m21 21-4.2-4.2" />
      <circle cx="10.8" cy="10.8" r="6.3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[22px] w-[22px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21M12 3c-2.2 2.5-3.3 5.5-3.3 9s1.1 6.5 3.3 9" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-beige/95 backdrop-blur-sm">
      <SiteContainer className="flex h-16 items-center justify-between">
        <a href="#" className="inline-flex items-center" aria-label="muuva home">
          <img
            className="h-[18px] w-auto object-contain"
            src={muuvaLogo}
            alt="muuva"
          />
        </a>

        <div className="flex items-center gap-6 sm:gap-10">
          <nav className="hidden items-center gap-8 text-[15px] font-medium leading-none sm:flex">
            <a
              className="underline decoration-ink/70 underline-offset-4 transition hover:decoration-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
              href="#product"
            >
              Shop
            </a>
            <a
              className="underline decoration-ink/70 underline-offset-4 transition hover:decoration-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
              href="#"
            >
              Training sessions
            </a>
          </nav>

          <div className="flex items-center gap-2 text-ink">
            <button
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-linen/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand"
              type="button"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <button
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-linen/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand"
              type="button"
              aria-label="Language"
            >
              <GlobeIcon />
            </button>
          </div>
        </div>
      </SiteContainer>
    </header>
  );
}
