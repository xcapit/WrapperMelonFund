import styled, { css } from 'styled-components';

const TitleBase = css`
  position: relative;
  margin-bottom: ${(props) => props.theme.spaceUnits.xs};
  font-weight: 600;
`;

export const Title = styled.h1`
  ${TitleBase}
  font-size: ${(props) => props.theme.fontSizes.xl};
  white-space: nowrap;
`;

export const Subtitle = styled.h3`
  ${TitleBase}
  font-size: ${(props) => props.theme.fontSizes.l};
  font-weight: normal;
  border-bottom: none;
  padding-bottom: 0;
`;

export const SectionTitle = styled.h2`
  ${TitleBase}
  font-size: ${(props) => props.theme.fontSizes.xl};
  white-space: nowrap;
  padding-bottom: ${(props) => props.theme.spaceUnits.xs};
  border-bottom : ${(props) => props.theme.border.borderSecondary};
  margin-bottom: ${(props) => props.theme.spaceUnits.m};
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  @media (${(props) => props.theme.mediaQueries.s}) {
    display: flex;
    justify-content: space-between;
  }
`;

// if you need to put something next to a Section Title, put the title and that thing in this container
export const SectionTitleContainer = styled.div`
  border-bottom: ${(props) => props.theme.border.borderSecondary};
  margin-bottom: ${(props) => props.theme.spaceUnits.m};
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: baseline;
`;

export const ComponentContainer = styled.div``;
