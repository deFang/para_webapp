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
import {BN2display, decimal2BN} from "../../../utils/Converter";
import useLpTokenBalance from "../../../hooks/useLpTokenBalance";
import useLpTokenTotalSupply from "../../../hooks/useLpTokenTotalSupply";
import {TYPE} from "../../../theme";
import useHandleTransactionReceipt from "../../../hooks/useHandleTransactionReceipt";

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
  border-radius: 20px;
  
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
  @media (max-width: 768px) {
    margin-bottom: 50px;
  }
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

const Section = styled(AutoColumn)`
  padding: 24px;
`

const BottomSection = styled(Section)`
  
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
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

  const handleTransactionReceipt = useHandleTransactionReceipt();
  const handleAdd = useCallback(
    () => {
      handleTransactionReceipt(
        para.lpAdd(decimal2BN(collateralVal)),
        `LP Add ${collateralVal} BUSD`,
      );
    }, [para, collateralVal]);

  const handleRemove = useCallback(
    () => {
      handleTransactionReceipt(
        para.lpRemove(decimal2BN(collateralVal)),
        `LP Remove ${collateralVal} LP Token`,
      );
    }, [para, collateralVal]);


  const handleOnAddMax = useCallback(
    () => {
      const balance = BN2display(testUSDTBalance)
      setCollateralVal(String(balance));
    },
    [testUSDTBalance]
  )

  const handleOnRemoveMax = useCallback(
    () => {
      const balance = BN2display(lpTokenBalance)
      setCollateralVal(String(balance));
    },
    [lpTokenBalance]
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
          <PaddedColumn>
            <ToggleWrapper>
              <ToggleOption onClick={() => setShowLists(!showLists)} active={showLists}>
                ADD LP
              </ToggleOption>
              <ToggleOption onClick={() => setShowLists(!showLists)} active={!showLists}>
                REMOVE LP
              </ToggleOption>
            </ToggleWrapper>
          </PaddedColumn>
          <Separator/>
          <Column style={{width: '100%', flex: '1 1'}}>
            <PaddedColumn gap="lg">
              {showLists
              ? ( <CurrencyInputPanel
                value={collateralVal}
                onUserInput={handleTypeInput}
                onMax={handleOnAddMax}
                showMaxButton={true}
                label={'Amount'}
                headerLabel={`Wallet Balance: ${BN2display(testUSDTBalance)} BUSD`}
                id="addlp"
                showCurrency={true}
                currencyName={'BUSD'}
              />)
              : ( <CurrencyInputPanel
                value={collateralVal}
                onUserInput={handleTypeInput}
                onMax={handleOnRemoveMax}
                showMaxButton={true}
                label={'Amount'}
                headerLabel={`Wallet Balance: ${BN2display(testUSDTBalance)} BUSD`}
                id="removelp"
                showCurrency={true}
                currencyName={'BUSD-BTC'}
              />)
            }
              <RowFixed>
                <TYPE.black fontSize={14} fontWeight={500} color={"#C3C5CB"}>
                  {`LP Balance: ${BN2display(lpTokenBalance)}`}
                </TYPE.black>
              </RowFixed>
            </PaddedColumn>
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
