import { Bike, CookingPot, Flame, House } from "lucide-react";
import { trustPoints } from "../data/content";

const icons = {
  fresh: CookingPot,
  dum: Flame,
  home: House,
  local: Bike,
};

export default function TrustBadges() {
  return (
    <ul className="trust">
      {trustPoints.map((point) => {
        const Icon = icons[point.id];
        return (
          <li key={point.id}>
            <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>{point.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
