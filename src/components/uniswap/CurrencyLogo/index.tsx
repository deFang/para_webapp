import {Currency, ETHER, Token} from '@uniswap/sdk'
import React, {useMemo} from 'react'
import styled from 'styled-components'
import BUSDLogo from '../../../assets/img/BUSD-logo.png'
import BitcoinLogo from '../../../assets/img/bitcoin-logo.png'
import EthereumLogo from '../../../assets/img/ethereum-logo.png'
import FeiLogo from '../../../assets/img/fei-logo.png'
import LogoToken from '../LogoToken'

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({size}) => size};
  height: ${({size}) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(LogoToken)<{ size: string }>`
  width: ${({size}) => size};
  height: ${({size}) => size};
  border-radius: ${({size}) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({theme}) => theme.color.white};
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
    return <StyledEthereumLogo src={FeiLogo} size={size} style={style}/>
  }
  if (name === 'ETH') {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style}/>
  }
  if (name === 'BTC') {
    return <StyledEthereumLogo src={BitcoinLogo} size={size} style={style}/>
  }
  return <StyledEthereumLogo src={BUSDLogo} size={size} style={style}/>
}
