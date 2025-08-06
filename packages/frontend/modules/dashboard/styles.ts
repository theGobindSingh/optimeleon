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
    padding: 1rem 1rem;
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .first {
      margin-right: auto;
    }
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
    padding: 2rem 1rem;
    display: grid;
    overflow-y: auto;
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const DashboardTitle = styled(H1)``;

export const ProjectWrapper = styled.div`
  padding: 1rem;
  border: 2px solid var(--color-text-700);
  border-radius: 6px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    color: var(--color-text-700);
    border: 2px solid var(--color-text-700);
    border-radius: 8px;
    scale: 102.5%;
  }

  & > * {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .del-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    color: var(--color-text-700);
    transition: all 0.3s ease;
    font-size: 1rem;
    background-color: var(--color-background-200);
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid var(--color-text-700);
    transform: translate(50%, -50%) scale(0%);
    /* transform-origin: top right; */
    /* scale: 0%; */

    * {
      color: inherit;
      font-size: inherit;
    }
  }
  &:hover {
    .del-wrapper {
      transform: translate(50%, -50%) scale(100%);
    }
  }
`;

export const DialogContainer = styled.div`
  background-color: var(--color-background-300);
  padding: 1rem;
  color: var(--color-text-100);
  font-size: var(--fs-2xs);
  & > * > * {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const IgnoredPathsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .ip-heading {
    font-weight: 600;
    color: var(--color-text-100);
  }

  .ignored-paths {
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0;
  }

  .path {
    cursor: not-allowed;
  }
`;
