import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Participation, sameAddress, TokenDefinition, DeployedEnvironment } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Button } from '~/components/Form/Button/Button';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Block, BlockActions } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { useAccount } from '~/hooks/useAccount';
import { useFundInvestmentAssetsQuery } from './FundInvestmentAssets.query';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { useFormik, Form } from '~/components/Form/Form';
import { AccountContextValue } from '~/components/Contexts/Account/Account';
import { CheckboxGroup } from '~/components/Form/CheckboxGroup/CheckboxGroup';

export interface InvestmentAssetsProps {
  address: string;
}

export const InvestmentAssets: React.FC<InvestmentAssetsProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const [details, query] = useFundInvestmentAssetsQuery(address);

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Define Investment Assets</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  const allowedAssets = (details?.fund?.routes?.participation?.allowedAssets || [])
    .map((item) => environment.getToken(item.token!.address!))
    .filter((item) => !!item);

  return (
    <Block>
      <InvestmentAssetsForm
        details={details}
        environment={environment}
        account={account}
        allowedAssets={allowedAssets}
      />
    </Block>
  );
};

const validationSchema = Yup.object().shape({
  assets: Yup.array<string>().compact(),
});

interface InvestmentAssetsFormProps {
  details: any;
  account: AccountContextValue;
  environment: DeployedEnvironment;
  allowedAssets: TokenDefinition[];
}

const InvestmentAssetsForm: React.FC<InvestmentAssetsFormProps> = ({
  details,
  account,
  environment,
  allowedAssets,
}) => {
  const tokensOptions = environment.tokens
    .filter((token) => !token.historic)
    .map((token) => ({
      label: `${token.symbol} (${token.name})`,
      value: token.address,
    }));

  const [addAssets, setAddAssets] = useState<string[]>([]);
  const [removeAssets, setRemoveAssets] = useState<string[]>([]);

  const transaction = useTransaction(environment, {
    onAcknowledge: () => {
      if (removeAssets?.length) {
        setRemoveAssets([]);
      } else if (addAssets?.length) {
        setAddAssets([]);
      }
    },
  });

  const initialValues = {
    assets: allowedAssets.map((item) => item.address),
  };

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (data) => {
      const assetsToAdd = data.assets.filter(
        (selected) => selected && !allowedAssets?.some((available) => sameAddress(available.address, selected))
      );

      const assetsToRemove = (allowedAssets || [])
        .filter((asset) => !data.assets.some((selected) => sameAddress(selected, asset.address)))
        .map((item) => item.address) as string[];

      setRemoveAssets(assetsToRemove);
      setAddAssets(assetsToAdd);

      if (!removeAssets.length && !addAssets.length) {
        formik.setFieldError('assets', 'No changes detected');
      }
    },
  });

  useEffect(() => {
    const participationAddress = details?.fund?.routes?.participation?.address;
    const participation = new Participation(environment, participationAddress);

    if (removeAssets.length) {
      formik.setFieldError('assets', undefined);
      const tx = participation.disableInvestment(account.address!, removeAssets);
      transaction.start(tx, 'Remove assets');
    } else if (addAssets.length) {
      formik.setFieldError('assets', undefined);
      const tx = participation.enableInvestment(account.address!, addAssets);
      transaction.start(tx, 'Add assets');
    }
  }, [addAssets, removeAssets]);

  return (
    <>
      <Form formik={formik}>
        <SectionTitle>Define Investment Assets</SectionTitle>
        <p>Investors will be able to invest in your funds using any of the assets selected below.</p>
        <CheckboxGroup options={tokensOptions} name="assets" />
        <BlockActions>
          <Button type="submit">Update Investment Assets</Button>
        </BlockActions>
      </Form>
      <TransactionModal transaction={transaction}>
        {transaction.state.name === 'Remove assets' && (
          <TransactionDescription title="Remove assets">
            You are removing {removeAssets.length} asset{removeAssets.length > 1 && 's'} from the list of allowed
            investment assets.
          </TransactionDescription>
        )}
        {transaction.state.name === 'Add assets' && (
          <TransactionDescription title="Add assets">
            You are adding {addAssets.length} asset{addAssets.length > 1 && 's'} from the list of allowed investment
            assets.
          </TransactionDescription>
        )}
      </TransactionModal>
    </>
  );
};

export default InvestmentAssets;
