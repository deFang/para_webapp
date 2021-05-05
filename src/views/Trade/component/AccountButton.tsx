import React from 'react';
import styled from 'styled-components';

import {useWallet} from 'use-wallet';
import Button from "../../../components/Button";
import AccountModal from "./AccountModal";
import useModal from "../../../hooks/useModal";

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {

  const [onPresentAccountModal] = useModal(<AccountModal />)
  const { account, connect } = useWallet()

  return (
    <StyledAccountButton>
      {!account ? (
          <StyledAccountButton>
        <Button
          onClick={() => connect('injected')}
          size="sm"
          text="Unlock Wallet"
        />
        </StyledAccountButton>
      ) : (
          <StyledAccountButton>
        <Button
          size="sm"
          text="Deposit"
          onClick={onPresentAccountModal}
        />
        <Button
          size="sm"
          text="Withdrawl"
          onClick={onPresentAccountModal}
        />
        </StyledAccountButton>
      )}
    </StyledAccountButton>
  )
}

const StyledAccountButton = styled.div``

export default AccountButton