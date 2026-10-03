import { Bike, Droplets, Flame, Layers, Package, Utensils } from "lucide-react";
import { processSteps } from "../data/content";
import { useInView } from "../hooks/useInView";
import SectionHeading from "./SectionHeading";

const icons = [Droplets, Utensils, Layers, Flame, Package, Bike];

function Step({ step, index }) {
  const [ref, shown] = useInView();
  const Icon = icons[index];

  return (
    <li
      ref={ref}
      className={`process-step reveal ${shown ? "is-in" : ""}`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <span className="process-step__n">{step.n}</span>
      <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
      <h3>{step.title}</h3>
      <p>{step.text}</p>
    </li>
  );
}

export default function ProcessSection() {
  return (
    <section className="section section--cream">
      <div className="wrap">
        <SectionHeading
          eyebrow="How we make it"
          title="From marination to your door."
          text="Six quiet steps. No shortcuts on the dum."
        />
        <ol className="process">
          {processSteps.map((step, index) => (
            <Step key={step.n} step={step} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
