import {useCallback, useEffect, useState} from 'react';

import {BigNumber} from 'ethers';
import usePara from './usePara';
import config from '../config';

const useTestUSDTBalance = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const para = usePara();

  const fetchBalance = useCallback(async () => {
    const balance = await para.getTestUSDTBalance();
    setBalance(balance);
  }, [para, setBalance]);

  useEffect(() => {
    if (para && para.isUnlocked) {
      fetchBalance().catch(err => console.error(err.stack));
      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [para]);

  return balance;
};

export default useTestUSDTBalance;
