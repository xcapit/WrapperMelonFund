import * as React from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import styled, { css } from 'styled-components';
import { BarContent } from '../Bar/Bar';

export interface AccordionBarProps {
  active: boolean;
}

export const AccordionSectionContent = styled(BarContent)<AccordionBarProps>`
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spaceUnits.s};
  margin-bottom: ${(props) => props.theme.spaceUnits.s};
  ${(props) => {
    if (props.active) {
      return css`
        background-color: ${(props) => props.theme.mainColors.secondary};
      `;
    }
  }}
  :hover {
    background-color: ${(props) => props.theme.mainColors.secondary};
    cursor: pointer;
  }
`;

export interface AccordionSectionProps {
  label: string;
  value: string;
  activeSections: string[];
  sectionSelector: (section: any) => void;
}

export function AccordionSection(props: AccordionSectionProps) {
  return (
    <AccordionSectionContent
      active={props.activeSections.includes(props.value)}
      onClick={() => props.sectionSelector(props.value)}
    >
      {props.label}
      {props.activeSections.includes(props.value) ? <FaChevronDown /> : <FaChevronRight />}
    </AccordionSectionContent>
  );
}
