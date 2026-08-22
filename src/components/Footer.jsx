import { useState } from "react";
import SiteContainer from "./SiteContainer.jsx";

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
      <ul className="space-y-3 text-muted sm:space-y-3.5">
        {links.map((link) => (
          <li key={link}>
            <a
              className="muuva-footer-link transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
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
    <footer className="bg-warm py-16 text-ink sm:py-20 lg:py-24">
      <SiteContainer>
        <div className="grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-14 lg:grid-cols-[1.45fr_0.8fr_0.8fr_1fr] lg:gap-16">
          <div>
            <h2 className="font-serif text-4xl font-medium leading-tight sm:text-5xl">
              Stay in the move.
            </h2>
            <p className="muuva-support mt-7 max-w-md text-muted">
              Sign up for exclusive Muuva content and pilates inspiration
            </p>

            {isSubscribed ? (
              <div
                className="muuva-ui mt-8 inline-flex min-h-12 w-full max-w-md items-center gap-3 border border-brand/20 bg-brand/10 px-5 text-ink/75"
                role="status"
                aria-live="polite"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
                  <CheckIcon />
                </span>
                <span>You have been subscribed to our newsletter.</span>
              </div>
            ) : (
              <form className="mt-8 max-w-md" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <div className="flex h-14 items-center border border-softborder bg-cream transition focus-within:border-brand/60">
                  <input
                    className="muuva-ui h-full min-w-0 flex-1 bg-transparent px-5 text-ink placeholder:text-muted/70 focus:outline-none"
                    id="footer-email"
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    required
                  />
                  <button
                    className="mr-3 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink/[0.06] text-muted transition hover:bg-ink/10 hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-3 focus-visible:outline-brand"
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

          <div className="max-w-sm lg:max-w-[18rem]">
            <h2 className="muuva-ui font-medium text-ink">About Muuva</h2>
            <p className="muuva-support mt-7 text-muted">
              Based in Amsterdam, Muuva creates beautifully designed and
              sustainably made Pilates gear for movement practices at home and in
              the studio.
            </p>
          </div>
        </div>

        <div className="muuva-legal mt-16 flex flex-col gap-9 text-muted sm:mt-20 lg:mt-24">
          <a
            className="inline-flex h-10 w-10 items-center justify-center text-muted transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
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
              className="transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
              href="#"
            >
              Calv200
            </a>
            .
          </p>
        </div>
      </SiteContainer>
    </footer>
  );
}
