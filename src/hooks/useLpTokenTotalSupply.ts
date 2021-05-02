import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import usePara from './usePara';
import config from '../config';

const useLpTokenTotalSupply = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const para = usePara();

  const fetchBalance = useCallback(async () => {
    const balance = await para.getLpTokenTotalSupply();
    setBalance(balance);
  }, [para?.isUnlocked]);

  useEffect(() => {
    if (para?.isUnlocked) {
      fetchBalance().catch(err => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [para?.isUnlocked, setBalance]);

  return balance;
};

export default useLpTokenTotalSupply;
