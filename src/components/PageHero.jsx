import Ornament from "./Ornament";

export default function PageHero({ eyebrow, title, text, variant = "default" }) {
  return (
    <header className={`page-hero page-hero--${variant}`}>
      <div className="page-hero__glow" aria-hidden="true" />
      <div className="page-hero__pattern" aria-hidden="true" />
      <div className="wrap page-hero__inner">
        {eyebrow && <p className="kicker is-light reveal is-in">{eyebrow}</p>}
        <h1 className="reveal is-in" style={{ transitionDelay: "60ms" }}>{title}</h1>
        <Ornament light />
        {text && (
          <p className="reveal is-in" style={{ transitionDelay: "120ms" }}>
            {text}
          </p>
        )}
      </div>
    </header>
  );
}
