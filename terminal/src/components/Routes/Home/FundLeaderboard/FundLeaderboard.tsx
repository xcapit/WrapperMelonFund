import React from 'react';
import { GiCaesar, GiInfo, GiPegasus, GiSpartanHelmet, GiStorkDelivery } from 'react-icons/gi';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { getNetworkName } from '~/config';
import { useConnectionState } from '~/hooks/useConnectionState';
import { Block } from '~/storybook/Block/Block';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { SectionTitle } from '~/storybook/Title/Title';
import { useFundList } from '~/hooks/useFundList';

import { FundBadgeDirectory } from './FundBadgeDirectory';
import { MdClose } from 'react-icons/md';
import { Button } from '~/components/Form/Button/Button';

const BadgeIcon = styled.div`
  padding: 2px 10px 0px 2px;
  float: left;
  margin: 0;
  vertical-align: bottom;
`;

const BadgeText = styled.div`
  padding-left: 10px;
  float: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BadgeTextFundName = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xxl};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.otherColors.turquoise};
`;

const BadgeTextBadgeName = styled.div`
  font-size: ${(props) => props.theme.fontSizes.l};
  color: ${(props) => props.theme.mainColors.textColor};
`;

const BadgeWrapper = styled.div`
  vertical-align: middle;
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 20px;
  cursor: pointer;
`;

export const FundLeaderboard: React.FC = (props) => {
  const [showDirectory, setShowDirectory] = React.useState(false);
  const data = useFundList();
  const history = useHistory();
  const connection = useConnectionState();

  const prefix = getNetworkName(connection.network);

  const topAum = data.list.find((fund) => fund.topAUM);
  const topSinceInception = data.list.find((fund) => fund.topSinceInception);
  const topMTD = data.list.find((fund) => fund.topMTD);
  const topRecent = data.list.find((fund) => fund.topRecent);

  return (
    <Block>
      <SectionTitle>
        {!showDirectory ? (
          <>
            Melon Leaderboard
            <Button size="extrasmall" kind="secondary" onClick={() => setShowDirectory(!showDirectory)}>
              Badges
            </Button>
          </>
        ) : (
          <>
            Badges
            <Button size="extrasmall" kind="secondary" onClick={() => setShowDirectory(!showDirectory)}>
              Leaderboard
            </Button>
          </>
        )}
      </SectionTitle>

      {!showDirectory ? (
        <Grid noGap={true}>
          <GridRow>
            <GridCol xs={12} sm={6}>
              <BadgeWrapper onClick={() => topAum?.name && history.push(`/${prefix}/fund/${topAum?.address}`)}>
                <BadgeIcon>
                  <GiCaesar size="4rem" color="rgb( 133,213,202)" />
                </BadgeIcon>
                <BadgeText>
                  <BadgeTextFundName>{topAum?.name}</BadgeTextFundName>
                  <BadgeTextBadgeName>Highest AUM</BadgeTextBadgeName>
                </BadgeText>
              </BadgeWrapper>
            </GridCol>
            <GridCol xs={12} sm={6}>
              <BadgeWrapper
                onClick={() => topSinceInception?.name && history.push(`/${prefix}/fund/${topSinceInception?.address}`)}
              >
                <BadgeIcon>
                  <GiSpartanHelmet size="4rem" color="rgb( 133,213,202)" />
                </BadgeIcon>
                <BadgeText>
                  <BadgeTextFundName>{topSinceInception?.name}</BadgeTextFundName>
                  <BadgeTextBadgeName>Best since inception </BadgeTextBadgeName>
                </BadgeText>
              </BadgeWrapper>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol xs={12} sm={6}>
              <BadgeWrapper onClick={() => topMTD?.name && history.push(`/${prefix}/fund/${topMTD?.address}`)}>
                <BadgeIcon>
                  <GiPegasus size="4rem" color="rgb( 133,213,202)" />
                </BadgeIcon>
                <BadgeText>
                  <BadgeTextFundName>{topMTD?.name}</BadgeTextFundName>
                  <BadgeTextBadgeName>Best MTD performance</BadgeTextBadgeName>
                </BadgeText>
              </BadgeWrapper>
            </GridCol>
            <GridCol xs={12} sm={6}>
              <BadgeWrapper onClick={() => topRecent?.name && history.push(`/${prefix}/fund/${topRecent?.address}`)}>
                <BadgeIcon>
                  <GiStorkDelivery size="4rem" color="rgb( 133,213,202)" />
                </BadgeIcon>
                <BadgeText>
                  <BadgeTextFundName>{topRecent?.name}</BadgeTextFundName>
                  <BadgeTextBadgeName>Newest launch</BadgeTextBadgeName>
                </BadgeText>
              </BadgeWrapper>
            </GridCol>
          </GridRow>
        </Grid>
      ) : (
        <FundBadgeDirectory />
      )}
    </Block>
  );
};
