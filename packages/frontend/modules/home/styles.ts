import { H1 } from "@components/html";
import styled from "@emotion/styled";

export const HomeWrapper = styled.div`
  height: 100dvh;
  width: 100dvw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-100);
  color: var(--color-text-900);
`;

export const HomeTitle = styled(H1)``;
