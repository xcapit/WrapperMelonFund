import styled from 'styled-components';

export interface ContainerProps {
  position: 'center' | 'flex-start' | 'flex-end';
}

export const Container = styled.ul<ContainerProps>`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${(props) => props.position};
  align-items: center;
  font-size: 16px;
`;

export interface LiProps {
  selected?: boolean;
  color?: string;
}

export const Li = styled.li<LiProps>`
  ${(props) => props.selected && 'font-weight: bold;'}
  ${(props) => props.selected && `border-bottom: 1px solid ${props.color};`}
  ${(props) => props.selected && `color: ${props.color};`}
  margin-right: 1px;
  padding-top: 1px;
  min-width: 30px;
  min-height: 30px;
  align-items: center;
  display: flex;
  justify-content: center;
  cursor: pointer;
  :hover {
    border: 1px solid ${(props) => props.color};
  }
`;
