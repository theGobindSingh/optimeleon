import { ClerkProvider } from "@clerk/nextjs";
import { Global } from "@emotion/react";
import { ThemeProvider } from "@kami-ui/next-theme";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { globalStyles } from "@styles/global";
import { kuiTheme, muiTheme } from "@styles/theme";
import type { AppProps } from "next/app";
import { Bounce, ToastContainer } from "react-toastify";

// const publishableKey = (await getSecret("NEXT_PUBLIC_CLERK_PUBLISHABLE"))!;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider>
      <ThemeProvider theme={kuiTheme}>
        <MuiThemeProvider theme={muiTheme}>
          <AppCacheProvider>
            {/* insert your copied script tag here */}
            <Global styles={globalStyles} />
            <Component {...pageProps} />
            <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              transition={Bounce}
            />
          </AppCacheProvider>
        </MuiThemeProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default App;
