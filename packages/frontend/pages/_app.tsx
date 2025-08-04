import { Global } from "@emotion/react";
import { ThemeProvider } from "@kami-ui/next-theme";
import { globalStyles } from "@styles/global";
import theme from "@styles/theme";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <Global styles={globalStyles} />
    <Component {...pageProps} />
  </ThemeProvider>
);

export default App;
