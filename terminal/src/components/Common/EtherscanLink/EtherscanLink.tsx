import React from 'react';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { toChecksumAddress, isAddress } from 'web3-utils';
import styled from 'styled-components';

export interface EtherscanLinkProps {
  address?: string;
  hash?: string;
  inline?: boolean;
}

const OverflowEllipsis = styled.a`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  cursor: pointer;
`;

export const EtherscanLink: React.FC<EtherscanLinkProps> = (props) => {
  const args: EtherscanLinkProps = {
    ...(props.address && { address: isAddress(props.address) ? toChecksumAddress(props.address) : props.address }),
    ...(props.hash && { hash: props.hash }),
  };

  const link = useEtherscanLink(args);

  return !props.inline ? (
    <OverflowEllipsis href={link!} target="_blank">
      {props.children || args.address || args.hash}
    </OverflowEllipsis>
  ) : (
    <a href={link!} target="_blank">
      {props.children || args.address || args.hash}
    </a>
  );
};
