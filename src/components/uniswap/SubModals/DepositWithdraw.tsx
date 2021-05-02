import React, {useCallback, useState} from 'react'
import {RowBetween} from '../Row'
import {Text} from 'rebass'
import styled from 'styled-components'
import {ArrowLeft, X} from 'react-feather'
import Column, {AutoColumn} from "../Column";
import {Separator} from "../SearchModal/styleds";
import ButtonCornered from "../../ButtonCornered";
import CurrencyInputPanel from "../CurrencyInputPanel";
import useSpotPrice from "../../../hooks/useSpotPrice";
import useIndexPrice from "../../../hooks/useIndexPrice";
import usePara from "../../../hooks/usePara";
import PricePanel from "../../../views/Trade/component/PricePanel";
import useAvailableMarginBalance from "../../../hooks/useAvailableMarginBalance";
import UserInfoBulletin from "./Component/UserInfoBulletin";
import PoolInfoBulletin from "./Component/PoolInfoBulletin";
import {BN2display, decimal2BN, decimalDiv, decimalMul} from "../../../utils/Converter";
import useHandleTransactionReceipt from "../../../hooks/useHandleTransactionReceipt";
import useModal from "../../../hooks/useModal";
import ConfirmModal from "../../Confirm/components/ConfirmModal";
import Spacer from "../../Spacer";
import useTestUSDTBalance from "../../../hooks/useTestUSDTBalance";
import {TYPE} from "../../../theme";
import {RowFixed} from "../../Row";

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

const Section = styled(AutoColumn)`
  padding: 24px;
`

const BottomSection = styled(Section)`
  
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

export default function DepositWithdraw(
  {
    onDismiss,
    depositOpen = true
  }: {
    onDismiss: () => void
    depositOpen?: boolean
  }) {
  // toggle between tokens and lists
  const para = usePara()
  const testUSDTBalance = useTestUSDTBalance()
  const availableMarginBalance = useAvailableMarginBalance()
  const [showDeposit, setShowDeposit] = useState(depositOpen)
  const [collateralVal, setCollateralVal] = useState('0')

  const handleTypeInput = useCallback(
    (collateralVal: string) => {
      setCollateralVal(collateralVal)
    },
    [setCollateralVal]
  )


  const handleDeposit = useCallback(
    async () => {
      await para?.traderDeposit(collateralVal);
    }, [collateralVal]
  )

  const handleWithdraw = useCallback(
    async () => {
      await para?.traderWithdraw(collateralVal);
    }, [collateralVal]
  )

  const handleOnMaxDeposit = useCallback(
    () => {
      const balance = BN2display(testUSDTBalance)
      setCollateralVal(String(balance));
    },
    [testUSDTBalance]
  )


  const handleOnMaxWithdraw = useCallback(
    () => {
      const balance = BN2display(availableMarginBalance)
      setCollateralVal(String(balance));
    },
    [availableMarginBalance]
  )


  return (
    <>
      <Wrapper>
        <FooterWrapper>
          <PaddedColumn>
            <RowBetween>
              <ArrowLeft style={{cursor: 'pointer'}} onClick={onDismiss}/>
              <Text fontWeight={500} fontSize={20}>
                Transfer Margin
              </Text>
              <CloseIcon onClick={onDismiss}/>
            </RowBetween>
          </PaddedColumn>
          <Separator/>
          <PaddedColumn style={{paddingBottom: 0}}>
            <ToggleWrapper>
              <ToggleOption onClick={() => setShowDeposit(!showDeposit)} active={showDeposit}>
                DEPOSIT
              </ToggleOption>
              <ToggleOption onClick={() => setShowDeposit(!showDeposit)} active={!showDeposit}>
                WITHDRAW
              </ToggleOption>
            </ToggleWrapper>
          </PaddedColumn>


          <Column style={{width: '100%', flex: '1 1'}}>
            <PaddedColumn gap="14px">
            </PaddedColumn>
            <Separator/>

            <PaddedColumn gap="lg">
              {
                showDeposit ? (
                  <CurrencyInputPanel
                    value={collateralVal}
                    onUserInput={handleTypeInput}
                    onMax={handleOnMaxDeposit}
                    showMaxButton={true}
                    label={'Amount'}
                    headerLabel={`Wallet Balance: ${BN2display(testUSDTBalance)}`}
                    id="deposit-collateral"
                  />
                ) : (
                  <CurrencyInputPanel
                    value={collateralVal}
                    onUserInput={handleTypeInput}
                    onMax={handleOnMaxWithdraw}
                    showMaxButton={true}
                    label={'Amount'}
                    headerLabel={`Wallet Balance: ${BN2display(testUSDTBalance)}`}
                    id="withdraw-collateral"
                  />
                )
              }
              <RowFixed>
                <TYPE.black fontSize={14} fontWeight={500} color={"#C3C5CB"}>
                  {`Available Margin: ${BN2display(availableMarginBalance)}`}
                </TYPE.black>
              </RowFixed>
            </PaddedColumn>
          </Column>
          <SubWrapper>
            {showDeposit
              ? (<ButtonCornered text="DEPOSIT" variant="secondary" onClick={handleDeposit}/>)
              : (<ButtonCornered text="WITHDRAW" variant="secondary" onClick={handleWithdraw}/>)
            }
          </SubWrapper>
        </FooterWrapper>


        <FooterWrapper>
          <PaddedColumn>
            <BottomSection gap="12px">
              <UserInfoBulletin
              />
              <Spacer/>
              <PoolInfoBulletin
              />
            </BottomSection>
          </PaddedColumn>
        </FooterWrapper>


      </Wrapper>
    </>


  )
}
