import React from 'react';
import { useLocation } from 'react-router';
import { usePriceFeedUpdateQuery } from '~/components/Layout/PriceFeedUpdate.query';
import { Link, NavLink } from '~/storybook/Link/Link';
import { useAccount } from '~/hooks/useAccount';
import { Skeleton, SkeletonHead, SkeletonBody, SkeletonFeet } from '~/storybook/Skeleton/Skeleton';
import {
  Header as HeaderContainer,
  HeaderContent,
  LogoContainer,
  ConnectionInfo,
  ConnectionInfoItem,
  HeaderTitle,
  LogoDesktop,
  LogoMobile,
  CurrencySelectionItem,
} from '~/storybook/Header/Header';
import { CurrencySelector } from './CurrencySelector/CurrencySelector';
import { Footer, FooterNavigation, FooterItem } from '~/storybook/Footer/Footer';
import { Logo } from '~/storybook/Logo/Logo';
import { ConnectionSelector } from './ConnectionSelector/ConnectionSelector';
import { useEnvironment } from '~/hooks/useEnvironment';

import { NetworkEnum } from '~/types';
import { useVersionQuery } from '~/components/Layout/Version.query';
import * as S from './Layout.styles';
import { DarkModeSwitch } from '~/storybook/DarkModeSwitch/DarkModeSwitch';
import { FormattedDate } from '../Common/FormattedDate/FormattedDate';
import { useConnectionState } from '~/hooks/useConnectionState';
import { getNetworkName } from '~/config';

export interface LayoutProps {
  connectionSwitch: boolean;
}

export const Layout: React.FC<LayoutProps> = (props) => {
  const location = useLocation()!;
  const [update] = usePriceFeedUpdateQuery();
  const environment = useEnvironment();
  const account = useAccount();
  const [version] = useVersionQuery();
  const connection = useConnectionState();
  const prefix = getNetworkName(connection.network);

  const home = location.pathname === '/';

  return (
    <Skeleton>
      <SkeletonHead>
        <HeaderContainer>
          <HeaderContent>
            <HeaderTitle>
              <Link to="/">
                {!home && <S.Icons name="LEFTARROW" size="small" colored={true} />}
                <S.AppName>Melon Terminal</S.AppName>
              </Link>
            </HeaderTitle>
            <LogoContainer>
              <Link to="/">
                <LogoDesktop>
                  <Logo name="with-bottom-text" size="small" />
                </LogoDesktop>
                <LogoMobile>
                  <Logo name="with-bottom-text" size="small" />
                </LogoMobile>
              </Link>
            </LogoContainer>
            <ConnectionInfo>
              <DarkModeSwitch />
              {!account.loading && account.fund && prefix && (
                <ConnectionInfoItem>
                  <NavLink
                    to={`/${prefix}/fund/${account.fund.toLowerCase()}`}
                    title={account.fund}
                    activeClassName="active"
                  >
                    My Fund
                  </NavLink>
                </ConnectionInfoItem>
              )}

              {!account.loading && !account.fund && account.address && (
                <ConnectionInfoItem>
                  <NavLink to={`/wallet/setup`} title={account.fund} activeClassName="active" exact={true}>
                    Create a Fund
                  </NavLink>
                </ConnectionInfoItem>
              )}

              {account.address && (
                <ConnectionInfoItem>
                  <NavLink to="/wallet" title={account.address} activeClassName="active" exact={true}>
                    My Wallet
                  </NavLink>
                </ConnectionInfoItem>
              )}

              <CurrencySelectionItem>
                <CurrencySelector />
              </CurrencySelectionItem>

              {props.connectionSwitch && (
                <ConnectionInfoItem>
                  <ConnectionSelector />
                </ConnectionInfoItem>
              )}
            </ConnectionInfo>
          </HeaderContent>
        </HeaderContainer>
      </SkeletonHead>
      <SkeletonBody>{props.children}</SkeletonBody>
      <SkeletonFeet>
        <Footer>
          <FooterNavigation>
            <FooterItem>
              <a href="https://melonprotocol.com" target="_blank">
                About
              </a>
            </FooterItem>
            <FooterItem>
              <a href="https://docs.melonprotocol.com" target="_blank">
                Documentation
              </a>
            </FooterItem>
            <FooterItem>
              <a href="https://github.com/avantgardefinance/interface/issues" target="_blank">
                Report an Issue
              </a>
            </FooterItem>

            {update && (
              <FooterItem>
                <span>
                  Last pricefeed update at <FormattedDate timestamp={update} />
                </span>
              </FooterItem>
            )}

            {environment?.network && <FooterItem>{NetworkEnum[environment.network]}</FooterItem>}

            {version && <FooterItem>Protocol {version.name}</FooterItem>}
          </FooterNavigation>
        </Footer>
      </SkeletonFeet>
    </Skeleton>
  );
};
