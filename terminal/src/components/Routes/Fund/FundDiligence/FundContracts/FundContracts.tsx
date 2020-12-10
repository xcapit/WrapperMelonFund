import React, { Fragment } from 'react';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';
import { Block } from '~/storybook/Block/Block';
import { DictionaryData, DictionaryEntry, DictionaryLabel } from '~/storybook/Dictionary/Dictionary';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { useFundDetailsQuery } from '../FundDetails.query';

export interface FundContractsProps {
  address: string;
}

export const FundContracts: React.FC<FundContractsProps> = ({ address }) => {
  const [fund, query] = useFundDetailsQuery(address);

  const contracts = [
    { name: 'Accounting', field: 'accounting' },
    { name: 'Fee Manager', field: 'feeManager' },
    { name: 'Participation', field: 'participation' },
    { name: 'Policy Manager', field: 'policyManager' },
    { name: 'Shares', field: 'shares' },
    { name: 'Trading', field: 'trading' },
    { name: 'Vault', field: 'vault' },
    { name: 'Registry', field: 'registry' },
    { name: 'Version', field: 'version' },
  ];
  if (query.loading) {
    return <Spinner />;
  }
  if (!fund) {
    return null;
  }

  const routes = fund?.routes;
  const addresses = contracts
    .map((contract) => {
      const current = routes && ((routes as any)[contract.field] as any);
      return { ...contract, address: current && current.address };
    })
    .filter((item) => !!item.address);

  addresses.unshift({ address, name: 'Fund', field: 'fund' });

  const version = routes?.version;

  return (
    <Block>
      <DictionaryEntry>
        <DictionaryLabel>Manager Address</DictionaryLabel>
        <DictionaryData>
          <EtherscanLink address={fund.manager} />
        </DictionaryData>
      </DictionaryEntry>
      {!query.loading &&
        addresses.map((a) => (
          <Fragment key={a.address}>
            <DictionaryEntry>
              <DictionaryLabel>{a.name} Address</DictionaryLabel>
              <DictionaryData>
                <EtherscanLink address={a.address} />
              </DictionaryData>
            </DictionaryEntry>
          </Fragment>
        ))}
    </Block>
  );
};
