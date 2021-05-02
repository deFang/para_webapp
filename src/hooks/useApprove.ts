import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import ERC20 from '../para/ERC20';
import ERC20Mintable from "../para/ERC20Mintable";

const APPROVE_AMOUNT = ethers.constants.MaxUint256;
const APPROVE_BASE_AMOUNT = BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffc9ca36523a215ffff"); // truffle dapp max


export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useApprove(token: ERC20Mintable, spender: string): [ApprovalState, () => Promise<void>] {
  const pendingApproval = useHasPendingApproval(token.address, spender);
  const currentAllowance = useAllowance(token, spender, pendingApproval);


  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    console.log("APPROVE_BASE_AMOUNT",APPROVE_BASE_AMOUNT.toString())
    console.log("currentAllowance", currentAllowance.toString())
    const state = currentAllowance.lt(APPROVE_BASE_AMOUNT)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
    console.log("state", state)
    console.log(currentAllowance.lt(APPROVE_BASE_AMOUNT), currentAllowance.toHexString(), APPROVE_BASE_AMOUNT.toHexString())
    return state
  }, [currentAllowance, pendingApproval]);

  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }
    console.log('token', token)

    const response = await token.approve(spender, APPROVE_AMOUNT);
    addTransaction(response, {
      summary: `Approve ${token.symbol}`,
      approval: {
        tokenAddress: token.address,
        spender: spender,
      },
    });
  }, [approvalState, token, spender, addTransaction]);

  return [approvalState, approve];
}

export default useApprove;
