import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { expectTargetSize, expectVisibleFocus } from "../../../../.storybook/media";
import { CartIcon } from "./CartIcon";
import {
  mockedCartIconEmpty,
  mockedCartIconSingleItem,
  mockedCartIconMultipleItems,
  mockedCartIconVeryHighCount,
  mockedCartIconPrimary,
  mockedCartIconLarge,
} from "./cartIconMock";

const meta = {
  title: "Molecules/CartIcon",
  component: CartIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: action("cart-clicked") },
} satisfies Meta<typeof CartIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: mockedCartIconEmpty,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // An empty cart still names its count, but shows no badge.
    await expect(canvas.getByRole("button", { name: "Shopping cart, 0 items" })).toBeVisible();
    await expect(canvas.queryByText("0")).not.toBeInTheDocument();
  },
};

export const SingleItem: Story = {
  tags: ["media"],
  args: mockedCartIconSingleItem,
  play: async ({ canvasElement }) => {
    // One item reads in the singular.
    const button = within(canvasElement).getByRole("button", { name: "Shopping cart, 1 item" });
    await expect(button).toBeVisible();
    expectTargetSize([button]);
    // The badge sits on the icon's corner, not on the corner of a larger touch target.
    // The icon is decorative (aria-hidden), so it has no role to query by.
    const icon = button.querySelector("svg")?.getBoundingClientRect();
    const badge = within(button).getByText("1").getBoundingClientRect();
    await expect(icon).toBeDefined();
    await expect(Math.abs(badge.right - (icon?.right ?? 0))).toBeLessThanOrEqual(4);
    await expect(Math.abs(badge.top - (icon?.top ?? 0))).toBeLessThanOrEqual(4);

    await userEvent.tab();
    await expect(button).toHaveFocus();
    expectVisibleFocus(button);
  },
};

export const PrimaryColor: Story = {
  args: mockedCartIconPrimary,
};

export const MultipleItems: Story = {
  args: mockedCartIconMultipleItems,
  play: async ({ args, canvasElement }) => {
    // The badge shows the count whenever the cart has items.
    await expect(within(canvasElement).getByText(String(args.count))).toBeInTheDocument();
  },
};

export const VeryHighCount: Story = {
  args: mockedCartIconVeryHighCount,
};

export const Large: Story = {
  args: mockedCartIconLarge,
};
