import { useState } from "react";

const navigationLinks = [
  "Behind Muuva",
  "Contact Us",
  "Wholesale Muuva",
  "Apply for Wholesale",
  "Caring For Your Muuva",
  "Sustainability Commitment",
];

const policyLinks = [
  "FAQs",
  "Privacy Policy",
  "Refund Policy",
  "Shipping Policy",
  "Terms of Service",
  "Terms of Use",
];

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <path strokeLinecap="round" d="M17.3 6.7h.01" />
    </svg>
  );
}

function FooterLinkList({ links, ariaLabel }) {
  return (
    <nav aria-label={ariaLabel}>
      <ul className="space-y-4 text-sm text-ink/58 sm:text-base">
        {links.map((link) => (
          <li key={link}>
            <a
              className="transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-stonegreen"
              href="#"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubscribed(true);
    event.currentTarget.reset();
  };

  return (
    <footer className="bg-[#f2efe9] px-5 py-16 text-ink sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.45fr_0.85fr_0.85fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-serif text-4xl font-medium leading-tight sm:text-5xl">
              Stay in the move.
            </h2>
            <p className="mt-7 max-w-md text-base leading-8 text-ink/68">
              Sign up for exclusive Muuva content and pilates inspiration
            </p>

            {isSubscribed ? (
              <div
                className="mt-8 inline-flex min-h-12 w-full max-w-md items-center gap-3 border border-stonegreen/20 bg-stonegreen/10 px-5 text-sm text-ink/75"
                role="status"
                aria-live="polite"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-stonegreen/15 text-stonegreen">
                  <CheckIcon />
                </span>
                <span>You have been subscribed to our newsletter.</span>
              </div>
            ) : (
              <form className="mt-8 max-w-md" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <div className="flex h-16 items-center border border-ink/10 bg-[#f8f5ef] transition focus-within:border-stonegreen/50">
                  <input
                    className="h-full min-w-0 flex-1 bg-transparent px-5 text-base text-ink placeholder:text-ink/38 focus:outline-none"
                    id="footer-email"
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    required
                  />
                  <button
                    className="mr-4 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink/[0.06] text-ink/65 transition hover:bg-ink/10 hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-stonegreen"
                    type="submit"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowIcon />
                  </button>
                </div>
              </form>
            )}
          </div>

          <FooterLinkList links={navigationLinks} ariaLabel="Footer navigation" />
          <FooterLinkList links={policyLinks} ariaLabel="Footer policies" />

          <div className="max-w-sm lg:max-w-xs">
            <h2 className="text-base font-semibold text-ink">About Muuva</h2>
            <p className="mt-7 text-base leading-8 text-ink/68">
              Based in Amsterdam, Muuva creates beautifully designed and
              sustainably made Pilates gear for movement practices at home and in
              the studio.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-9 text-sm text-ink/58 sm:mt-20 lg:mt-24">
          <a
            className="inline-flex h-10 w-10 items-center justify-center text-ink/78 transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-stonegreen"
            href="https://www.instagram.com/muuva.studio/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Muuva on Instagram"
          >
            <InstagramIcon />
          </a>

          <p>
            &copy; 2026, Muuva. Website designed by{" "}
            <a
              className="transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-stonegreen"
              href="#"
            >
              Calv200
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
