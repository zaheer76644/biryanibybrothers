import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import Button from "../components/Button";

export default function NotFoundPage() {
  usePageMeta({
    title: pageTitle("Page not found"),
    description: "This page is not part of the Biryani By Brothers website.",
  });

  return (
    <div className="page empty">
      <p className="kicker">404</p>
      <h1>Oops! This page wandered off.</h1>
      <p>The link may be old, or the dish may have left the menu.</p>
      <Button to="/">Back Home</Button>
    </div>
  );
}
