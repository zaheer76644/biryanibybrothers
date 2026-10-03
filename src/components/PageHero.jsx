import Ornament from "./Ornament";

export default function PageHero({ eyebrow, title, text }) {
  return (
    <header className="page-hero">
      <div className="wrap">
        {eyebrow && <p className="kicker is-light">{eyebrow}</p>}
        <h1>{title}</h1>
        <Ornament light />
        {text && <p>{text}</p>}
      </div>
    </header>
  );
}
