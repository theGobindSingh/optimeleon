import {
  containerSize,
  containerStyles,
  wrapperStyles,
} from "@components/common-full-width-wrapper/styles";
import {
  FullWidthWrapper,
  FullWidthWrapperProps,
} from "@kami-ui/react-components";
import { forwardRef, PropsWithChildren, Ref } from "react";

interface CommonFullWidthWrapperProps {
  className?: string;
  element?: FullWidthWrapperProps["element"];
  wrapperCss?: FullWidthWrapperProps["wrapperCss"];
  wrapperClassName?: FullWidthWrapperProps["wrapperClassName"];
  bg?: string;
}

const CommonFullWidthWrapperWithoutRef = (
  {
    className,
    children,
    element = "section",
    wrapperCss,
    wrapperClassName,
    bg,
  }: PropsWithChildren<CommonFullWidthWrapperProps>,
  ref: Ref<HTMLElement>,
) => (
  <FullWidthWrapper
    wrapperClassName={wrapperClassName!}
    className={className}
    css={containerStyles}
    wrapperCss={[wrapperStyles(bg), wrapperCss] as any}
    containerSize={containerSize}
    element={element}
    ref={ref}
  >
    {children}
  </FullWidthWrapper>
);

const CommonFullWidthWrapper = forwardRef(CommonFullWidthWrapperWithoutRef);
export default CommonFullWidthWrapper;
