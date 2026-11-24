import { expect } from "storybook/test";
const env = (import.meta as { env?: Record<string, string | undefined> }).env;
const inMediaProject = env?.STORYBOOK_MEDIA === "forced-colors-coarse";
const forcedColors = () => matchMedia("(forced-colors: active)").matches;
const transparent = "rgba(0, 0, 0, 0)";
export const expectMediaEmulated = () => {
  if (!inMediaProject) return;
  expect(forcedColors()).toBe(true);
  expect(matchMedia("(pointer: coarse)").matches).toBe(true);
};
export const expectTargetSize = (elements: HTMLElement[]) => {
  expectMediaEmulated();
  const min = matchMedia("(pointer: coarse)").matches ? 44 : 24;
  for (const el of elements) {
    const { width, height } = el.getBoundingClientRect();
    expect(width, el.textContent ?? "").toBeGreaterThanOrEqual(min);
    expect(height, el.textContent ?? "").toBeGreaterThanOrEqual(min);
  }
};
export const expectVisibleBorder = (el: HTMLElement) => {
  expectMediaEmulated();
  if (!forcedColors()) return;
  const s = getComputedStyle(el);
  expect(s.borderTopStyle).toBe("solid");
  expect(parseFloat(s.borderTopWidth)).toBeGreaterThanOrEqual(1);
  expect(s.borderTopColor).not.toBe(transparent);
};
// Forced colors drops box-shadow, so the ring disappears and only the outline fallback shows focus.
export const expectVisibleFocus = (el: HTMLElement) => {
  expectMediaEmulated();
  const s = getComputedStyle(el);
  if (!forcedColors()) {
    expect(s.boxShadow).not.toBe("none");
    return;
  }
  expect(s.outlineStyle).toBe("solid");
  expect(parseFloat(s.outlineWidth)).toBeGreaterThanOrEqual(1);
  expect(s.outlineColor).not.toBe(transparent);
};
