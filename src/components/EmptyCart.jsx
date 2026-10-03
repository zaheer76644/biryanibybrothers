import Button from "./Button";

export default function EmptyCart({ compact = false }) {
  return (
    <div className={`empty ${compact ? "empty--compact" : ""}`}>
      <p className="kicker">The handi is empty</p>
      <h2>Your biryani box is waiting.</h2>
      <Button to="/menu">Explore Menu</Button>
    </div>
  );
}
