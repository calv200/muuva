export default function SiteContainer({
  as: Component = "div",
  className = "",
  children,
}) {
  return (
    <Component className={`site-container ${className}`}>{children}</Component>
  );
}
