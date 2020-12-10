import React, { useEffect, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { Trading, DeployedEnvironment, ExchangeDefinition } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction, TransactionHookValues } from '~/hooks/useTransaction';
import { Button } from '~/components/Form/Button/Button';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Block, BlockActions } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { useAccount } from '~/hooks/useAccount';
import { useFundExchangesQuery } from './FundExchanges.query';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { Form, useFormik } from '~/components/Form/Form';
import { CheckboxGroup, CheckboxGroupOption } from '~/components/Form/CheckboxGroup/CheckboxGroup';
import { AccountContextValue } from '~/components/Contexts/Account/Account';

export interface ExchangesProps {
  address: string;
}

export const FundExchanges: React.FC<ExchangesProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const [details, query] = useFundExchangesQuery(address);

  const transaction = useTransaction(environment);

  const exchanges = useMemo(() => {
    const exchanges = details?.fund?.routes?.trading?.exchanges || [];
    return exchanges.map((exchange) => environment.getExchange(exchange as any)).filter((exchange) => !!exchange);
  }, [details?.fund?.routes?.trading?.exchanges]);

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Define Allowed Exchanges</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  const options = environment.exchanges
    .filter((exchange) => !exchange.historic || exchanges?.some((enabled) => enabled.id === exchange.id))
    .map((exchange) => ({
      label: `${exchange.name}${exchange.historic ? ` (deprecated)` : ''}`,
      value: exchange.id,
      checked: !!exchanges?.some((enabled) => enabled.id === exchange.id),
      disabled: !!exchanges?.some((enabled) => enabled.id === exchange.id),
    }));

  return (
    <Block>
      <FundExchangesForm
        exchanges={exchanges}
        details={details}
        options={options}
        environment={environment}
        account={account}
        transaction={transaction}
      />
      <TransactionModal transaction={transaction}>
        <TransactionDescription title="Add exchange">
          You are adding an exchange to the list of allowed exchanges.
        </TransactionDescription>
      </TransactionModal>
    </Block>
  );
};

const validationSchema = Yup.object().shape({
  exchanges: Yup.array<string>()
    .compact()
    .test('at-least-one', "You didn't select a new exchange.", function (value: string[]) {
      const options = (this.options.context as any).exchanges as ExchangeDefinition[];
      return value.some((selected) => selected && !options.some((available: any) => available.id === selected))!;
    })
    .test('only-one', 'You can only add one exchange at a time.', function (value: string[]) {
      const options = (this.options.context as any).exchanges as ExchangeDefinition[];
      const add = value.filter((selected) => selected && !options.some((available: any) => available.id === selected))!;
      return add.length === 1;
    }),
});

interface FundExchangesFormProps {
  exchanges: ExchangeDefinition[];
  details: any;
  options: CheckboxGroupOption[];
  account: AccountContextValue;
  environment: DeployedEnvironment;
  transaction: TransactionHookValues;
}

const FundExchangesForm: React.FC<FundExchangesFormProps> = ({
  exchanges,
  details,
  options,
  account,
  environment,
  transaction,
}) => {
  const initialValues = {
    exchanges: exchanges.map((item) => item.id),
  };

  const validationContext = React.useMemo(
    () => ({
      account,
      environment,
      exchanges,
    }),
    [account, environment, exchanges]
  );

  const formik = useFormik({
    validationSchema,
    validationContext,
    initialValues,
    onSubmit: (data) => {
      const add = data.exchanges.find(
        (selected) => selected && !exchanges.some((available) => available.id === selected)
      )!;
      const exchange = environment.getExchange(add);
      const address = details?.fund?.routes?.trading?.address;
      const trading = new Trading(environment, address!);
      const tx = trading.addExchange(account.address!, exchange.exchange, exchange.adapter);
      transaction.start(tx, 'Add exchange');
    },
  });

  return (
    <Form formik={formik}>
      <SectionTitle>Define Allowed Exchanges</SectionTitle>
      <p>As a fund manager, you can trade on any of the exchanges selected below.</p>
      <CheckboxGroup name="exchanges" options={options} />
      <BlockActions>
        <Button type="submit">Update Allowed Exchanges</Button>
      </BlockActions>
    </Form>
  );
};
