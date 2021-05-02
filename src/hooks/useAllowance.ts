import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import ERC20 from '../para/ERC20';
import ERC20Mintable from "../para/ERC20Mintable";

const useAllowance = (token: ERC20Mintable, spender: string, pendingApproval?: boolean) => {
  const [allowance, setAllowance] = useState<BigNumber>();
  const { account } = useWallet();

  const fetchAllowance = useCallback(async () => {
    const allowance = await token.allowance(account!, spender);
    console.log(`Allowance: ${allowance.toString()} ${token.symbol} for ${spender}`);
    setAllowance(allowance);
  }, [account, spender, token]);

  useEffect(() => {
    if (account && spender && token) {
      fetchAllowance().catch((err) => console.log(`Failed to fetch allowance: ${err.stack}`));
    }
  }, [account, spender, token, pendingApproval]);

  console.log(`pendingApproval, ${pendingApproval} account ${account} spender ${spender} token ${token}`)
  return allowance;
};

export default useAllowance;
