import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import BigNumber from 'bignumber.js';
import { useEnvironment } from '~/hooks/useEnvironment';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';

const MelonEngineTradingQuery = gql`
  query MelonEngineTradingQuery {
    engine {
      liquidEther
      enginePrice
    }
  }
`;

export const useMelonEngineTradingQuery = () => {
  const environment = useEnvironment()!;
  const result = useOnChainQuery(MelonEngineTradingQuery);

  const weth = environment.getToken('WETH');
  const engine = result.data?.engine;
  const enginePrice = engine?.enginePrice;
  const liquidEther = engine?.liquidEther;

  return [fromTokenBaseUnit(enginePrice!, weth.decimals), fromTokenBaseUnit(liquidEther!, weth.decimals), result] as [
    BigNumber,
    BigNumber,
    typeof result
  ];
};
