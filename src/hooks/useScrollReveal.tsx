import { useEffect, useRef } from "react";

export const useScrollReveal = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("animate-fade-in");
          el.classList.remove("opacity-0");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    el.classList.add("opacity-0");
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
};
