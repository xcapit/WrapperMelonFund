import styled, { css } from 'styled-components';

export interface ContainerProps {
  full?: boolean;
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  display: block;
  width: 100%;
  margin: 0 auto;
  padding: 0px ${(props) => props.theme.spaceUnits.m};
  @media (${(props) => props.theme.mediaQueries.s}) {
    max-width: ${(props) => props.theme.container.s};
    ${(props) =>
      props.full &&
      css`
        max-width: 100%;
      `}
  }

  @media (${(props) => props.theme.mediaQueries.m}) {
    max-width: ${(props) => props.theme.container.m};
    ${(props) =>
      props.full &&
      css`
        max-width: 100%;
      `}
  }

  @media (${(props) => props.theme.mediaQueries.l}) {
    max-width: ${(props) => props.theme.container.l};
    ${(props) =>
      props.full &&
      css`
        max-width: 100%;
      `}
  }
  @media (${(props) => props.theme.mediaQueries.xl}) {
    max-width: ${(props) => props.theme.container.xl};
    ${(props) =>
      props.full &&
      css`
        max-width: 100%;
      `}
  }

  ${(props) =>
    props.full &&
    css`
      max-width: 100%;
    `}
`;
