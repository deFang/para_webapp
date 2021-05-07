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

const useMarginAccount = () => {
  const [marginAccount, setMarginAccount] = useState<MarginAccountProps>(undefined);
  const para = usePara();

  const fetchBalance = useCallback(async () => {
    const {SIDE, SIZE, ENTRY_VALUE, CASH_BALANCE, ENTRY_SLOSS} = await para.getMarginAccount();
    setMarginAccount({SIDE, SIZE, ENTRY_VALUE, CASH_BALANCE, ENTRY_SLOSS});
  }, [para, setMarginAccount]);

  useEffect(() => {
    if (para && para?.isUnlocked) {
      fetchBalance().catch(err => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [para]);

  return marginAccount;
};

export default useMarginAccount;
