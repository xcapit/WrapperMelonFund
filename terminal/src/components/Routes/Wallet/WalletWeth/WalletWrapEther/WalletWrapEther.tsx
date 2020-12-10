import React from 'react';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import { Weth, DeployedEnvironment } from '@melonproject/melonjs';
import { useTransaction, TransactionHookValues } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { Block, BlockActions } from '~/storybook/Block/Block';
import { Title } from '~/storybook/Title/Title';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { useFormik, Form } from '~/components/Form/Form';
import { Button } from '~/components/Form/Button/Button';
import { TokenValueInput } from '~/components/Form/TokenValueInput/TokenValueInput';
import { TokenValue } from '~/TokenValue';
import { AccountContextValue } from '~/components/Contexts/Account/Account';
import * as S from './WalletWrapEther.styles';

const token = {
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'ETHER',
  name: 'Ether',
  decimals: 18,
  historic: false,
};

export const WalletWrapEther: React.FC = () => {
  const account = useAccount();
  const environment = useEnvironment()!;
  const transaction = useTransaction(environment);

  return (
    <Block>
      <Title>Wrap Ether</Title>
      <WalletWrapEtherForm transaction={transaction} account={account} environment={environment} />
    </Block>
  );
};

const validationSchema = Yup.object().shape({
  quantityEth: Yup.mixed()
    .test('positive', 'Amount of ETH has to be positive', (value) => value.value?.isGreaterThan(0))
    .test('balance', 'Not enough ETH in wallet', function (value) {
      const account = (this.options.context as any).account as AccountContextValue;
      return !!account.eth?.isGreaterThanOrEqualTo(toTokenBaseUnit(value.value, 18));
    }),
});

interface WalletWrapEtherFormProps {
  environment: DeployedEnvironment;
  account: AccountContextValue;
  transaction: TransactionHookValues;
}

const WalletWrapEtherForm: React.FC<WalletWrapEtherFormProps> = ({ transaction, account, environment }) => {
  const initialValues = {
    quantityEth: new TokenValue(token, 1),
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
      const tx = weth.deposit(account.address!, toTokenBaseUnit(data.quantityEth.value, 18));
      transaction.start(tx, 'Wrap Ether');
    },
  });

  const amount = React.useMemo(() => {
    return formik.values.quantityEth.value;
  }, [formik.values.quantityEth]);

  const showNotification =
    !account.eth?.isLessThan(toTokenBaseUnit(amount, 18)) &&
    account.eth?.minus(toTokenBaseUnit(amount, 18)).isLessThan(new BigNumber('1e16'));

  const presets = React.useMemo(
    () => [
      {
        label: 'Max',
        value: account.eth || 0,
      },
    ],
    [account.eth]
  );

  return (
    <>
      <Form formik={formik}>
        <S.WalletWrapEtherBalances>
          <S.WalletWrapEtherBalance>
            Your ETH balance: <TokenValueDisplay value={account.eth!} symbol="ETH" />
          </S.WalletWrapEtherBalance>
        </S.WalletWrapEtherBalances>

        <TokenValueInput presets={presets} name="quantityEth" label="Quantity" />

        {showNotification && (
          <NotificationBar kind="warning">
            <NotificationContent>
              Only a very small amount of ETH will be left in your wallet after this transaction, but you need some ETH
              in your wallet to pay transaction fees.
            </NotificationContent>
          </NotificationBar>
        )}
        <BlockActions>
          <Button type="submit">Wrap Ether</Button>
        </BlockActions>
      </Form>
      <TransactionModal transaction={transaction}>
        <TransactionDescription title="Wrap ether">
          This transaction converts <FormattedNumber value={amount} suffix="ETH" /> into{' '}
          <FormattedNumber value={amount} suffix="WETH (wrapped ether)" />
        </TransactionDescription>
      </TransactionModal>
    </>
  );
};

export default WalletWrapEther;
