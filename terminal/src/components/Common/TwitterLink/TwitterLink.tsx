import React from 'react';
import { Icons } from '~/storybook/Icons/Icons';

export interface TwitterLinkProps {
  text: string;
}

export const TwitterLink: React.FC<TwitterLinkProps> = ({ text }) => {
  return (
    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`} target="_blank">
      <Icons name="TWITTER" size="small" colored={true} />
    </a>
  );
};
