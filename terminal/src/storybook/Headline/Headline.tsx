import React from 'react';
import { Title } from '../Title/Title';
import * as H from './Headline.styles';
import { Icons } from '../Icons/Icons';

export interface HeadlineProps {
  title: string | React.ReactNode;
  text?: React.ReactNode;
  icon?: 'WALLET' | 'ETHEREUM';
  badges?: JSX.Element[];
}

export const Headline: React.FC<HeadlineProps> = (props) => {
  return (
    <H.Headline>
      {props.icon && (
        <H.HeadlineIcon>
          <Icons name={props.icon} colored={true} />
        </H.HeadlineIcon>
      )}
      <H.HeadlineText>
        <Title>
          {props.title}{' '}
          {props.badges?.map((badge, index) => (
            <React.Fragment key={index}>{badge}</React.Fragment>
          ))}
        </Title>
        {props.text && <H.HeadlineSideInfo>{props.text}</H.HeadlineSideInfo>}
      </H.HeadlineText>
    </H.Headline>
  );
};
