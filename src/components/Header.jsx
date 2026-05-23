import muuvaLogo from "../assets/images/muuvaLogo.png";

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
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
      className="h-5 w-5"
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
    <header className="sticky top-0 z-30 bg-oat/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#" className="inline-flex items-center" aria-label="muuva home">
          <img
            className="h-7 w-auto object-contain sm:h-8"
            src={muuvaLogo}
            alt="muuva"
          />
        </a>

        <div className="flex items-center gap-5 sm:gap-8">
          <nav className="hidden items-center gap-8 font-serif text-lg italic sm:flex">
            <a className="underline underline-offset-4" href="#product">
              Shop
            </a>
            <a className="underline underline-offset-4" href="#">
              Training sessions
            </a>
          </nav>

          <div className="flex items-center gap-4 text-ink">
            <button
              className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-linen/40"
              type="button"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <button
              className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-linen/40"
              type="button"
              aria-label="Language"
            >
              <GlobeIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
