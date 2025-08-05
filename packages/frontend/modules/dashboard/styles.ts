import CommonFullWidthWrapper from "@components/common-full-width-wrapper";
import { H1 } from "@components/html";
import styled from "@emotion/styled";

export const DashboardWrapper = styled(CommonFullWidthWrapper)`
  height: 100dvh;
  width: 100dvw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-900);

  .header {
    width: 100%;
    padding: 1rem;
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100dvw;
      height: 1px;
      z-index: 1;
      background-color: var(--color-background-200);
    }
  }

  .main {
    gap: 1rem;
    width: 100%;
    height: 100%;
    padding: 2rem;
    display: grid;
    overflow-y: auto;
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const DashboardTitle = styled(H1)``;
