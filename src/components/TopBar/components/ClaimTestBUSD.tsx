import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import Button from '../../Button';
import { isTransactionRecent, useAllTransactions } from '../../../state/transactions/hooks';
import useModal from '../../../hooks/useModal';
import TxModal from './TxModal';
import usePoolMarginAccount from "../../../hooks/usePoolMarginAccount";
import usePara from "../../../hooks/usePara";
import useHandleTransactionReceipt from "../../../hooks/useHandleTransactionReceipt";
import {decimal2BN} from "../../../utils/Converter";

interface TxButtonProps {}

const ClaimTestBUSDButton: React.FC<TxButtonProps> = () => {
  const { account } = useWallet();
  const para = usePara();

  const handleTransactionReceipt = useHandleTransactionReceipt();
  const handleClaim = useCallback(
    () => {
      handleTransactionReceipt(
        para.claimTestBUSD(),
        'Claim TestBUSD',
      );
    }, [para]);




  return (
    <>
      {!!account && (
        <StyledTxButton>
          <Button
            size="sm"
            text={'Claim TestBUSD'}
            variant={'default'}
            onClick={handleClaim}
          />
        </StyledTxButton>
      )}
    </>
  );
};

const StyledTxButton = styled.div`
  margin-right: ${(props) => props.theme.spacing[4]}px;
`;

export default ClaimTestBUSDButton;
