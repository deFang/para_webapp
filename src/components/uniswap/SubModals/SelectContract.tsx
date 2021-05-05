import React, {useCallback, useContext, useMemo, useState} from 'react'
import {RowBetween, RowFixed} from '../Row'
import {Text} from 'rebass'
import styled from 'styled-components'
import {ArrowLeft, X} from 'react-feather'
import Column, {AutoColumn} from "../Column";
import CurrencyLogo from "../CurrencyLogo";
import {ExternalLinkIcon, TYPE} from "../../../theme";
import {MenuItem, Separator} from "../SearchModal/styleds";
import {useWallet} from "use-wallet";
import {Context as PopupContext} from '../../../contexts/Popups';
import {Tokens} from "../../../contexts/Popups/Popups";


const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
`
const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`
const HalfWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap:10px;
`

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-item: space-between;
  gap: 50px;
  position: relative;
  padding-bottom: 50px;
  max-height: 100%;

  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const FooterWrapper = styled.div`
  width: 100%;
  position: relative;
  background-color: ${({theme}) => theme.color.bg3};
  border-radius: 20px;
`


const Section = styled(AutoColumn)`
  padding: 24px;
`


export default function SelectContract(
  {
    onDismiss,
  }: {
    onDismiss: () => void
  }) {
  // toggle between tokens and lists
  const {chainId} = useWallet()
  const {selectedToken, setSelectedToken} = useContext(PopupContext)
  const userAddedTokens: string[] = ["BTC", "ETH"]

  const handleSelect = useCallback((token: string) => {
      if (token === 'ETH') {
        setSelectedToken(Tokens.ETH)
      }
      if (token === 'BTC') {
        setSelectedToken(Tokens.BTC)
      }
    },
    []
  )

  const isSelected = useCallback((token: string) => {
      if (token == 'ETH' && selectedToken == Tokens.ETH) {
        return true
      }
      if (token == 'BTC' && selectedToken == Tokens.BTC) {
        return true
      }
      return false
    }, [selectedToken]
  )


  const tokenList = useMemo(() => {
    return (chainId &&
      userAddedTokens.map(token => (
        <MenuItem
          key={`token-item-${token}`}
          className={`token-item-${token}`}
          onClick={() => {
            handleSelect(token)
          }}
          disabled={false}
          selected={isSelected(token)}
        >
          <RowBetween width="100%" key={token}>
            <RowFixed>
              <CurrencyLogo name={token} size={'30px'}/>
              <TYPE.main ml={'10px'} fontWeight={600}>
                {token}
              </TYPE.main>
            </RowFixed>
            <RowFixed>
              <ExternalLinkIcon href={""}/>
            </RowFixed>
          </RowBetween>
        </MenuItem>
      ))
    )
  }, [userAddedTokens, chainId])

  return (
    <Wrapper>
      <FooterWrapper>
        <PaddedColumn>
          <RowBetween>
            <ArrowLeft style={{cursor: 'pointer'}} onClick={onDismiss}/>
            <Text fontWeight={500} fontSize={20}>
              Select Contract
            </Text>
            <CloseIcon onClick={onDismiss}/>
          </RowBetween>
        </PaddedColumn>
        <Separator/>
        <Column style={{width: '100%', flex: '1 1'}}>
          <Separator/>
          <PaddedColumn gap="lg">
            {tokenList}
          </PaddedColumn>
        </Column>
      </FooterWrapper>
    </Wrapper>
  )
}
