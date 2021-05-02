import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import usePara from './usePara';
import config from '../config';

const useMarkPrice = () => {
  const [price, setPrice] = useState<BigNumber | undefined>(undefined);
  const para = usePara();

  const fetchPrice = useCallback(async () => {
      setPrice(await para.getTwapPrice());
  }, [para]);

  useEffect(() => {
      fetchPrice().catch(err => console.error(err.stack));
      const refreshBalance = setInterval(fetchPrice, config.refreshInterval);
      return () => clearInterval(refreshBalance);
  }, [setPrice, para]);

  return price;
};

export default useMarkPrice;
