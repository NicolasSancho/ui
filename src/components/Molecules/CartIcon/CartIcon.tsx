import React from "react";
import { tv } from "../../styles/tv.js";
import { focusRing } from "../../styles/focusRing.js";
import { targetSize } from "../../styles/targetSize.js";
import { Icon } from "../../Atoms/Icon/Icon.js";
import { Text } from "../../Atoms/Text/Text.js";

export interface CartIconProps {
  count?: number;
  onClick?: () => void;
  className?: string;
  color?: "primary" | "secondary" | "black";
  size?: "small" | "medium" | "large";
  /**
   * Accessible name. Defaults to "Shopping cart, N items".
   * Override it for translations or custom wording.
   */
  ariaLabel?: string;
}

const cartIconStyles = tv({
  base: "inline-flex items-center",
  variants: {
    interactive: {
      true: { base: ["cursor-pointer justify-center rounded-sm", targetSize, focusRing] },
    },
  },
  slots: {
    // The badge is placed on the icon, so it stays on its corner when the touch target is larger.
    icon: "relative inline-flex",
    badge: "absolute -top-1 -right-1 bg-danger text-on-danger text-xs rounded-full px-1",
  },
});

export const CartIcon: React.FC<CartIconProps> = ({
  count = 0,
  onClick,
  color = "black",
  size = "medium",
  className,
  ariaLabel,
}) => {
  const styles = cartIconStyles({ interactive: Boolean(onClick) });
  const label = ariaLabel ?? `Shopping cart, ${count} ${count === 1 ? "item" : "items"}`;

  const content = (
    <span className={styles.icon()}>
      <Icon name="ShoppingCart" color={color} size={size} />
      {count > 0 && (
        <Text as="span" className={styles.badge()}>
          {count}
        </Text>
      )}
    </span>
  );

  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={styles.base({ className })}
    >
      {content}
    </button>
  ) : (
    <span role="img" aria-label={label} className={styles.base({ className })}>
      {content}
    </span>
  );
};
