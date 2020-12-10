import { AccountShares } from '@melonproject/melongql';
import { Participation } from '@melonproject/melonjs';
import BigNumber from 'bignumber.js';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Button } from '~/components/Form/Button/Button';
import { Checkbox } from '~/components/Form/Checkbox/Checkbox';
import { Form, useFormik } from '~/components/Form/Form';
import { TokenValueInput } from '~/components/Form/TokenValueInput/TokenValueInput';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';
import { getNetworkName } from '~/config';
import { useAccount } from '~/hooks/useAccount';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFund } from '~/hooks/useFund';
import { useTransaction } from '~/hooks/useTransaction';
import { Block, BlockActions } from '~/storybook/Block/Block';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { SectionTitle } from '~/storybook/Title/Title';
import { TokenValue } from '~/TokenValue';
import { tokenValueSchema } from '~/utils/formValidation';
import { sharesToken } from '~/utils/sharesToken';
import { useFundRedeemQuery } from './FundRedeem.query';

export interface FundRedeemProps {
  address: string;
}

const validationSchema = Yup.object().shape({
  shareQuantity: tokenValueSchema()
    .required()
    .gt(0, 'Number of shares has to be positive.')
    .test('smallerThanBalance', 'Number of shares has to be equal or less than number of shares owned', function (
      value
    ) {
      const shares = (this.options.context as any).shares as AccountShares;
      return !!(shares?.balanceOf && value.value.isLessThanOrEqualTo(shares?.balanceOf));
    }),
  redeemAll: Yup.boolean(),
});

export const FundRedeem: React.FC<FundRedeemProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const [result, query] = useFundRedeemQuery(address);
  const fund = useFund();

  const participationAddress = result?.account?.participation?.address;
  const shares = result?.account?.shares;

  const lockedAssets = result?.fund?.routes?.trading?.lockedAssets;
  const prefix = getNetworkName(environment.network)!;

  const transaction = useTransaction(environment);

  const validationContext = React.useMemo(
    () => ({
      shares,
    }),
    [shares]
  );

  const initialValues = {
    shareQuantity: new TokenValue(sharesToken, 1),
    redeemAll: false,
  };

  const formik = useFormik({
    validationSchema,
    validationContext,
    initialValues,
    onSubmit: async (values) => {
      const participationContract = new Participation(environment, participationAddress);
      if (values.redeemAll) {
        const tx = participationContract.redeem(account.address!);
        transaction.start(tx, 'Redeem all shares');
        return;
      }

      const shareQuantity = values.shareQuantity.integer!;

      const tx = participationContract.redeemQuantity(account.address!, shareQuantity);
      transaction.start(tx, 'Redeem shares');
    },
  });

  useEffect(() => {
    formik.setFieldValue('shareQuantity', new TokenValue(sharesToken, shares?.balanceOf || new BigNumber(0)));
  }, [formik.values.redeemAll]);

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Redeem</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  if (lockedAssets?.length) {
    return (
      <Block>
        <SectionTitle>Redeem</SectionTitle>
        <p>Redemption is currently not possible, because the fund has assets locked in the trading contract.</p>
        <RequiresFundManager fallback={false}>
          As the fund manager, you can on <Link to={`/${prefix}/fund/${address}/manage`}>move the assets to vault</Link>
          .
        </RequiresFundManager>
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle
        tooltip={
          "Fill out the form below to request a redemption of your investment. Redemptions are granted in kind; a pro-rated portion of the fund's token holdings will be transferred to your wallet in exchange for your shares in the fund."
        }
        placement={'auto'}
      >
        Redeem
      </SectionTitle>

      {shares && !shares?.balanceOf?.isZero() && (
        <>
          <p>
            You own <FormattedNumber value={shares?.balanceOf} /> shares
          </p>
          <Form formik={formik}>
            <TokenValueInput
              name="shareQuantity"
              label="Number of shares to redeem"
              noIcon={true}
              disabled={query.loading || formik.values.redeemAll}
            />
            <Checkbox name="redeemAll" label="Redeem all shares" />
            <BlockActions>
              <Button type="submit">Redeem</Button>
            </BlockActions>
          </Form>
        </>
      )}
      {(shares?.balanceOf?.isZero() || !shares?.balanceOf) && <>You don't own any shares.</>}
      <TransactionModal transaction={transaction}>
        <TransactionDescription title="Redeem shares">
          You are redeeming{' '}
          {formik.values.redeemAll ? (
            <>
              all your <FormattedNumber value={shares?.balanceOf} />
              shares
            </>
          ) : (
            <>
              <TokenValueDisplay value={formik.values.shareQuantity} /> shares (of your total of{' '}
              <FormattedNumber value={shares?.balanceOf} /> shares)
            </>
          )}{' '}
          of the fund &laquo;{fund.name}.&raquo; You will receive a slice of the fund's assets.
        </TransactionDescription>
      </TransactionModal>
    </Block>
  );
};
