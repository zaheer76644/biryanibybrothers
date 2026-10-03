import { useInView } from "../hooks/useInView";

export default function Reveal({ children, className = "", delay = 0 }) {
  const [ref, shown] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "is-in" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
