import React, { Suspense } from 'react';
import ErrorBoundary from 'react-error-boundary';
import * as S from './Icons.styles';

const availableIcons = {
  ANT: React.lazy(() => import('./svg/tokens/Ant')),
  ANTv2: React.lazy(() => import('./svg/tokens/Ant')),
  BAT: React.lazy(() => import('./svg/tokens/Bat')),
  DAI: React.lazy(() => import('./svg/tokens/Dai')),
  ENG: React.lazy(() => import('./svg/tokens/Eng')),
  KNC: React.lazy(() => import('./svg/tokens/Knc')),
  LINK: React.lazy(() => import('./svg/tokens/Link')),
  MANA: React.lazy(() => import('./svg/tokens/Mana')),
  MKR: React.lazy(() => import('./svg/tokens/Mkr')),
  MLN: React.lazy(() => import('./svg/tokens/Mln')),
  OMG: React.lazy(() => import('./svg/tokens/Omg')),
  REN: React.lazy(() => import('./svg/tokens/Ren')),
  REP: React.lazy(() => import('./svg/tokens/Rep')),
  RLC: React.lazy(() => import('./svg/tokens/Rlc')),
  SAI: React.lazy(() => import('./svg/tokens/Sai')),
  USDC: React.lazy(() => import('./svg/tokens/Usdc')),
  USDT: React.lazy(() => import('./svg/tokens/Usdt')),
  UNI: React.lazy(() => import('./svg/tokens/Uni')),
  WBTC: React.lazy(() => import('./svg/tokens/Wbtc')),
  WETH: React.lazy(() => import('./svg/tokens/Weth')),
  ZRX: React.lazy(() => import('./svg/tokens/Zrx')),
  DGX: React.lazy(() => import('./svg/tokens/Dgx')),
  EUR: React.lazy(() => import('./svg/tokens/Eur')),
  DAPPER: React.lazy(() => import('./svg/tokens/Dapper')),
  METAMASK: React.lazy(() => import('./svg/wallet/Metamask')),
  FRAME: React.lazy(() => import('./svg/wallet/Frame')),
  GANACHE: React.lazy(() => import('./svg/wallet/Ganache')),
  TWITTER: React.lazy(() => import('./svg/socialNetwork/Twitter')),
  LEFTARROW: React.lazy(() => import('./svg/LeftArrow')),
  SWAPARROWS: React.lazy(() => import('./svg/SwapArrows')),
  EXCHANGE: React.lazy(() => import('./svg/Exchange')),
  FORTMATIC: React.lazy(() => import('./svg/wallet/Fortmatic')),
  WALLETCONNECT: React.lazy(() => import('./svg/wallet/WalletConnect')),
  SUN: React.lazy(() => import('./svg/Sun')),
  MOON: React.lazy(() => import('./svg/Moon')),
  ETHEREUM: React.lazy(() => import('./svg/Ethereum')),
  ETHER: React.lazy(() => import('./svg/Ethereum')),
  WALLET: React.lazy(() => import('./svg/Wallet')),
};

export type IconName = keyof typeof availableIcons;

export type IconsProps = React.ComponentProps<typeof S.IconsWrapper> & {
  name: IconName;
  size?: 'normal' | 'medium' | 'small';
  pointer?: boolean;
};

const FallbackRenderNull: React.FC = () => null;

export const Icons: React.FC<IconsProps> = ({ name, size = 'normal', pointer, ...props }) => {
  const Component = availableIcons[name];

  return (
    <S.IconsWrapper {...props} size={size} pointer={pointer}>
      <ErrorBoundary FallbackComponent={FallbackRenderNull}>
        <Suspense fallback={<S.Loading />}>
          <Component />
        </Suspense>
      </ErrorBoundary>
    </S.IconsWrapper>
  );
};
