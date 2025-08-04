import { css } from "@emotion/react";
import { mediaQuery } from "@styles/global";

export const containerSize = "85%";
export const tabletContainerSize = "90%";
export const mobileContainerSize = "90%";

export const containerStyles = css`
  ${mediaQuery.tablet} {
    width: ${tabletContainerSize};
  }
  ${mediaQuery.phone} {
    width: ${mobileContainerSize};
  }
`;

export const wrapperStyles = (bg?: string) => css`
  width: 100%;
  ${bg &&
  css`
    background: ${bg};
  `}
`;
