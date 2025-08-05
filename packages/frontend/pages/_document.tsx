import {
  documentGetInitialProps,
  DocumentHeadTags,
} from "@mui/material-nextjs/v15-pagesRouter";
import { DocumentContext, Head, Html, Main, NextScript } from "next/document";

const Document = (props: any) => (
  <Html lang="en">
    <Head>
      <DocumentHeadTags {...props} />
    </Head>
    <body className="">
      <Main />
      <NextScript />
    </body>
  </Html>
);

Document.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};

export default Document;
