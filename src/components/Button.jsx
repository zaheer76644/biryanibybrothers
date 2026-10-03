import { Link } from "react-router-dom";

export default function Button({
  variant = "primary",
  to,
  href,
  className = "",
  children,
  type = "button",
  disabled = false,
  ...props
}) {
  const classes = `btn btn--${variant} ${className}`.trim();
  const inner = (
    <>
      <span className="btn__shine" aria-hidden="true" />
      <span className="btn__label">{children}</span>
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...props}>
        {inner}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={classes} {...props}>
        {inner}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {inner}
    </button>
  );
}
