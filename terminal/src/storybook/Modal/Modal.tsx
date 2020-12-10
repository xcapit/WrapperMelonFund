import styled from 'styled-components';

export const Modal = styled.div`
  position: absolute;
  left: ${(props) => props.theme.spaceUnits.m};
  right: ${(props) => props.theme.spaceUnits.m};
  bottom: ${(props) => props.theme.spaceUnits.m};
  top: ${(props) => props.theme.spaceUnits.m};
  overflow: auto;
  overflow-y: auto;
  overflow-x: hidden;
  border: none;
  border-radius: 0px;
  outline: none;
  background: ${(props) => props.theme.mainColors.primary};
  @media (${(props) => props.theme.mediaQueries.m}) {
    top: 50%;
    transform: translateY(-50%);
    width: 640px;
    bottom: auto;
    left: auto;
    right: auto;
  }
`;

export const ModalTitle = styled.div`
  padding: 12px ${(props) => props.theme.spaceUnits.m};
  margin-top: 0;
  font-weight: 700;
  font-size: ${(props) => props.theme.fontSizes.l};
  border-bottom: 1px solid ${(props) => props.theme.mainColors.primaryDark};
`;

export const ModalContent = styled.div`
  margin: ${(props) => props.theme.spaceUnits.l};
`;

// TODO: Move the transaction modal styles into a separate component structure.
export const TransactionModal = Modal;
export const TransactionModalTitle = ModalTitle;
export const TransactionModalName = styled.span``;
export const TransactionModalNetwork = styled.span`
  float: right;
  font-weight: 400;
  color: ${(props) => props.theme.otherColors.grey};
`;
export const TransactionModalContent = ModalContent;

export const TransactionModalForm = styled.form`
  display: block;
  margin-top: 0;
`;

export const TransactionModalFeeForm = styled.div`
  margin: 0 0 ${(props) => props.theme.spaceUnits.m} 0;
`;

export const TransactionModalActions = styled.div`
  margin-top: ${(props) => props.theme.spaceUnits.xl};
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  text-align: center;
`;

export const TransactionModalAction = styled.div`
  width: 50%;
  & + & {
    margin-left: ${(props) => props.theme.spaceUnits.m};
  }
`;

export const TransactionModalMessages = styled.div`
  margin: ${(props) => props.theme.spaceUnits.m} 0 ${(props) => props.theme.spaceUnits.m} 0;
`;

export const TransactionModalMessagesTable = styled.table`
  margin: 0;
`;

export const TransactionModalMessagesTableBody = styled.tbody``;

export const TransactionModalMessagesTableRow = styled.tr`
  margin: 0;
`;

export const TransactionModalMessagesTableRowLabel = styled.td`
  margin: 0;
  white-space: nowrap;
`;

export const TransactionModalMessagesTableRowQuantity = styled.td`
  padding-left: ${(props) => props.theme.spaceUnits.xs};
`;

// TODO: Move this stuff elsewhere.
export const EthGasStation = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin: 10px 0px 10px 0px;
`;

export const EthGasStationButton = styled.button`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90px;
  border: 1px solid rgb(0, 0, 0, 0.5);
`;

export const EthGasStationButtonGwei = styled.span`
  font-weight: bold;
`;

export const EthGasStationButtonText = styled.span`
  font-size: ${(props) => props.theme.fontSizes.m};
`;

export const CostsTable = styled.table`
  width: 100%;
  font-size: ${(props) => props.theme.fontSizes.m};
`;

export const CostsTableHead = styled.thead`
  font-weight: bold;
  border-bottom: 1px dashed ${(props) => props.theme.otherColors.grey};
`;

export const CostsTableBody = styled.tbody``;

export const CostsTableRow = styled.tr``;

export const CostsTableRowTotal = styled.tr`
  border-top: 1px dashed ${(props) => props.theme.otherColors.grey};
  border-bottom: 1px solid ${(props) => props.theme.otherColors.grey};
`;

export const CostsTableHeaderCellText = styled.th`
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  padding: ${(props) => props.theme.spaceUnits.xs};
  text-align: left;
`;

export const CostsTableHeaderCell = styled.th`
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  padding: ${(props) => props.theme.spaceUnits.xs};
  text-align: right;
`;

export const CostsTableCellText = styled.td`
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  padding: ${(props) => props.theme.spaceUnits.xs};
  text-align: left;
`;

export const CostsTableCell = styled.td`
  padding: ${(props) => props.theme.spaceUnits.xs};
  text-align: right;
`;
