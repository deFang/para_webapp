import React, {createContext, useCallback, useState} from 'react'

export enum Tokens {
  BTC,
  ETH,
  FEI,
}


interface ModalsContext {
  selectedToken: Tokens,
  setSelectedToken: (token: Tokens) => void,
}



export const Context = createContext<ModalsContext>({
  selectedToken: Tokens.BTC,
  setSelectedToken: (token)=>{},
});

const Popups: React.FC = ({ children }) => {
  const [selectedToken, setToken] = useState<Tokens>(Tokens.BTC)

  const setSelectedToken = useCallback((token: Tokens) => {
    setToken(token)
  }, [setToken])



  return (
    <Context.Provider value={{
      selectedToken: selectedToken,
      setSelectedToken: setSelectedToken,
    }}>
      {children}
    </Context.Provider>
  )
}

export default Popups