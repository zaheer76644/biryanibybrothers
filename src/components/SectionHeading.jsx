import Ornament from "./Ornament";

export default function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
  align = "center",
}) {
  return (
    <header className={`sec-head ${light ? "is-light" : ""} ${align === "left" ? "is-left" : ""}`}>
      {eyebrow && <p className={`kicker ${light ? "is-light" : ""}`}>{eyebrow}</p>}
      <h2>{title}</h2>
      <Ornament light={light} align={align} />
      {text && <p className="sec-head__text">{text}</p>}
    </header>
  );
}
