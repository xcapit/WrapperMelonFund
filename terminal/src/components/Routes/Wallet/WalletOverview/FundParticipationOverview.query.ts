import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useTheGraphQuery } from '~/hooks/useQuery';
import { calculateChangeFromSharePrice } from '~/utils/calculateChangeFromSharePrice';
import { Address } from '@melonproject/melonjs';

interface FundFields {
  id: string;
  name: string;
  gav: BigNumber;
  sharePrice: BigNumber;
  totalSupply: BigNumber;
  isShutdown: boolean;
  createdAt: number;
  manager: string;
  participation: {
    id: string;
  };
  trading: {
    id: string;
  };
  version: {
    id: string;
    name: string;
  };
  accounting: {
    id: string;
    ownedAssets: {
      id: string;
    }[];
  };
  calculationsHistory: {
    id: string;
    sharePrice: BigNumber;
    timestamp: string;
  }[];
}

interface InvestmentRequestFields {
  id: string;
  amount: BigNumber;
  shares: BigNumber;
  requestTimestamp: number;
  fund: FundFields;
  asset: {
    id: string;
    symbol: string;
  };
}

export interface InvestmentRequest extends Fund {
  requestAsset: string;
  requestShares: BigNumber;
  requestAmount: BigNumber;
  requestCreatedAt: number;
  account?: string;
}

export interface Fund {
  name: string;
  address: string;
  inception: number;
  gav?: BigNumber;
  isShutDown?: boolean;
  sharePrice: BigNumber;
  version: string;
  versionAddress: string;
  participationAddress: string;
  tradingAddress: string;
  accountingAddress: string;
  ownedAssets: string[];
  manager: string;
  change: BigNumber;
  shares?: BigNumber;
}

export interface SharePrice {
  sharePrice: string;
}

export interface FundParticipationOverviewQueryResult {
  fundManager: {
    funds: FundFields[];
  };
  investor: {
    investments: {
      fund: FundFields;
    }[];
    investmentRequests: InvestmentRequestFields[];
  };
}

export interface FundParticipationOverviewQueryVariables {
  investor?: Address;
}

const FundParticipationOverviewQuery = gql`
  fragment FundParticipationFragment on Fund {
    id
    name
    createdAt
    sharePrice
    gav
    totalSupply
    isShutdown
    calculationsHistory(orderBy: timestamp, orderDirection: desc, first: 2) {
      id
      sharePrice
      timestamp
    }
    version {
      id
      name
    }
    participation {
      id
    }
    trading {
      id
    }
    accounting {
      id
      ownedAssets {
        id
      }
    }
  }
  query FundParticipationOverviewQuery($investor: ID!) {
    fundManager(id: $investor) {
      funds {
        ...FundParticipationFragment
      }
    }
    investor(id: $investor) {
      investments {
        fund {
          ...FundParticipationFragment
        }
      }
      investmentRequests(where: { status: "PENDING" }) {
        id
        amount
        shares
        requestTimestamp
        fund {
          ...FundParticipationFragment
        }
        asset {
          id
          symbol
        }
      }
    }
  }
`;

export const useFundParticipationOverviewQuery = (investor?: Address) => {
  const result = useTheGraphQuery<FundParticipationOverviewQueryResult, FundParticipationOverviewQueryVariables>(
    FundParticipationOverviewQuery,
    {
      variables: { investor: investor && investor.toLowerCase() },
      skip: !investor,
    }
  );

  const investments = (result && result.data && result.data.investor && result.data.investor.investments) || [];
  const investmentsProcessed = investments.map((item) => {
    const output: Fund = {
      address: item.fund.id,
      name: item.fund.name,
      inception: item.fund.createdAt,
      sharePrice: item.fund.sharePrice,
      version: item.fund.version.name,
      versionAddress: item.fund.version.id,
      participationAddress: item.fund.participation.id,
      tradingAddress: item.fund.trading.id,
      accountingAddress: item.fund.accounting.id,
      ownedAssets: (item.fund.accounting.ownedAssets || []).map((asset) => asset.id),
      manager: item.fund.manager,
      gav: item.fund.gav,
      change: calculateChangeFromSharePrice(
        item.fund.calculationsHistory[0]?.sharePrice,
        item.fund.calculationsHistory[1]?.sharePrice
      ),
      shares: item.fund.totalSupply,
      isShutDown: item.fund.isShutdown,
    };

    return output;
  });

  const investmentRequests =
    (result && result.data && result.data.investor && result.data.investor.investmentRequests) || [];
  const investmentRequestsProcessed = investmentRequests.map((item) => {
    const output: InvestmentRequest = {
      address: item.fund.id,
      name: item.fund.name,
      inception: item.fund.createdAt,
      requestCreatedAt: item.requestTimestamp,
      requestShares: item.shares,
      requestAmount: item.amount,
      requestAsset: item.asset.symbol,
      sharePrice: item.fund.sharePrice,
      version: item.fund.version.name,
      versionAddress: item.fund.version.id,
      participationAddress: item.fund.participation.id,
      tradingAddress: item.fund.trading.id,
      accountingAddress: item.fund.accounting.id,
      ownedAssets: (item.fund.accounting.ownedAssets || []).map((asset) => asset.id),
      manager: item.fund.manager,
      change: calculateChangeFromSharePrice(
        item.fund.calculationsHistory[0]?.sharePrice,
        item.fund.calculationsHistory[1]?.sharePrice
      ),
    };

    return output;
  });

  const managed = (result && result.data && result.data.fundManager && result.data.fundManager.funds) || [];
  const managedProcessed = managed.map((item) => {
    const output: Fund = {
      address: item.id,
      name: item.name,
      inception: item.createdAt,
      sharePrice: item.sharePrice,
      version: item.version.name,
      versionAddress: item.version.id,
      participationAddress: item.participation.id,
      tradingAddress: item.trading.id,
      accountingAddress: item.accounting.id,
      ownedAssets: (item.accounting.ownedAssets || []).map((asset) => asset.id),
      manager: item.manager,
      gav: item.gav,
      change: calculateChangeFromSharePrice(
        item.calculationsHistory[0]?.sharePrice,
        item.calculationsHistory[1]?.sharePrice
      ),
      shares: item.totalSupply,
      isShutDown: item.isShutdown,
    };

    return output;
  });

  return [investmentsProcessed, investmentRequestsProcessed, managedProcessed, result] as [
    typeof investmentsProcessed,
    typeof investmentRequestsProcessed,
    typeof managedProcessed,
    typeof result
  ];
};
