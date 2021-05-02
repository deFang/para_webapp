import {Currency, Pair} from '@uniswap/sdk'
import React, {useContext} from 'react'
import styled, {ThemeContext} from 'styled-components'
import {darken} from 'polished'


import {RowBetween} from '../Row'
import {TYPE} from '../../../theme'
import {Input as NumericalInput} from '../NumericalInput'
import {useWallet} from 'use-wallet';
import CurrencyLogo from "../CurrencyLogo";


const InputRow = styled.div<{ selected: boolean }>`
  ${({theme}) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({selected}) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`


const LabelRow = styled.div`
  ${({theme}) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({theme}) => theme.color.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({theme}) => darken(0.2, theme.color.text2)};
  }
`


const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({theme}) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({hideInput}) => (hideInput ? '8px' : '20px')};
  background-color: ${({theme}) => theme.color.bg2};
  z-index: 1;
  width: 100%;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({hideInput}) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({theme}) => theme.color.bg2};
  background-color: ${({theme}) => theme.color.grey[800]};
`


const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({theme}) => theme.color.primary5};
  border: 1px solid ${({theme}) => theme.color.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({theme}) => theme.color.primaryText1};
  :hover {
    border: 1px solid ${({theme}) => theme.color.primary1};
  }
  :focus {
    border: 1px solid ${({theme}) => theme.color.primary1};
    outline: none;
  }

  ${({theme}) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton?: boolean
  label?: string
  headerLabel?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  currencyName?: string | null
  showCurrency?: boolean
}

export default function CurrencyInputPanel({
  value,
  label,
  headerLabel,
  onUserInput, onMax,
  disableCurrencySelect = false,
  hideInput = false,
  showMaxButton = false,
  currencyName,
  showCurrency,
  id}: CurrencyInputPanelProps) {
  const theme = useContext(ThemeContext)
  const {account} = useWallet()

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.color.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
              {1 && (
                <TYPE.body
                  onClick={onMax}
                  color={theme.color.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{display: 'inline', cursor: 'pointer'}}
                >
                  {headerLabel}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? {padding: '0', borderRadius: '8px'} : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              {showCurrency && <CurrencyLogo name={currencyName!} style={{paddingRight: '2%'}}/>}
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />
              {account && showMaxButton && label !== 'To' && (
                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
              )}
            </>
          )}
        </InputRow>
      </Container>
    </InputPanel>
  )
}
