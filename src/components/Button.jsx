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

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
