import React from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import { useHistory } from 'react-router';
import { Registry, Version, DeployedEnvironment } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useTransaction, TransactionHookValues } from '~/hooks/useTransaction';
import { useAccount } from '~/hooks/useAccount';
import { useFormik, Form } from '~/components/Form/Form';
import { Input } from '~/components/Form/Input/Input';
import { Button } from '~/components/Form/Button/Button';
import { CheckboxGroup } from '~/components/Form/CheckboxGroup/CheckboxGroup';
import { Checkbox } from '~/components/Form/Checkbox/Checkbox';
import { Grid, GridRow, GridCol } from '~/storybook/Grid/Grid';
import { SectionTitle } from '~/storybook/Title/Title';
import { Block, BlockSection, BlockActions } from '~/storybook/Block/Block';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { RequiresFundSetupNotStarted } from '~/components/Gates/RequiresFundSetupNotStarted/RequiresFundSetupNotStarted';
import { Fallback } from '~/components/Common/Fallback/Fallback';
import { Link } from '~/storybook/Link/Link';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { getNetworkName } from '~/config';
import { AccountContextValue } from '~/components/Contexts/Account/Account';

export interface WalletFundSetupForm {
  name: string;
  exchanges: string[];
  assets: string[];
  managementFee: number;
  performanceFee: number;
  performanceFeePeriod: number;
  termsAndConditions: boolean;
}

export const WalletFundSetup: React.FC = () => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const history = useHistory();

  const transaction = useTransaction(environment, {
    onAcknowledge: () => {
      if (!account.fund) {
        history.push('/wallet');
      }

      const prefix = getNetworkName(environment.network);
      history.push(`/${prefix}/fund/${account.fund}`, {
        start: true,
      });
    },
  });

  const prefix = getNetworkName(environment.network);
  const fallback = (
    <Fallback kind="error">
      You have already started to setup your fund or your fund has already been fully setup. Go to{' '}
      <Link to={`/${prefix}/fund/${account.fund}`}>your fund</Link> to view your fund.
    </Fallback>
  );

  return (
    <>
      <RequiresFundSetupNotStarted fallback={fallback}>
        <Grid>
          <GridRow justify="center">
            <GridCol sm={12} md={12} lg={12}>
              <Block>
                <WalletFundSetupForm transaction={transaction} environment={environment} account={account} />
              </Block>
            </GridCol>
          </GridRow>
        </Grid>
      </RequiresFundSetupNotStarted>
      <TransactionModal transaction={transaction}>
        <TransactionDescription title="Begin Setup (Step 1 of 9)">
          This transaction stores all the parameters related to your new fund and creates the skeleton of your new fund.
        </TransactionDescription>
      </TransactionModal>
    </>
  );
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('This is a required field.')
    .min(1, 'The fund name must be at least one character.')
    .test('nameTest', 'The fund name contains invalid characters.', async function (value) {
      if (!value) {
        return true;
      }

      const environment = (this.options.context as any).environment as DeployedEnvironment;
      const registry = new Registry(environment, environment.deployment.melon.addr.Registry);
      return await registry.isValidFundName(value);
    })
    .test('nameTest', 'The fund name is reserved by another manager.', async function (value) {
      if (!value) {
        return true;
      }

      const environment = (this.options.context as any).environment as DeployedEnvironment;
      const account = (this.options.context as any).account as AccountContextValue;
      const registry = new Registry(environment, environment.deployment.melon.addr.Registry);
      return await registry.canUseFundName(account.address!, value);
    }),
  exchanges: Yup.array<string>()
    .compact()
    .required('This is a required field.')
    .min(1, 'Select at least one exchange.'),
  assets: Yup.array<string>()
    .compact()
    .required('This is a required field.')
    .min(1, 'Select at least one investment asset.'),
  managementFee: Yup.number()
    .label('Management Fee')
    .required()
    .min(0, 'Management Fee must be greater or equal to zero.')
    .max(100),
  performanceFee: Yup.number().label('Performance Fee').required().min(0).max(100),
  performanceFeePeriod: Yup.number().min(0),
  termsAndConditions: Yup.boolean().oneOf(
    [true],
    'You need to accept the terms and conditions before you can continue.'
  ),
});

interface WalletFundSetupFormProps {
  environment: DeployedEnvironment;
  account: AccountContextValue;
  transaction: TransactionHookValues;
}

const WalletFundSetupForm: React.FC<WalletFundSetupFormProps> = ({ transaction, account, environment }) => {
  const exchangeOptions = environment.exchanges
    .filter((exchange) => !exchange.historic)
    .map((exchange) => ({
      label: exchange.name,
      value: exchange.id,
      checked: true,
    }));

  const tokensOptions = environment.tokens
    .filter((token) => !token.historic)
    .map((token) => ({
      label: `${token.symbol} (${token.name})`,
      value: token.address,
      checked: true,
    }));

  const validationContext = React.useMemo(
    () => ({
      account,
      environment,
    }),
    [account, environment]
  );

  const initialValues: WalletFundSetupForm = {
    name: '',
    exchanges: exchangeOptions.map((item) => item.value),
    assets: tokensOptions.map((item) => item.value),
    managementFee: 1,
    performanceFee: 10,
    performanceFeePeriod: 90,
    termsAndConditions: false,
  };

  const formik = useFormik({
    validationSchema,
    validationContext,
    initialValues,
    onSubmit: (values) => {
      const factory = new Version(environment, environment.deployment.melon.addr.Version);

      const wethAddress = environment.getToken('WETH')!.address;
      const assetAddresses = values.assets.map((symbol) => environment.getToken(symbol)!.address);
      const selectedExchanges = values.exchanges.map((id) => environment.getExchange(id));
      const exchangeAddresses = selectedExchanges.map((exchange) => exchange.exchange);
      const adapterAddresses = selectedExchanges.map((exchange) => exchange.adapter);

      const managementFeeAddress = environment.deployment.melon.addr.ManagementFee;
      const performanceFeeAddress = environment.deployment.melon.addr.PerformanceFee;
      const managementFeePeriod = new BigNumber(0);
      const performanceFeePeriod = new BigNumber(values.performanceFeePeriod).multipliedBy(60 * 60 * 24);
      const managementFeeRate = new BigNumber(values.managementFee).multipliedBy('1e16');
      const performanceFeeRate = new BigNumber(values.performanceFee).multipliedBy('1e16');

      const tx = factory.beginSetup(account.address!, {
        name: values.name,
        adapters: adapterAddresses,
        exchanges: exchangeAddresses,
        fees: [managementFeeAddress, performanceFeeAddress],
        denominationAsset: wethAddress,
        defaultAssets: assetAddresses,
        feePeriods: [managementFeePeriod, performanceFeePeriod],
        feeRates: [managementFeeRate, performanceFeeRate],
      });

      transaction.start(tx, 'Begin setup');
    },
  });

  return (
    <Form formik={formik}>
      <BlockSection>
        <SectionTitle
          tooltip="The public-facing name of your fund. The name you choose now cannot be edited later."
          placement="auto"
        >
          Fund
        </SectionTitle>
        <Input name="name" label="Name" />
      </BlockSection>
      <BlockSection>
        <SectionTitle
          tooltip="The rates you will charge to manage your fund, and the frequency at which you will charge them. The fees you choose now cannot be edited later."
          placement="auto"
        >
          Fees
        </SectionTitle>

        <Input name="managementFee" label="Management Fee (%)" type="number" step="any" />
        <Input name="performanceFee" label="Performance Fee (%)" type="number" step="any" />
        <Input name="performanceFeePeriod" label="Performance Fee Period (days)" type="number" step="any" />
      </BlockSection>
      <BlockSection>
        <SectionTitle
          tooltip="The decentralized exchanges upon which your fund will be able to trade."
          placement="auto"
        >
          Supported Exchanges
        </SectionTitle>

        <NotificationBar kind="neutral">
          <NotificationContent>Exchanges can be set up now and you can add more exchanges later.</NotificationContent>
        </NotificationBar>
        <CheckboxGroup name="exchanges" options={exchangeOptions} />
      </BlockSection>
      <BlockSection>
        <SectionTitle
          tooltip="The tokens you will accept from an investor in exchange for shares of your fund."
          placement="auto"
        >
          Allowed Investment Assets
        </SectionTitle>

        <NotificationBar kind="neutral">
          <NotificationContent>Investment assets can be set up now and they can be changed later.</NotificationContent>
        </NotificationBar>
        <CheckboxGroup options={tokensOptions} name="assets" />
      </BlockSection>
      <BlockSection>
        <SectionTitle>Disclaimer</SectionTitle>
        <p>
          IMPORTANT NOTE: PLEASE READ THE FULL VERSION OF THIS DISCLAIMER CAREFULLY BEFORE USING THE MELON PROTOCOL.
        </p>
        <p>
          YOUR USE OF THE MELON PROTOCOL AND/OR THE SOFTWARE MAY BE SUBJECT TO THE FINANCIAL LAWS AND REGULATIONS OF
          VARIOUS JURISDICTIONS. PRIOR TO USING THE MELON PROTOCOL, SEEK LEGAL ASSISTANCE TO ASSURE THAT YOU MAY USE THE
          SOFTWARE IN COMPLIANCE WITH APPLICABLE LAW. FAILURE TO DO SO MAY SUBJECT YOU TO CRIMINAL AS WELL AS CIVIL
          PENALTIES IN ONE OR MORE JURISDICTIONS. BY USING THIS SOFTWARE, YOU CONFIRM THAT YOU HAVE SOUGHT THE ADVICE OF
          COMPETENT COUNSEL OR ARE OTHERWISE FAMILIAR WITH THE APPLICABLE LAWS AND REGULATIONS PERTAINING TO YOUR
          INTENDED USE OF THE MELON PROTOCOL. BY USING THIS SOFTWARE, YOU UNDERSTAND, ACKNOWLEDGE AND ACCEPT THAT THE
          MELON PROTOCOL AND/OR THE UNDERLYING SOFTWARE ARE PROVIDED “AS IS” AND WITHOUT WARRANTIES OR REPRESENTATIONS
          OF ANY KIND EITHER EXPRESSED OR IMPLIED. ANY USE OF THIS OPEN SOURCE SOFTWARE RELEASED UNDER THE GNU GENERAL
          PUBLIC LICENSE VERSION 3 (GPL 3) IS DONE AT YOUR OWN RISK TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO
          APPLICABLE LAW ANY AND ALL LIABILITY AS WELL AS ALL WARRANTIES, INCLUDING ANY FITNESS FOR A PARTICULAR PURPOSE
          WITH RESPECT TO THE MELON PROTOCOL AND/OR THE UNDERLYING SOFTWARE AND THE USE THEREOF ARE DISCLAIMED.
        </p>
        <Checkbox name="termsAndConditions" label="I accept the terms and conditions" />
        <BlockActions>
          <Button type="submit">Create a Fund</Button>
        </BlockActions>
      </BlockSection>
    </Form>
  );
};

export default WalletFundSetup;
