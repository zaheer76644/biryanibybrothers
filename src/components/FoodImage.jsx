import { useState } from "react";

export default function FoodImage({ src, alt, priority = false }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div className="food-fallback" role="img" aria-label={alt}>
        <svg viewBox="0 0 80 64" aria-hidden="true">
          <path
            d="M10 28c0-8 8-14 18-14 2-6 8-10 14-10s12 4 14 10c10 0 18 6 18 14 0 10-8 16-18 18l-4 10H28l-4-10C16 44 10 38 10 28z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M28 18c4-8 16-8 22 2" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M40 6c2 4 2 8 0 12M33 8c1 3 1 6 0 9M47 8c-1 3-1 6 0 9" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
