import React, {useCallback, useEffect, useState} from 'react'
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
import {decimalStr} from "../../../utils/formatBalance";
import useMarginAccount from "../../../hooks/useMarginAccount";
import {BigNumber} from "ethers";
import {Side} from "../../../utils/Types";

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
    gap: 50px;
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

export default function BuySell(
  {
    onDismiss,
    buyOpen = true
  }: {
    onDismiss: () => void
    buyOpen?: boolean
  }) {
  // toggle between tokens and lists
  const para = usePara();
  const [showBuy, setShowBuy] = useState(buyOpen)
  const userAddedTokens: string[] = ["ETH", "FEI"]
  const spotPrice = useSpotPrice();
  const indexPrice = useIndexPrice();
  const marginAccount = useMarginAccount()

  const [contractSize, setContractSize] = useState('')
  const [collateralAmount, setCollateralAmount] = useState('')


  const handleInputCollateralAmount = useCallback(
    (collateralAmount: string) => {
      setCollateralAmount(collateralAmount)
      if (spotPrice && collateralAmount) {
        const collateralBN = decimal2BN(collateralAmount)
        setContractSize(BN2display(decimalDiv(collateralBN, spotPrice)))
      }
      return collateralAmount
    },
    [collateralAmount, spotPrice]
  )

  const handleInputContractSize = useCallback(
    (contractSize: string) => {
      setContractSize(contractSize)
      if (spotPrice && contractSize) {
        const contractBN = decimal2BN(contractSize)
        setCollateralAmount(BN2display(decimalMul(contractBN, spotPrice)))
      }

      return contractSize
    },
    [contractSize, spotPrice]
  )


  const availableMarginBalance = useAvailableMarginBalance()
  const handleOnMaxContractSize = useCallback(
    async () => {
      const val = decimalMul(decimalDiv(availableMarginBalance, await para.getInitialMarginRate()), decimal2BN("0.9"))
      const contractBN = decimalDiv(val, spotPrice)
      setContractSize(BN2display(contractBN))
      if (spotPrice && contractBN) {
        setCollateralAmount(BN2display(decimalMul(contractBN, spotPrice)))
      }
    },
    [availableMarginBalance, contractSize]
  )

  const handleOnMaxCollateral = useCallback(
    () => {
      const balance = BN2display(availableMarginBalance)
      setCollateralAmount(String(balance));
    },
    [availableMarginBalance]
  )


  const handleTransactionReceipt = useHandleTransactionReceipt();
  const handleBuy = useCallback(
    () => {
      handleTransactionReceipt(
        para.buyBaseToken(decimal2BN(contractSize)),
        `Buy ${contractSize} BTC`,
      );
    }, [para, contractSize]);


  const handleSell = useCallback(
    () => {
      handleTransactionReceipt(
        para.sellBaseToken(decimal2BN(contractSize)),
        `Sell ${contractSize} BTC`,
      );
    }, [para, contractSize]);


  const handleMarketClose = useCallback(
    () => {
      const size = marginAccount.SIZE
      const side = marginAccount.SIDE
      if (side == Side.LONG) {
        setShowBuy(false)
        setContractSize(BN2display(size, 18))
      } else if (side == Side.SHORT) {
        setShowBuy(true)
        setContractSize(BN2display(size, 18))
      } else {
        setContractSize("0")
      }
      if (spotPrice) {
        setCollateralAmount(BN2display(decimalMul(size, spotPrice)))
      }
    }, [para, marginAccount]);

  const [onPresentSellConfirmModal, onDismissSellConfirmModal] = useModal(
    <ConfirmModal onDismiss={() => onDismissSellConfirmModal()} onConfirm={handleSell} isBuy={false}
                  contractSize={contractSize}/>,
  );

  const [onPresentBuyConfirmModal, onDismissBuyConfirmModal] = useModal(
    <ConfirmModal onDismiss={() => onDismissBuyConfirmModal()} onConfirm={handleBuy} isBuy={true}
                  contractSize={contractSize}/>,
  );


  return (
    <>
      <Wrapper>
        <FooterWrapper>
          <PaddedColumn>
            <RowBetween>
              <ArrowLeft style={{cursor: 'pointer'}} onClick={onDismiss}/>
              <Text fontWeight={500} fontSize={20}>
                Place Order
              </Text>
              <CloseIcon onClick={onDismiss}/>
            </RowBetween>
          </PaddedColumn>
          <Separator/>
          <PaddedColumn>
            <ToggleWrapper>
              <ToggleOption onClick={() => setShowBuy(!showBuy)} active={showBuy}>
                BUY/LONG
              </ToggleOption>
              <ToggleOption onClick={() => setShowBuy(!showBuy)} active={!showBuy}>
                SELL/SHORT
              </ToggleOption>
            </ToggleWrapper>
          </PaddedColumn>
          <Separator/>
          <Column style={{width: '100%', flex: '1 1'}}>
            <PaddedColumn gap="lg">
              <PricePanel showHeaderLabel={true} id={'PlaceOrder-Price'} showCurrency={false}
                          currencyName={'BUSD'}/>
            </PaddedColumn>
            <PaddedColumn gap="lg">
              <CurrencyInputPanel
                value={contractSize}
                onUserInput={handleInputContractSize}
                onMax={handleOnMaxContractSize}
                showMaxButton={true}
                label={'Contract Size'}
                id="buysell-size"
                showCurrency={true}
                currencyName={'BTC'}
              />
              <CurrencyInputPanel
                value={collateralAmount}
                onUserInput={handleInputCollateralAmount}
                onMax={handleOnMaxCollateral}
                showMaxButton={false}
                label={'Est. Value'}
                id="buysell-collateral"
                showCurrency={true}
                currencyName={'BUSD'}
              />
            </PaddedColumn>
          </Column>
          <SubWrapper>
            {showBuy
              ? (<ButtonCornered text="BUY/LONG" variant="secondary" onClick={() => onPresentBuyConfirmModal()}
                                 disabled={Number(contractSize) <= 0}/>)
              : (
                <ButtonCornered text="SELL/SHORT" variant="secondary" onClick={() => onPresentSellConfirmModal()}
                                disabled={Number(contractSize) <= 0}/>)
            }
            {/*<ButtonCornered text="SELL/SHORT" variant="secondary" onClick={() => {}}/>*/}
          </SubWrapper>
        </FooterWrapper>


        <FooterWrapper>
          <PaddedColumn>
            <BottomSection gap="12px">
              <UserInfoBulletin showMarketClose={true} handleMarketClose={handleMarketClose}/>
              <Spacer/>
              <PoolInfoBulletin/>
            </BottomSection>
          </PaddedColumn>
        </FooterWrapper>


      </Wrapper>
    </>


  )
}
