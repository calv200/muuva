export default function CtaLink({ href, children, className = "" }) {
  return (
    <a
      className={`inline-flex min-h-11 items-center justify-center rounded-sm border border-ink/75 bg-transparent px-7 py-3 text-sm font-medium uppercase tracking-[0.16em] text-ink transition duration-150 hover:border-ink hover:bg-ink hover:text-linen focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand active:translate-y-px ${className}`}
      href={href}
    >
      {children}
    </a>
  );
}
