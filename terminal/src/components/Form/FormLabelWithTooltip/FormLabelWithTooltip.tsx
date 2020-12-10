import React from 'react';
import * as S from './FormLabelWithTooltip.styles';
import { Tooltip } from '~/storybook/Tooltip/Tooltip';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { TooltipContainer } from '~/storybook/Tooltip/Tooltip.styles';

export interface FormLabelWithTooltipProps {
  label: string | JSX.Element;
  tooltipPlacement:
    | 'auto'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'auto-start'
    | 'auto-end'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end'
    | undefined;
  tooltipValue: string;
}

export const FormLabelWithTooltip: React.FC<FormLabelWithTooltipProps> = (props) => {
  return (
    <S.FormLabelTooltipContainer>
      {props.label}
      <TooltipContainer>
        <Tooltip placement={props.tooltipPlacement} value={props.tooltipValue}>
          <FaRegQuestionCircle />
        </Tooltip>
      </TooltipContainer>
    </S.FormLabelTooltipContainer>
  );
};
