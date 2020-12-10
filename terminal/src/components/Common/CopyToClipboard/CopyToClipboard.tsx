import React, { useState } from 'react';
// @ts-ignore
import { CopyToClipboard as Copy } from 'react-copy-to-clipboard';
import { Tooltip } from '~/storybook/Tooltip/Tooltip';
import * as S from './CopyToClipboard.styled';

interface CopyToClipboardProps {
  text?: string;
  value?: string;
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text, value }) => {
  const [message, setMessage] = useState('Click to copy!');

  return (
    <Tooltip value={message}>
      <Copy text={value} onCopy={() => setMessage('Copied!')} onMouseLeave={() => setMessage('Click to copy!')}>
        <S.Span>{text}</S.Span>
      </Copy>
    </Tooltip>
  );
};
