import styled from 'styled-components';

export interface HeadlineIconProps {
  icon?: string;
}

export const Headline = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const HeadlineIcon = styled.div<HeadlineIconProps>`
  min-width: 50px;
  width: 50px;
  height: 50px;
  justify-content: center;
  display: flex;
  align-items: center;
`;

export const HeadlineText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;
export const HeadlineSideInfo = styled.div`
  margin-bottom: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
