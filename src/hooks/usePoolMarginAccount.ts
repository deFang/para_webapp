import {useCallback, useEffect, useState} from 'react';

import {BigNumber} from 'ethers';
import usePara from './usePara';
import config from '../config';

interface MarginAccountProps {
  SIDE: number;
  SIZE: BigNumber;
  ENTRY_VALUE: BigNumber;
  CASH_BALANCE: BigNumber;
  ENTRY_SLOSS: BigNumber;
}

const usePoolMarginAccount = () => {
  const [poolAccount, setPoolAccount] = useState<MarginAccountProps>(undefined);
  const para = usePara();

  const fetchPoolMarginAccount = useCallback(async () => {
    const {SIDE, SIZE, ENTRY_VALUE, CASH_BALANCE, ENTRY_SLOSS} = await para.getPoolMarginAccount();
    setPoolAccount({SIDE, SIZE, ENTRY_VALUE, CASH_BALANCE, ENTRY_SLOSS});
  }, [para?.isUnlocked]);

  useEffect(() => {
    if (para?.isUnlocked) {
      fetchPoolMarginAccount().catch(err => console.error(err.stack));
      const refreshBalance = setInterval(fetchPoolMarginAccount, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [para?.isUnlocked, setPoolAccount]);

  return poolAccount;
};

export default usePoolMarginAccount;
