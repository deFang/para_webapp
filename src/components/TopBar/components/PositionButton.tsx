import React, {useMemo} from 'react';
import styled from 'styled-components';

import {useWallet} from 'use-wallet';

import useModal from '../../../hooks/useModal';

import Button from '../../Button';
import {getAddress} from '@ethersproject/address'
import {useAllTransactions} from "../../../state/transactions/hooks";
import PositionModal from "./PositionModal";

function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

interface AccountButtonProps {
}

const PositionButton: React.FC<AccountButtonProps> = (props) => {

  const {account, connect} = useWallet()
  const allTransactions = useAllTransactions();

  const pendingTransactions = useMemo(
    () => Object.values(allTransactions).filter((tx) => !tx.receipt).length,
    [allTransactions],
  );

  const [onPresentTransactionModal, onDismissTransactionModal] = useModal(
    <PositionModal onDismiss={() => onDismissTransactionModal()}/>,
  );

  return (
    <StyledAccountButton>
      {!account ? (
        <Button
          onClick={() => connect('injected')}
          size="sm"
          text="Unlock Wallet"
        />
      ) : (
        <Button
          onClick={() => onPresentTransactionModal()}
          size="sm"
          text={shortenAddress(account)}
        />
      )}
    </StyledAccountButton>
  )
}

const StyledAccountButton = styled.div``

export default PositionButton
