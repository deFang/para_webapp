import React, {useMemo, useState, useCallback} from 'react'
import {RowBetween, RowFixed} from '../Row'
import {Text} from 'rebass'
import styled from 'styled-components'
import {ArrowLeft, X} from 'react-feather'
import Column, {AutoColumn} from "../Column";
import {Separator} from "../SearchModal/styleds";
import ButtonCornered from "../../ButtonCornered";
import CurrencyInputPanel from "../CurrencyInputPanel";
import BuySellFooter from "./Component/BuySellFooter";
import usePara from "../../../hooks/usePara";
import useTestUSDTBalance from "../../../hooks/useTestUSDTBalance";
import {getDisplayBalance, getBalance} from "../../../utils/formatBalance"
import {BN2display} from "../../../utils/Converter";
import useLpTokenBalance from "../../../hooks/useLpTokenBalance";
import useLpTokenTotalSupply from "../../../hooks/useLpTokenTotalSupply";
import {TYPE} from "../../../theme";

const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
`
const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  padding-bottom: 50px;
  max-height: 100%;
  border-radius: 20px;
`

const FooterWrapper = styled.div`
  width: 100%;
  position: relative;
  background-color: ${({theme}) => theme.color.bg3};
  border-radius: 20px;
`

const ToggleWrapper = styled(RowBetween)`
  background-color: ${({theme}) => theme.color.bg3};
  border-radius: 12px;
  padding: 0px;
`

const ToggleOption = styled.div<{ active?: boolean }>`
  width: 50%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  background-color: ${({theme, active}) => (active ? theme.color.primary1 : theme.color.bg3)};
  color: ${({theme, active}) => (active ? theme.color.text1 : theme.color.text2)};
  user-select: none;
`

const SubWrapper = styled.div`
  width: 100%;
  height: 100%
  position: relative;
  padding-bottom: 60px;
`


export default function LiquidityAddRemove(
  {
    onDismiss,
    addOpen = true
  }: {
    onDismiss: () => void
    addOpen?: boolean
  }) {
  // toggle between tokens and lists
  const [showLists, setShowLists] = useState(addOpen)
  const userAddedTokens: string[] = ["ETH", "FEI"]

  const para = usePara()
  const testUSDTBalance = useTestUSDTBalance()
  const lpTokenBalance = useLpTokenBalance()
  const lpTokenTotalSupply = useLpTokenTotalSupply()
  const [price, setPrice] = useState("60000")
  const [amount, setAmount] = useState('0.1')
  const [collateralVal, setCollateralVal] = useState<string>('0')
  const handleTypeInput = useCallback(
    (collateralVal: string) => {
      setCollateralVal(collateralVal)
      return collateralVal
    },
    [collateralVal]
  )
  const handleAdd = useCallback(
    async () => {
      await para?.lpAdd(collateralVal);
    }, [collateralVal]
  )

  const handleRemove = useCallback(
    async () => {
      await para?.lpRemove(collateralVal);
    }, [collateralVal]
  )

  const handleOnMax = useCallback(
    () => {
      const balance = BN2display(testUSDTBalance)
      setCollateralVal(String(balance));
    },
    [testUSDTBalance]
  )

  return (
    <>
      <Wrapper>
        <FooterWrapper>
          <PaddedColumn>
            <RowBetween>
              <ArrowLeft style={{cursor: 'pointer'}} onClick={onDismiss}/>
              <Text fontWeight={500} fontSize={20}>
                LP TRANSFER
              </Text>
              <CloseIcon onClick={onDismiss}/>
            </RowBetween>
          </PaddedColumn>
          <Separator/>
          <PaddedColumn style={{paddingBottom: 0}}>
            <ToggleWrapper>
              <ToggleOption onClick={() => setShowLists(!showLists)} active={showLists}>
                ADD LP
              </ToggleOption>
              <ToggleOption onClick={() => setShowLists(!showLists)} active={!showLists}>
                REMOVE LP
              </ToggleOption>
            </ToggleWrapper>
          </PaddedColumn>


          <Column style={{width: '100%', flex: '1 1'}}>
            <PaddedColumn gap="14px">
            </PaddedColumn>
            <Separator/>
            <PaddedColumn gap="lg">
              <CurrencyInputPanel
                value={collateralVal}
                onUserInput={handleTypeInput}
                onMax={handleOnMax}
                showMaxButton={true}
                label={'Amount'}
                headerLabel={`Wallet Balance: ${BN2display(testUSDTBalance)} TestUSDT`}
                id="buysell-collateral"
              />
            </PaddedColumn>
            <RowFixed>
              <TYPE.black fontSize={14} fontWeight={500} color={"#C3C5CB"}>
                {`lp token balance: ${BN2display(lpTokenBalance)} total supply ${BN2display(lpTokenTotalSupply)}`}
              </TYPE.black>
            </RowFixed>
          </Column>
          <SubWrapper>
            {showLists
              ? (<ButtonCornered text="ADD" variant="secondary" onClick={handleAdd}/>)
              : (<ButtonCornered text="REMOVE" variant="secondary" onClick={handleRemove}/>)
            }
          </SubWrapper>
        </FooterWrapper>

      </Wrapper>
    </>


  )
}
