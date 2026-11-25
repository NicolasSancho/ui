import React from "react";
import { tv } from "../../styles/tv.js";
import { linkStyles } from "../../styles/linkStyles.js";
import { Text } from "../../Atoms/Text/Text.js";
import { Container } from "../../Layouts/Container/Container.js";
import type { LinkAttributes, LinkComponentType } from "../../types/linkComponent.js";

export interface FooterColumn {
  /** Column heading, rendered as an `<h2>`. */
  title: string;
  /** The column's links, in order. */
  links: FooterLink[];
}

/** A link in a footer column. */
export interface FooterLink {
  /** Visible text of the link. */
  label: string;
  /** Link target. */
  href: string;
  /** Language of the label, when it differs from the page's (e.g. "Português" on a Spanish page). */
  lang?: LinkAttributes["lang"];
  /** Language of the linked page. Advisory: browsers do not enforce it. */
  hrefLang?: LinkAttributes["hrefLang"];
  /**
   * Whether the link points to the page the user is on, such as the current language in a
   * language list. It sets `aria-current="page"` and makes the link semibold. The app sets it.
   */
  current?: boolean;
}

export interface FooterProps {
  /**
   * Groups of links. They all sit inside one `<nav>` landmark (see `navLabel`), each under its
   * own heading. Without columns no navigation is rendered.
   */
  columns?: FooterColumn[];
  /** Brand block shown before the columns, such as a logo and a short description. */
  brand?: React.ReactNode;
  /** Legal line shown under a divider, such as the copyright. */
  legal?: React.ReactNode;
  /**
   * Component used to render each link. Receives `href`, `className`, `children`, `lang`,
   * `hrefLang` and `aria-current` (`undefined` when the link does not set them, so no attribute is
   * rendered), so a framework link (e.g. `next/link`) can be passed directly. Defaults to a plain `<a>`.
   * Define it outside the render function: an inline definition remounts the links.
   */
  LinkComponent?: LinkComponentType;
  /**
   * Accessible name of the navigation landmark. Change it when the page has another navigation
   * with the same name, or to translate it.
   */
  navLabel?: string;
  className?: string;
}

const footerStyles = tv({
  base: "w-full border-t border-neutral-200 bg-surface",
  slots: {
    inner: "flex flex-col gap-8 py-10",
    top: "flex flex-col gap-8 md:flex-row md:justify-between",
    brand: "md:max-w-xs",
    columns: "flex flex-wrap gap-x-12 gap-y-8",
    list: "mt-3 flex flex-col gap-2",
    link: linkStyles({ variant: "nav" }),
    legal: "border-t border-neutral-200 pt-6 text-sm text-neutral-600",
  },
  variants: {
    current: {
      true: { link: "font-semibold text-neutral-900" },
    },
  },
});

/**
 * Page footer: a `contentinfo` landmark with an optional brand block, link columns and a legal
 * line. The bar is full-width and its content sits in a `Container`, so it lines up with page
 * content wrapped in one. It holds no state, so it renders from a Server Component.
 */
export const Footer: React.FC<FooterProps> = ({
  columns = [],
  brand,
  legal,
  LinkComponent = "a",
  navLabel = "Footer",
  className,
}) => {
  const styles = footerStyles();
  const hasColumns = columns.length > 0;

  return (
    <footer className={styles.base({ className })}>
      <Container className={styles.inner()}>
        {(brand || hasColumns) && (
          <div className={styles.top()}>
            {brand && <div className={styles.brand()}>{brand}</div>}
            {hasColumns && (
              <nav aria-label={navLabel} className={styles.columns()}>
                {columns.map(({ title, links }) => (
                  <div key={title}>
                    <Text as="h2" size="small" weight="semibold" color="darker">
                      {title}
                    </Text>
                    <ul className={styles.list()}>
                      {links.map(({ label, href, lang, hrefLang, current }) => (
                        <li key={`${label}-${href}`}>
                          <LinkComponent
                            href={href}
                            lang={lang}
                            hrefLang={hrefLang}
                            aria-current={current ? "page" : undefined}
                            className={styles.link({ current: Boolean(current) })}
                          >
                            {label}
                          </LinkComponent>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            )}
          </div>
        )}
        {legal && <div className={styles.legal()}>{legal}</div>}
      </Container>
    </footer>
  );
};
