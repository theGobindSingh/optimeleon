import { ClerkProvider } from "@clerk/nextjs";
import { Global } from "@emotion/react";
import { ThemeProvider } from "@kami-ui/next-theme";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { globalStyles } from "@styles/global";
import { kuiTheme, muiTheme } from "@styles/theme";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => (
  <ClerkProvider>
    <ThemeProvider theme={kuiTheme}>
      <MuiThemeProvider theme={muiTheme}>
        <AppCacheProvider>
          <Global styles={globalStyles} />
          <Component {...pageProps} />
        </AppCacheProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  </ClerkProvider>
);

export default App;
