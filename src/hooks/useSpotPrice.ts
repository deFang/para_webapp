import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import usePara from './usePara';
import config from '../config';

const useSpotPrice = () => {
  const [price, setPrice] = useState<BigNumber | undefined>(undefined);
  const para = usePara();

  const fetchPrice = useCallback(async () => {
    console.log('para.isUnlocked', para.isUnlocked)
    if (para.isUnlocked) {
      setPrice(await para.getSpotPrice())
    };
  }, [para?.isUnlocked]);

  useEffect(() => {
      fetchPrice().catch(err => console.error(err.stack));
      const refreshBalance = setInterval(fetchPrice, config.refreshInterval);
      return () => clearInterval(refreshBalance);
  }, [para?.isUnlocked]);

  return price;
};

export default useSpotPrice;
