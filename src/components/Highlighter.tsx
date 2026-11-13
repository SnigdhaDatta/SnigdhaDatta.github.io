import { useEffect, useRef, type ReactNode } from "react";
import { annotate } from "rough-notation";

interface HighlighterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Magic UI's Highlighter: rough-notation underline with Magic UI's default
 * settings, drawn in the theme's ink color on initial render.
 */
export function Highlighter({ children, className }: HighlighterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ink =
      getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() ||
      "#161616";
    const annotation = annotate(el, {
      type: "underline",
      color: ink,
      strokeWidth: 1.5,
      animationDuration: 600,
      iterations: 2,
      padding: 2,
      multiline: true,
    });

    annotation.show();

    const resizeObserver = new ResizeObserver(() => {
      if (annotation.isShowing()) {
        annotation.hide();
        annotation.show();
      }
    });
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      annotation.remove();
    };
  }, []);

  return (
    <span ref={ref} className={`relative inline-block bg-transparent ${className ?? ""}`}>
      {children}
    </span>
  );
}
