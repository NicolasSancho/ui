/**
 * The keyboard focus style of every interactive component, as complete class names so Tailwind
 * finds them. Exported, so app elements next to library ones focus the same way. An element whose
 * ring would be clipped paints an equivalent instead: an inset ring (see ProductCard).
 */
export const focusRing: string =
  "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";
