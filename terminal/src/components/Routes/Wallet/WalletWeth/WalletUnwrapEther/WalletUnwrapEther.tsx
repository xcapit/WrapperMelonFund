import React from 'react';
import * as Yup from 'yup';
import { Weth, TokenDefinition, DeployedEnvironment } from '@melonproject/melonjs';
import { useTransaction, TransactionHookValues } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { Block, BlockActions } from '~/storybook/Block/Block';
import { Title } from '~/storybook/Title/Title';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { Button } from '~/components/Form/Button/Button';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { Form, useFormik } from '~/components/Form/Form';
import { TokenValueInput } from '~/components/Form/TokenValueInput/TokenValueInput';
import { TokenValue } from '~/TokenValue';
import { AccountContextValue } from '~/components/Contexts/Account/Account';
import * as S from './WalletUnwrapEther.styles';

export const WalletUnwrapEther: React.FC = () => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const transaction = useTransaction(environment);

  const token = environment.getToken('WETH');

  return (
    <Block>
      <Title>Unwrap Ether</Title>
      <WalletUnwrapEtherForm token={token} transaction={transaction} account={account} environment={environment} />
    </Block>
  );
};

const validationSchema = Yup.object().shape({
  quantityWeth: Yup.mixed()
    .test('positive', 'Amount of WETH has to be positive', (value) => value.value?.isGreaterThan(0))
    .test('balance', 'Not enough WETH in wallet', function (value) {
      const account = (this.options.context as any).account as AccountContextValue;
      return !!account.weth?.isGreaterThanOrEqualTo(toTokenBaseUnit(value.value, 18));
    }),
});

interface WalletUnwrapEtherFormProps {
  environment: DeployedEnvironment;
  account: AccountContextValue;
  transaction: TransactionHookValues;
  token: TokenDefinition;
}

const WalletUnwrapEtherForm: React.FC<WalletUnwrapEtherFormProps> = ({ transaction, account, environment, token }) => {
  const initialValues = {
    quantityWeth: new TokenValue(token, 1),
  };

  const validationContext = React.useMemo(
    () => ({
      account,
    }),
    [account]
  );

  const formik = useFormik({
    validationSchema,
    validationContext,
    initialValues,
    onSubmit: (data) => {
      const token = environment.getToken('WETH')!;
      const weth = new Weth(environment, token.address);
      const tx = weth.withdraw(account.address!, toTokenBaseUnit(data.quantityWeth.value, 18));
      transaction.start(tx, 'Unwrap Ether');
    },
  });

  const amount = React.useMemo(() => {
    return formik.values.quantityWeth.value;
  }, [formik.values.quantityWeth]);

  const presets = React.useMemo(
    () => [
      {
        label: 'Max',
        value: account.weth || 0,
      },
    ],
    [account.eth]
  );

  return (
    <>
      <Form formik={formik}>
        <S.WalletUnwrapEtherBalances>
          <S.WalletUnwrapEtherBalance>
            Your WETH Balance: <TokenValueDisplay value={account.weth!} symbol="WETH" />
          </S.WalletUnwrapEtherBalance>
        </S.WalletUnwrapEtherBalances>
        <TokenValueInput presets={presets} name="quantityWeth" label="Quantity" />
        <BlockActions>
          <Button type="submit">Unwrap Ether</Button>
        </BlockActions>
      </Form>

      <TransactionModal transaction={transaction}>
        <TransactionDescription title="Unwrap ether">
          This transaction converts <FormattedNumber value={amount} suffix="WETH (wrapped ether)" /> into{' '}
          <FormattedNumber value={amount} suffix="ETH" />
        </TransactionDescription>
      </TransactionModal>
    </>
  );
};

export default WalletUnwrapEther;
