import { dumStages } from "../data/content";

export default function DumMeter() {
  return (
    <ol className="dum" aria-label="Dum cooking stages">
      {dumStages.map((stage, index) => (
        <li key={stage}>
          <span className="dum__dot" aria-hidden="true" />
          {index < dumStages.length - 1 && <span className="dum__line" aria-hidden="true" />}
          <span>{stage}</span>
        </li>
      ))}
    </ol>
  );
}
