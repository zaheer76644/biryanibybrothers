export default function ReviewCard({ review }) {
  return (
    <figure className="review">
      <figcaption className="kicker">Sample review</figcaption>
      <blockquote>
        <p>“{review.quote}”</p>
      </blockquote>
      <p className="review__note">{review.note}</p>
    </figure>
  );
}
