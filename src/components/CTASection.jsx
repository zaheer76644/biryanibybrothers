import Button from "./Button";
import Ornament from "./Ornament";

export default function CTASection({
  title = "Craving Biryani?",
  text = "Your next favourite biryani might be one click away.",
  action = "Order Now",
  to = "/menu",
}) {
  return (
    <section className="cta">
      <div className="wrap cta__inner">
        <h2>{title}</h2>
        <Ornament light />
        <p>{text}</p>
        <Button to={to}>{action}</Button>
      </div>
    </section>
  );
}
