import React from 'react';
import * as Yup from 'yup';
import Modal, { ModalProps } from 'styled-react-modal';
import { TransactionHookValues, TransactionProgress } from '~/hooks/useTransaction';
import { ProgressBar } from '~/components/Common/ProgressBar/ProgressBar';
import { ProgressBarStep } from '~/components/Common/ProgressBar/ProgressBarStep/ProgressBarStep';
import { Button } from '~/components/Form/Button/Button';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { Spinner } from '~/storybook/Spinner/Spinner';
import * as S from '~/storybook/Modal/Modal';
import { EtherscanLink } from '../EtherscanLink/EtherscanLink';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { BigNumber } from 'bignumber.js';
import { useEnvironment } from '~/hooks/useEnvironment';
import { NetworkEnum } from '~/types';
import { TokenValueDisplay } from '../TokenValueDisplay/TokenValueDisplay';
import { ScrollableTable } from '~/storybook/Table/Table';
import { useFund } from '~/hooks/useFund';
import { useConnectionState } from '~/hooks/useConnectionState';
import { Form, useFormik } from '~/components/Form/Form';
import { bigNumberSchema } from '~/utils/formValidation';
import { BigNumberInput } from '~/components/Form/BigNumberInput/BigNumberInput';
import { useTokenRates } from '~/components/Contexts/Rates/Rates';

function progressToStep(progress: number) {
  if (progress >= TransactionProgress.EXECUTION_FINISHED) {
    return 3;
  }

  if (progress >= TransactionProgress.EXECUTION_RECEIVED) {
    return 2;
  }

  if (progress >= TransactionProgress.EXECUTION_PENDING) {
    return 1;
  }

  return 0;
}

function loadingStep(progress: number) {
  if (progress === TransactionProgress.EXECUTION_PENDING || progress === TransactionProgress.EXECUTION_RECEIVED) {
    return true;
  }

  return false;
}

export interface TransactionModalProps extends Partial<ModalProps> {
  transaction: TransactionHookValues;
}

const validationSchema = Yup.object().shape({
  gasPrice: bigNumberSchema().required().gt(0).lte(500),
});

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction: { state, cancel, submit, acknowledge },
  children,
  ...rest
}) => {
  const gas = state.ethGasStation;
  const defaultGasPrice = state.defaultGasPrice;

  const initialGasPrice = React.useMemo(() => new BigNumber(defaultGasPrice ?? 0), [defaultGasPrice]);
  const formik = useFormik({
    validationSchema,
    onSubmit: (values) => submit(values.gasPrice),
    initialValues: {
      gasPrice: initialGasPrice,
    },
  });

  React.useEffect(() => {
    if (formik.errors.gasPrice || formik.touched.gasPrice) {
      return;
    }

    if (formik.values.gasPrice?.comparedTo(initialGasPrice) !== 0) {
      formik.setFieldValue('gasPrice', initialGasPrice);
    }
  }, [formik.setFieldValue, initialGasPrice]);

  const environment = useEnvironment()!;
  const rates = useTokenRates('ETH');
  const rate = rates.USD;

  const fund = useFund();
  const connection = useConnectionState();

  const hash = state.hash;
  const receipt = state.receipt;
  const options = state.sendOptions;
  const output = !!(hash || receipt);

  const error = state.error;
  const handled = state.handled;
  const loading = state.loading;
  const finished = state.progress >= TransactionProgress.EXECUTION_FINISHED;
  const estimated = state.progress >= TransactionProgress.ESTIMATION_FINISHED;
  const started = state.progress >= TransactionProgress.EXECUTION_PENDING;
  const open =
    state.progress < TransactionProgress.TRANSACTION_ACKNOWLEDGED &&
    state.progress > TransactionProgress.TRANSACTION_STARTED;
  const pending = state.progress === TransactionProgress.EXECUTION_PENDING;

  const formGasPrice = new BigNumber(formik.values.gasPrice);
  const usedGasPrice = new BigNumber(state.sendOptions?.gasPrice ?? 'NaN');
  const gasPriceEth = new BigNumber(options?.gas ?? 'NaN').multipliedBy('1e9').multipliedBy(formGasPrice);
  const gasPriceUsd = gasPriceEth.multipliedBy(rate);

  const amguUsd = options?.amgu?.multipliedBy(rate) ?? new BigNumber('NaN');
  const incentiveUsd = options?.incentive?.multipliedBy(rate) ?? new BigNumber('NaN');

  const totalEth = gasPriceEth?.plus(options?.amgu ?? 0).plus(options?.incentive ?? 0);
  const totalUsd = totalEth.multipliedBy(rate);

  const setGasPrice = (value: number = 0) => {
    formik.setFieldValue('gasPrice', value);
  };

  const currentStep = progressToStep(state.progress);

  if (error) {
    // tslint:disable
    error.issueUri = encodeURI(
      `https://github.com/avantgardefinance/melon-terminal/issues/new?title=Error in transaction "${state.name}";
        body=
        Error message: ${error.message}\n` +
        (fund?.name ? `Fund: ${fund.name}\n` : '') +
        `URL: ${window.location.href}\n` +
        (state.transaction?.contract?.address
          ? `Contract: [${state.transaction?.contract?.address}](https://etherscan.io/address/${state.transaction?.contract?.address})\n`
          : '') +
        `Method: ${state.transaction?.method}\n` +
        (state.transaction?.args ? `Arguments: ${JSON.stringify(state.transaction?.args)}\n` : '') +
        `Sender: [${state.transaction?.from}](https://etherscan.io/address/${state.transaction?.from})\n` +
        (hash ? `TxHash: [${hash}](https://etherscan.io/tx/${hash})\n` : '') +
        (connection?.method ? `Connection: ${connection.method}\n` : '') +
        (connection?.network ? `Network: ${NetworkEnum[connection.network]}` : '') +
        (error?.stack ? `\nStack trace: ${error?.stack}` : '')
    );
    // tslint:enable
  }

  return (
    <Modal isOpen={open} {...rest}>
      <S.TransactionModal>
        <S.TransactionModalTitle>
          <S.TransactionModalName>{state.name}</S.TransactionModalName>
          <S.TransactionModalNetwork>{NetworkEnum[environment.network]} </S.TransactionModalNetwork>
        </S.TransactionModalTitle>

        <S.TransactionModalContent>
          {!estimated && !error && <Spinner />}

          {error && !handled && (
            <NotificationBar kind="error">
              <NotificationContent>{error.message}</NotificationContent>
              <NotificationContent>
                <a href={error.issueUri} target="_blank">
                  Report error
                </a>
              </NotificationContent>
            </NotificationBar>
          )}

          {pending && (
            <NotificationBar kind="neutral">
              <NotificationContent>
                Please confirm the transaction on your signing device (e.g. your hardware wallet or mobile phone)
              </NotificationContent>
            </NotificationBar>
          )}

          {error && handled && (
            <NotificationBar kind="neutral">
              <NotificationContent>{handled}</NotificationContent>
              <NotificationContent>
                <a href={error.issueUri} target="_blank">
                  Report error
                </a>
              </NotificationContent>
            </NotificationBar>
          )}

          {finished && (
            <NotificationBar kind="success">
              <NotificationContent>Transaction successful!</NotificationContent>
            </NotificationBar>
          )}

          {estimated && !finished && !handled && (
            <ProgressBar step={currentStep} loading={loadingStep(state.progress)}>
              <ProgressBarStep />
              <ProgressBarStep />
              <ProgressBarStep />
              <ProgressBarStep />
            </ProgressBar>
          )}

          {!finished && estimated && gas && !handled && (
            <S.EthGasStation>
              <S.EthGasStationButton onClick={() => !loading && setGasPrice(gas!.low)} disabled={loading}>
                <S.EthGasStationButtonGwei>{gas.low}</S.EthGasStationButtonGwei>
                <S.EthGasStationButtonText>
                  Low
                  <br />
                  Gas Price
                </S.EthGasStationButtonText>
              </S.EthGasStationButton>
              <S.EthGasStationButton onClick={() => !loading && setGasPrice(gas!.average)} disabled={loading}>
                <S.EthGasStationButtonGwei>{gas.average}</S.EthGasStationButtonGwei>
                <S.EthGasStationButtonText>
                  Average
                  <br />
                  Gas Price
                </S.EthGasStationButtonText>
              </S.EthGasStationButton>
              <S.EthGasStationButton onClick={() => !loading && setGasPrice(gas!.fast)} disabled={loading}>
                <S.EthGasStationButtonGwei>{gas.fast}</S.EthGasStationButtonGwei>
                <S.EthGasStationButtonText>
                  Fast
                  <br />
                  Gas Price
                </S.EthGasStationButtonText>
              </S.EthGasStationButton>
            </S.EthGasStation>
          )}

          <Form formik={formik}>
            {estimated && !finished && !handled && (
              <S.TransactionModalFeeForm>
                <BigNumberInput
                  allowNegative={false}
                  name="gasPrice"
                  label="Gas Price (gwei)"
                  decimalScale={9}
                  disabled={loading && estimated}
                />

                <ScrollableTable>
                  <S.CostsTable>
                    <S.CostsTableHead>
                      <S.CostsTableRow>
                        <S.CostsTableHeaderCellText />
                        <S.CostsTableHeaderCell>Amount</S.CostsTableHeaderCell>
                        <S.CostsTableHeaderCell>Costs [ETH]</S.CostsTableHeaderCell>
                        <S.CostsTableHeaderCell>Costs [USD]</S.CostsTableHeaderCell>
                      </S.CostsTableRow>
                    </S.CostsTableHead>

                    <S.CostsTableBody>
                      {options && options.gas && gasPriceEth && (
                        <S.CostsTableRow>
                          <S.CostsTableCellText>Gas</S.CostsTableCellText>
                          <S.CostsTableCell>
                            <FormattedNumber value={options.gas} decimals={0} />
                          </S.CostsTableCell>
                          <S.CostsTableCell>
                            <TokenValueDisplay value={gasPriceEth} symbol="ETH" />
                          </S.CostsTableCell>
                          <S.CostsTableCell>
                            <TokenValueDisplay value={gasPriceUsd} symbol="USD" />
                          </S.CostsTableCell>
                        </S.CostsTableRow>
                      )}

                      {options && options.amgu && (
                        <S.CostsTableRow>
                          <S.CostsTableCellText>Asset management gas</S.CostsTableCellText>
                          <S.CostsTableCell />
                          <S.CostsTableCell>
                            <TokenValueDisplay value={options.amgu} symbol="ETH" />
                          </S.CostsTableCell>
                          <S.CostsTableCell>
                            <TokenValueDisplay value={amguUsd} symbol="USD" />
                          </S.CostsTableCell>
                        </S.CostsTableRow>
                      )}

                      {options && options.incentive && (
                        <S.CostsTableRow>
                          <S.CostsTableCellText>Incentive</S.CostsTableCellText>
                          <S.CostsTableCell />
                          <S.CostsTableCell>
                            <TokenValueDisplay value={options.incentive} symbol="ETH" />
                          </S.CostsTableCell>
                          <S.CostsTableCell>
                            <TokenValueDisplay value={incentiveUsd} symbol="USD" />
                          </S.CostsTableCell>
                        </S.CostsTableRow>
                      )}

                      {totalEth && (
                        <S.CostsTableRowTotal>
                          <S.CostsTableCellText>Total</S.CostsTableCellText>
                          <S.CostsTableCell />
                          <S.CostsTableCell>
                            <TokenValueDisplay value={totalEth} symbol="ETH" />
                          </S.CostsTableCell>
                          <S.CostsTableCell>
                            <TokenValueDisplay value={totalUsd} symbol="USD" />
                          </S.CostsTableCell>
                        </S.CostsTableRowTotal>
                      )}
                    </S.CostsTableBody>
                  </S.CostsTable>
                </ScrollableTable>
              </S.TransactionModalFeeForm>
            )}

            {output && !handled && (
              <S.TransactionModalMessages>
                <S.TransactionModalMessagesTable>
                  <S.TransactionModalMessagesTableBody>
                    {hash && (
                      <S.TransactionModalMessagesTableRow>
                        <S.TransactionModalMessagesTableRowLabel>Hash</S.TransactionModalMessagesTableRowLabel>
                        <S.TransactionModalMessagesTableRowQuantity>
                          <EtherscanLink hash={hash} />
                        </S.TransactionModalMessagesTableRowQuantity>
                      </S.TransactionModalMessagesTableRow>
                    )}

                    {receipt && (
                      <>
                        <S.TransactionModalMessagesTableRow>
                          <S.TransactionModalMessagesTableRowLabel>Gas used</S.TransactionModalMessagesTableRowLabel>
                          <S.TransactionModalMessagesTableRowQuantity>
                            <FormattedNumber value={receipt.gasUsed} decimals={0} />
                          </S.TransactionModalMessagesTableRowQuantity>
                        </S.TransactionModalMessagesTableRow>

                        <S.TransactionModalMessagesTableRow>
                          <S.TransactionModalMessagesTableRowLabel>Gas cost</S.TransactionModalMessagesTableRowLabel>
                          <S.TransactionModalMessagesTableRowQuantity>
                            <FormattedNumber
                              value={fromTokenBaseUnit(new BigNumber(receipt.gasUsed).multipliedBy(usedGasPrice), 18)}
                              suffix="ETH"
                            />
                            {' ('}
                            <FormattedNumber
                              value={fromTokenBaseUnit(
                                new BigNumber(receipt.gasUsed).multipliedBy(usedGasPrice).multipliedBy(rate),
                                18
                              )}
                              suffix="USD"
                            />
                            {')'}
                          </S.TransactionModalMessagesTableRowQuantity>
                        </S.TransactionModalMessagesTableRow>
                      </>
                    )}
                  </S.TransactionModalMessagesTableBody>
                </S.TransactionModalMessagesTable>
              </S.TransactionModalMessages>
            )}

            {estimated && !finished && !handled ? children : null}

            <S.TransactionModalActions>
              {!finished && (
                <S.TransactionModalAction>
                  <Button type="button" kind="secondary" length="stretch" disabled={started} onClick={() => cancel()}>
                    Close
                  </Button>
                </S.TransactionModalAction>
              )}

              {!finished && estimated && !handled && (
                <S.TransactionModalAction>
                  <Button type="submit" kind="success" length="stretch" disabled={loading}>
                    {error ? 'Retry' : 'Confirm'}
                  </Button>
                </S.TransactionModalAction>
              )}

              {finished && (
                <S.TransactionModalAction>
                  <Button
                    type="button"
                    kind="success"
                    length="stretch"
                    onClick={() => acknowledge()}
                    disabled={loading}
                  >
                    Acknowledge
                  </Button>
                </S.TransactionModalAction>
              )}
            </S.TransactionModalActions>
          </Form>
        </S.TransactionModalContent>
      </S.TransactionModal>
    </Modal>
  );
};
