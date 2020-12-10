import React from 'react';
import * as S from './Title.styles';
import { TooltipContainer } from '../Tooltip/Tooltip.styles';
import { Tooltip } from '../Tooltip/Tooltip';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { SelectProps, SelectField } from '~/components/Form/Select/Select';

interface SectionTitleProps {
  tooltip?: string;
  select?: SelectProps;
  placement?:
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
}

export const SectionTitle: React.FC<SectionTitleProps> = (props) => {
  return (
    <>
      {props.tooltip ? (
        <S.SectionTitleContainer>
          <S.Title>{props.children}</S.Title>
          <TooltipContainer>
            <Tooltip placement={props.placement} value={props.tooltip}>
              <FaRegQuestionCircle />
            </Tooltip>
          </TooltipContainer>
        </S.SectionTitleContainer>
      ) : (
        <S.SectionTitle>{props.children}</S.SectionTitle>
      )}
    </>
  );
};

export const Title: React.FC = (props) => {
  return <S.Title>{props.children}</S.Title>;
};

export const Subtitle: React.FC = (props) => {
  return <S.Subtitle>{props.children}</S.Subtitle>;
};
