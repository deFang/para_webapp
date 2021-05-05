import React from 'react'
import styled from 'styled-components'
import BUSDLogo from '../../../assets/img/BUSD-logo.png'
import BitcoinLogo from '../../../assets/img/bitcoin-logo.png'
import EthereumLogo from '../../../assets/img/ethereum-logo.png'
import FeiLogo from '../../../assets/img/fei-logo.png'
import BitcoinLpLogo from '../../../assets/img/BUSD-BTC.png'
import EthereumLpLogo from '../../../assets/img/BUSD-ETH.png'

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const StyledEthereumLogo = styled.img<{ size: string, lp: boolean }>`
  width: ${({size, lp}) => lp ? '36px' : size};
  height: ${({size}) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

export default function CurrencyLogo(
  {
    name,
    size = '24px',
    style
  }: {
    name: string
    size?: string
    style?: React.CSSProperties
  }) {
  if (name === 'FEI') {
    return <StyledEthereumLogo src={FeiLogo} size={size} lp={false} style={style}/>
  }
  if (name === 'ETH') {
    return <StyledEthereumLogo src={EthereumLogo} size={size} lp={false} style={style}/>
  }
  if (name === 'BTC') {
    return <StyledEthereumLogo src={BitcoinLogo} size={size} lp={false} style={style}/>
  }
  if (name === 'BUSD-BTC') {
    return <StyledEthereumLogo src={BitcoinLpLogo} size={size} lp={true} style={style}/>
  }
  if (name === 'BUSD-ETH') {
    return <StyledEthereumLogo src={EthereumLpLogo} size={size} lp={true} style={style}/>
  }
  return <StyledEthereumLogo src={BUSDLogo} size={size} lp={false} style={style}/>
}
