import styled from "@emotion/styled";

type ColorType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "success"
  | "caution"
  | "info"
  | "error"
  | "gray"
  | "black"
  | "white";
type Weight = `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}00`;

const fontSizes = {
  "2xs": "var(--fs-2xs)",
  "1xs": "var(--fs-1xs)",
  s: "var(--fs-s)",
  m: "var(--fs-m)",
  l: "var(--fs-l)",
  "1xl": "var(--fs-1xl)",
  "2xl": "var(--fs-2xl)",
};

export interface CommonTextProps {
  $size?: keyof typeof fontSizes;
  $margin?: string;
  $weight?: Weight;
  $lineHeight?: string;
  $color?: ColorType;
  $colorWeight?: Weight;
  $letterSpacing?: string;
}

const getColor = ({
  $color,
  $colorWeight,
}: Pick<CommonTextProps, "$color" | "$colorWeight">) => {
  if (!$color) return "inherit";
  if ($color === "black" || $color === "white") {
    return `var(--color-${$color})`;
  }
  return `var(--color-${$color}-${$colorWeight ?? "400"})`;
};

const letterSpacingFn = ({
  $letterSpacing,
}: Pick<CommonTextProps, "$letterSpacing">) => $letterSpacing ?? "normal";

const lineHeightFn = ({ $lineHeight }: Pick<CommonTextProps, "$lineHeight">) =>
  $lineHeight ?? "normal";

const marginFn = ({ $margin }: Pick<CommonTextProps, "$margin">) =>
  $margin ?? "0";

export const H1 = styled.h1<CommonTextProps>`
  font-size: ${({ $size }) => fontSizes[$size ?? "2xl"]};
  margin: ${({ $margin }) => $margin ?? "0 0 0.75em 0"};
  font-weight: ${({ $weight }) => $weight ?? "700"};
  line-height: ${lineHeightFn};
  letter-spacing: ${letterSpacingFn};
  color: ${getColor};
`;

export const H2 = styled.h2<CommonTextProps>`
  font-size: ${({ $size }) => fontSizes[$size ?? "2xl"]};
  margin: ${({ $margin }) => $margin ?? "0 0 0.5em 0"};
  font-weight: ${({ $weight }) => $weight ?? "700"};
  line-height: ${lineHeightFn};
  letter-spacing: ${letterSpacingFn};
  color: ${getColor};
`;

export const H3 = styled.h3<CommonTextProps>`
  font-size: ${({ $size }) => fontSizes[$size ?? "m"]};
  margin: ${({ $margin }) => $margin ?? "0 0 0.25em 0"};
  font-weight: ${({ $weight }) => $weight ?? "500"};
  line-height: ${lineHeightFn};
  letter-spacing: ${letterSpacingFn};
  color: ${getColor};
`;

export const P = styled.p<CommonTextProps>`
  font-size: ${({ $size }) => fontSizes[$size ?? "2xs"]};
  font-weight: ${({ $weight }) => $weight ?? "400"};
  margin: ${marginFn};
  line-height: ${lineHeightFn};
  letter-spacing: ${letterSpacingFn};
  color: ${getColor};
`;

export const Span = styled.span<CommonTextProps>`
  font-size: ${({ $size }) => fontSizes[$size ?? "1xs"]};
  font-weight: ${({ $weight }) => $weight ?? "400"};
  margin: ${marginFn};
  line-height: ${lineHeightFn};
  letter-spacing: ${letterSpacingFn};
  color: ${getColor};
`;

export const Hr = styled.hr<{ $margin?: string }>`
  border: 1px solid var(--color-gray-100);
  width: 100%;
  margin: ${marginFn};
`;
