import React, {createContext, useEffect, useState} from 'react';
import {useWallet} from 'use-wallet';
import Para from '../../para';
import config from '../../config';

export interface ParaContext {
  para?: Para;
}

export const Context = createContext<ParaContext>({para: undefined});

export const ParaProvider: React.FC = ({children}) => {
  const {ethereum, account, chainId, status, error} = useWallet();
  console.log('useWallet', account, chainId, ethereum);
  console.log('status', status, 'error', error)
  const [para, setPara] = useState<Para>();

  // useEffect(() => {
  //     if (!para) {
  //         const para = new Para(config);
  //         if (account) {
  //             // wallet was unlocked at initialization
  //             para.unlockWallet(ethereum, account, chainId);
  //         }
  //         setPara(para);
  //     }
  //     else if (account) {
  //         para.unlockWallet(ethereum, account, chainId);
  //     }
  //     console.log('account change', account);
  // }, [account, chainId, status]);

  useEffect(() => {
    const para = new Para(config);
    if (account) {
      // wallet was unlocked at initialization
      para.unlockWallet(ethereum, account, chainId);
    }
    setPara(para);
    console.log('account change', account);
  }, [account, chainId, status]);


  return <Context.Provider value={{para}}>{children}</Context.Provider>;
};
