import type { LinkComponentProps } from "../../types/linkComponent";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { expectTargetSize } from "../../../../.storybook/media";
import { Footer } from "./Footer";
import {
  mockedFooterColumnsOnly,
  mockedFooterDefault,
  mockedFooterLanguages,
  mockedFooterMinimal,
} from "./footerMock";

const meta = {
  title: "Organisms/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Spy standing in for a framework link (e.g. next/link): records the props it receives and,
// like next/link, puts the other attributes on the <a>.
const linkSpy = fn(({ children, ...props }: LinkComponentProps) => <a {...props}>{children}</a>);

// No LinkComponent here: the links render as plain anchors, so no setup is needed.
export const Default: Story = {
  tags: ["media"],
  args: mockedFooterDefault,
  play: async ({ canvasElement }) => {
    expectTargetSize(within(canvasElement).getAllByRole("link"));
    const canvas = within(canvasElement);

    // A page-level <footer> is the contentinfo landmark.
    await expect(canvas.getByRole("contentinfo")).toBeInTheDocument();

    // One navigation landmark holds every column, each under its own heading.
    const nav = canvas.getByRole("navigation", { name: "Footer" });
    await expect(
      within(nav)
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent)
    ).toEqual(["Shop", "Help", "About"]);
    await expect(within(nav).getByRole("link", { name: "Ceramics" })).toHaveAttribute(
      "href",
      "/products?category=ceramics"
    );
    await expect(within(nav).getAllByRole("link")).toHaveLength(7);

    await expect(canvas.getByText("© 2026 ACME. All rights reserved.")).toBeInTheDocument();
  },
};

export const CustomNavLabel: Story = {
  args: { ...mockedFooterDefault, navLabel: "Store information" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The label replaces the default name, so two navigations on a page can be told apart.
    await expect(canvas.getByRole("navigation", { name: "Store information" })).toBeInTheDocument();
    await expect(canvas.queryByRole("navigation", { name: "Footer" })).not.toBeInTheDocument();
  },
};

export const Minimal: Story = {
  args: mockedFooterMinimal,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Without columns there is nothing to navigate, so no empty landmark is rendered.
    await expect(canvas.queryByRole("navigation")).not.toBeInTheDocument();
    await expect(canvas.getByText("© 2026 ACME. All rights reserved.")).toBeInTheDocument();
  },
};

export const ColumnsOnly: Story = {
  args: mockedFooterColumnsOnly,
};

export const CustomLink: Story = {
  args: { ...mockedFooterLanguages, LinkComponent: linkSpy },
  beforeEach: () => {
    linkSpy.mockClear();
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const received = linkSpy.mock.calls.map(([props]) => props);

    // Every link goes through the injected component with its href, a class and its label.
    await expect(received).toHaveLength(9);
    await expect(received).toContainEqual(
      expect.objectContaining({ href: "/help/returns", children: "Returns" })
    );
    await expect(received.every(({ className }) => Boolean(className))).toBe(true);
    // The language attributes and the current mark reach it too.
    await expect(received).toContainEqual(
      expect.objectContaining({ href: "/en/", hrefLang: "en", "aria-current": "page" })
    );
    await expect(received).toContainEqual(
      expect.objectContaining({ href: "/es/", lang: "es", hrefLang: "es" })
    );
    // The result is what the user gets: a real link.
    await expect(canvas.getByRole("link", { name: "Returns" })).toHaveAttribute(
      "href",
      "/help/returns"
    );
  },
};

// On a wide screen the bar stays full-width while its content sits in the container, so it lines
// up with page content. The layout is measured: a class check cannot prove it.
export const WideScreen: Story = {
  args: mockedFooterDefault,
  render: (args) => (
    <div style={{ width: 2000 }}>
      <Footer {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("contentinfo").getBoundingClientRect();
    const legal = canvas.getByText("© 2026 ACME. All rights reserved.").getBoundingClientRect();

    // Full-bleed bar, inset content: at least the space left by a 1152px container.
    await expect(bar.width).toBe(2000);
    await expect(legal.left - bar.left).toBeGreaterThanOrEqual((2000 - 1152) / 2);
  },
};

// A language list. The current link is marked by weight as well as color, so it still shows in
// forced colors, where colors are replaced.
export const Languages: Story = {
  tags: ["media"],
  args: mockedFooterLanguages,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const english = canvas.getByRole("link", { name: "English" });
    const spanish = canvas.getByRole("link", { name: "Español" });

    // Only the current link is marked.
    await expect(canvasElement.querySelectorAll("[aria-current]")).toHaveLength(1);
    await expect(english).toHaveAttribute("aria-current", "page");

    // The attributes appear only where a link sets them.
    await expect(spanish).toHaveAttribute("lang", "es");
    await expect(spanish).toHaveAttribute("hreflang", "es");
    await expect(english).toHaveAttribute("hreflang", "en");
    await expect(english).not.toHaveAttribute("lang");
    await expect(canvas.getByRole("link", { name: "Ceramics" })).not.toHaveAttribute("hreflang");

    const weight = (el: HTMLElement) => Number(getComputedStyle(el).fontWeight);
    await expect(weight(english)).toBeGreaterThan(weight(spanish));
    expectTargetSize([english, spanish]);
  },
};
