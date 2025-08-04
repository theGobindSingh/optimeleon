import { css } from "@emotion/react";

export const breakpoints = {
  phone: {
    min: 0,
    max: 640,
  },
  tablet: {
    min: 641,
    max: 1024,
  },
  desktop: {
    min: 1025,
    max: 99999,
  },
};

export const mediaQuery = {
  phone: `@media (min-width: ${breakpoints.phone.min}px) and (max-width: ${breakpoints.phone.max}px)`,
  tablet: `@media (min-width: ${breakpoints.tablet.min}px) and (max-width: ${breakpoints.tablet.max}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop.min}px)`,
};

export const globalStyles = css`
  :root {
    --some-variable: #000;
  }
  body {
    color: var(--color-gray-800);
    font-size: var(--fs-2xs);
    font-family: var(--font-sans);
    padding: 0;
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }
`;

export const commonLinkStyles = css`
  text-decoration: none;
  color: inherit;
  font-size: inherit;
  font-size: var(--fs-2xs);
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  ${mediaQuery.phone} {
    font-size: var(--fs-3xs);
  }
`;
