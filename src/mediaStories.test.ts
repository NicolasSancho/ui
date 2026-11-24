import { expect, test } from "vitest";
import { MEDIA_TAG } from "../.storybook/mediaTag";

// The storybook-media project passes with no tests if no story carries the tag, so pin which ones must.
const stories = import.meta.glob("./components/**/*.stories.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
});
const required = [
  "Atoms/Button/Button",
  "Atoms/ButtonLink/ButtonLink",
  "Molecules/Breadcrumbs/Breadcrumbs",
  "Molecules/Pagination/Pagination",
  "Molecules/SidebarNav/SidebarNav",
  "Organisms/Footer/Footer",
  "Organisms/Header/Header",
];

test.each(required)("%s has a story tagged for the media project", (name) => {
  const source = stories[`./components/${name}.stories.tsx`] as string;
  expect(source).toMatch(new RegExp(`tags: \\[[^\\]]*"${MEDIA_TAG}"`));
});
