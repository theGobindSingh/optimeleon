/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain -- not be null */
/* eslint-disable camelcase -- fonts */
import { acapulcoTheaDarkTheme } from "@kami-ui/theme-shop";
import { ThemeObject } from "@kami-ui/types";
import { type PaletteColorOptions, createTheme } from "@mui/material/styles";
import { DM_Mono, Inter, Nothing_You_Could_Do, Outfit } from "next/font/google";

const fontSansSerif = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const fontMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
});

const fontSans = Outfit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const fontCursive = Nothing_You_Could_Do({
  weight: ["400"],
  subsets: ["latin"],
});

export const kuiTheme: ThemeObject = {
  ...acapulcoTheaDarkTheme,
  typography: {
    fontSizes: [],
    ...(acapulcoTheaDarkTheme.typography ?? {}),
    fontFamilies: {
      serif: fontSansSerif.style.fontFamily,
      sans: fontSans.style.fontFamily,
      mono: fontMono.style.fontFamily,
      cursive: fontCursive.style.fontFamily,
    },
  },
};

const getPaletteColors = (
  key: keyof typeof acapulcoTheaDarkTheme.colors,
): PaletteColorOptions => {
  const colors = acapulcoTheaDarkTheme.colors?.[key];
  if (!colors) {
    throw new Error(`Color key "${key}" not found in theme colors.`);
  }
  return {
    "50": colors?.[0]!,
    "100": colors?.[1]!,
    "200": colors?.[2]!,
    "300": colors?.[3]!,
    "400": colors?.[4]!,
    "500": colors?.[5]!,
    "600": colors?.[6]!,
    "700": colors?.[7]!,
    "800": colors?.[8]!,
    "900": colors?.[9]!,
  };
};

export const muiTheme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: acapulcoTheaDarkTheme.colors.primary[5]!,
      ...getPaletteColors("primary"),
    },
    secondary: {
      main: acapulcoTheaDarkTheme.colors.secondary[5]!,
      ...getPaletteColors("secondary"),
    },
    background: {
      default: acapulcoTheaDarkTheme.colors.background?.[0]!,
      paper: acapulcoTheaDarkTheme.colors.background?.[1]!,
    },
    error: {
      main: acapulcoTheaDarkTheme.colors.error?.[5]!,
      ...getPaletteColors("error"),
    },
    success: {
      main: acapulcoTheaDarkTheme.colors.success?.[5]!,
      ...getPaletteColors("success"),
    },
    warning: {
      main: acapulcoTheaDarkTheme.colors.warning?.[5]!,
      ...getPaletteColors("warning"),
    },
    info: {
      main: acapulcoTheaDarkTheme.colors.info?.[5]!,
      ...getPaletteColors("info"),
    },
  },
  typography: {
    fontFamily: fontSansSerif.style.fontFamily,
    h1: {
      fontFamily: fontSans.style.fontFamily,
    },
    h2: {
      fontFamily: fontSans.style.fontFamily,
    },
    h3: {
      fontFamily: fontSans.style.fontFamily,
    },
    h4: {
      fontFamily: fontSans.style.fontFamily,
    },
    h5: {
      fontFamily: fontSans.style.fontFamily,
    },
    h6: {
      fontFamily: fontSans.style.fontFamily,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        size: "small",
        sx: {
          fontSize: "var(--fs-2xs)",
        },
      },
    },
  },
});
