import { useEffect } from "react";
import { seo } from "../config/brand";

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function usePageMeta({ title, description }) {
  useEffect(() => {
    document.title = title || seo.title;
    setMeta("name", "description", description || seo.description);
    setMeta("property", "og:title", title || seo.title);
    setMeta("property", "og:description", description || seo.description);
  }, [title, description]);
}
