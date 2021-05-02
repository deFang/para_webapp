import React, { useRef, RefObject, useCallback, useState, useMemo } from 'react'
import Column from '../Column'
import { PaddedColumn, Separator, SearchInput } from './styleds'
import Row, { RowBetween, RowFixed } from '../Row'
import { TYPE, ExternalLinkIcon, TrashIcon, ButtonText, ExternalLink } from '../../../theme'
import styled from 'styled-components'

import { Token } from '@uniswap/sdk'
import CurrencyLogo from '../CurrencyLogo'
import Button from "../../Button";
import ButtonCornered from "../../ButtonCornered";



const Wrapper = styled.div`
  width: 100%;
  height: 100%
  position: relative;
  padding-bottom: 60px;
`

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-top: 1px solid ${({ theme }) => theme.color.bg3};
  background-color: ${({ theme }) => theme.color.white};
  padding: 20px;
  text-align: left;
`

const FooterButton = styled.button`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.color.bg3};
  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-top: 1px solid ${({ theme }) => theme.color.bg3};
  padding: 20px;
  text-align: left;
`

export default function ManageTokens() {

  // all tokens for local lisr
  const userAddedTokens: string[] = ["ETH", "FEI"]

  const tokenList = useMemo(() => {
    return (
      userAddedTokens.map(token => (
        <RowBetween width="100%">
          <RowFixed>
            <CurrencyLogo name={token} size={'30px'} />
              <TYPE.main ml={'10px'} fontWeight={600}>
                {token}
              </TYPE.main>
          </RowFixed>
          <RowFixed>
            <TrashIcon onClick={() => {}} />
            <ExternalLinkIcon href={""} />
          </RowFixed>
        </RowBetween>
      ))
    )
  }, [userAddedTokens])

  return (
    <Wrapper>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap="14px">
        </PaddedColumn>
        <Separator />
        <PaddedColumn gap="lg">
          {tokenList}
        </PaddedColumn>
      </Column>
      {/*<Footer>*/}
        {/*<TYPE.darkGray>Tip: Custom tokens</TYPE.darkGray>*/}
      <ButtonCornered text="SELL/SHORT" variant="secondary" onClick={() => {}}/>
      {/*</Footer>*/}

    </Wrapper>
  )
}
