import React from 'react';
import styled from 'styled-components';
import Button from "../../../components/Button";
import Modal, {ModalProps} from '../../../components/Modal';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from "../../../components/TokenInput";
import usePara from "../../../hooks/usePara";


const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  console.log("accountModal")
  const para = usePara();
  console.log(`para ${para}`);
  console.log(para);
  const approve = async () => {
    try {
      let process = await para?.getTestUSDTApproval();
      } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal>
      <ModalTitle text="Deposit" />
      <div> {para?.myAccount} </div>
      <Button
          onClick={approve}
          size="sm"
          text="Approve"
        />
      <StyledBalanceWrapper>
        <TokenInput max={1000} symbol={"USDT"} onChange={() => {}} value={"10000"} />
      </StyledBalanceWrapper>
    </Modal>
  )
}

const StyledValue = styled.div`
  color: ${props => props.theme.color.grey[300]};
  font-size: 30px;
  font-weight: 700;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const Balances = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing[4]}px;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 ${props => props.theme.spacing[3]}px;
`

const StyledBalanceIcon = styled.div`
  font-size: 36px;
  margin-right: ${props => props.theme.spacing[3]}px;
`

const StyledBalanceActions = styled.div`
  align-items: center;
  display: flex;
  margin-top: ${props => props.theme.spacing[4]}px;
`

export default AccountModal