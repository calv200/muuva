import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SiteContainer from "../components/SiteContainer.jsx";
import ContactForm from "../components/ContactForm.jsx";

export default function ContactPage() {
  const { t } = useTranslation();
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  return (
    <main>
      <SiteContainer className="py-12 sm:py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <section className="max-w-xl">
            <p className="muuva-label text-brand">{t("contact.eyebrow")}</p>
            <h1 ref={heading} tabIndex={-1} className="mt-5 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.06] text-balance focus:outline-none">{t("contact.title")}</h1>
            <p className="muuva-support mt-6 text-muted">{t("contact.intro")}</p>
            <a className="muuva-ui mt-8 inline-flex min-h-11 items-center text-brand underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" href="mailto:contact@muuva.nl">contact@muuva.nl</a>
          </section>
          <section aria-labelledby="contact-form-title" className="min-w-0 border border-softborder bg-warm px-5 py-8 sm:p-10 lg:px-8 xl:p-12">
            <h2 id="contact-form-title" className="font-serif text-3xl font-medium leading-tight sm:text-4xl">{t("contact.formTitle")}</h2>
            <p className="muuva-support mt-4 mb-8 text-muted">{t("contact.formIntro")}</p>
            <ContactForm />
          </section>
        </div>
      </SiteContainer>
    </main>
  );
}
