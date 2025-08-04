/* eslint-disable camelcase -- fonts */
import { defaultLightTheme } from "@kami-ui/theme-shop";
import { ThemeObject } from "@kami-ui/types";
import { breakpoints } from "@styles/global";
import {
  DM_Mono,
  Inter,
  Nothing_You_Could_Do,
  Poppins,
} from "next/font/google";

const fontSansSerif = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const fontMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
});

const fontSans = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const fontCursive = Nothing_You_Could_Do({
  weight: ["400"],
  subsets: ["latin"],
});

const theme: ThemeObject = {
  ...defaultLightTheme,
  typography: {
    fontSizes: [
      {
        breakpoint: {
          min: `${breakpoints.desktop.min}px`,
          max: `${breakpoints.desktop.max}px`,
        },
        size: [
          "0.75rem", // 12px
          "0.875rem", // 14px
          "1rem", // 16px
          "1.125rem", // 18px
          "1.25rem", // 20px
          "1.5rem", // 24px
          "1.875rem", // 30px
          "2.25rem", // 36px
          "2.75rem", // 44px
          "3.25rem", // 52px
          "3.75rem", // 60px
        ],
      },
      {
        breakpoint: {
          min: `${breakpoints.phone.min}px`,
          max: `${breakpoints.tablet.max}px`,
        },
        size: [
          "0.68rem", // 11px
          "0.75rem", // 12px
          "0.875rem", // 14px
          "1rem", // 16px
          "1.125rem", // 18px
          "1.25rem", // 20px
          "1.5rem", // 24px
          "1.875rem", // 30px
          "2.25rem", // 36px
          "2.75rem", // 44px
          "3.25rem", // 52px
        ],
      },
    ],
    fontFamilies: {
      serif: fontSansSerif.style.fontFamily,
      sans: fontSans.style.fontFamily,
      mono: fontMono.style.fontFamily,
      cursive: fontCursive.style.fontFamily,
    },
  },
};

export default theme;
