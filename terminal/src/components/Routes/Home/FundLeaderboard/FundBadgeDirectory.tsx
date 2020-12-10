import React from 'react';
import {
  GiCaesar,
  GiChariot,
  GiIcarus,
  GiMedusaHead,
  GiPadlock,
  GiPalisade,
  GiPegasus,
  GiSpartanHelmet,
  GiStorkDelivery,
  GiWingfoot,
} from 'react-icons/gi';
import styled from 'styled-components';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';

const BadgeIcon = styled.div`
  padding-top: 2px;
  padding-left: 2px;
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
  font-size: ${(props) => props.theme.fontSizes.l};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BadgeTextBadgeName = styled.div`
  font-size: ${(props) => props.theme.fontSizes.s};
  color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
`;

const BadgeWrapper = styled.div`
  vertical-align: middle;
  width: 100%;
  display: flex;
  align-items: center;
`;

const badges = [
  { name: 'Caesar', description: 'Top 5 AUM', icon: <GiCaesar size="2rem" color="rgb(133,213,202)" /> },
  {
    name: 'Spartan',
    description: 'Top 5 performance since inception',
    icon: <GiSpartanHelmet size="2rem" color="rgb(133,213,202)" />,
  },
  { name: 'Pegasus', description: 'Top 5 performance MTD', icon: <GiPegasus size="2rem" color="rgb(133,213,202)" /> },
  {
    name: 'Mercury',
    description: 'Large fund (> 100 ETH)',
    icon: <GiWingfoot size="2rem" color="rgb(133,213,202)" />,
  },
  {
    name: 'Chariot',
    description: 'Top 5 funds with most investors',
    icon: <GiChariot size="2rem" color="rgb(133,213,202)" />,
  },
  { name: 'Stork', description: '5 most recent funds', icon: <GiStorkDelivery size="2rem" color="rgb(133,213,202)" /> },
  { name: 'Palisade', description: 'Fund operating a whitelist', icon: <GiPalisade size="2rem" /> },
  { name: 'Padlock', description: 'Fund closed', icon: <GiPadlock size="2rem" /> },
  { name: 'Icarus', description: 'Underperforming fund', icon: <GiIcarus size="2rem" color="rgb(255,141,136)" /> },
  {
    name: 'Medusa',
    description: 'Tiny fund (< 1 ETH)',
    icon: <GiMedusaHead size="2rem" color="rgb(255,141,136)" />,
  },
];

export const FundBadgeDirectory: React.FC = () => {
  return (
    <Grid noGap={true}>
      <GridRow noGap={true}>
        {badges.map((badge) => (
          <>
            <GridCol xs={12} sm={6}>
              <BadgeWrapper>
                <BadgeIcon>{badge.icon}</BadgeIcon>
                <BadgeText>
                  <BadgeTextFundName>{badge.name}</BadgeTextFundName>
                  <BadgeTextBadgeName>{badge.description}</BadgeTextBadgeName>
                </BadgeText>
              </BadgeWrapper>
            </GridCol>
          </>
        ))}
      </GridRow>
    </Grid>
  );
};
