import React, {useCallback, useContext, useEffect, useState} from 'react';
import Modal from '../../Modal';
import Button from '../../Button';
import styled, {ThemeContext} from 'styled-components';
import {TextProps} from 'rebass'
import {TextWrapper} from "../../../theme";
import QuestionHelper from "../../uniswap/QuestionHelper";
import CurrencyLogo from "../../uniswap/CurrencyLogo";
import Spacer from "../../Spacer";
import {BigNumber} from "ethers";
import usePara from "../../../hooks/usePara";
import {BN2decimal, BN2display, decimal2BN, decimalDiv, decimalMul} from "../../../utils/Converter";
import config from "../../../config";
import {Side, MarginAccount, getLiquidationPrice} from "../../../utils/Types";
import useMarginAccount from "../../../hooks/useMarginAccount";

interface ConfirmProps {
  onDismiss?: () => void;
  onConfirm?: () => void;
  isBuy: boolean,
  contractSize: string,

}

const ConfirmModal: React.FC<ConfirmProps> = (
  {
    onDismiss,
    onConfirm,
    isBuy,
    contractSize

  }) => {
  const theme = useContext(ThemeContext)
  const para = usePara()
  const marginAccount = useMarginAccount()
  const onConfirmCallback = useCallback(()=>{
    onConfirm();
    onDismiss();
  },
    []
  )
  const [quoteAmount, setQuoteAmount] = useState("-");
  const [entryPrice, setEntryPrice] = useState("-")
  const [sizeBefore, setSizeBefore] = useState("-")
  const [sizeAfter, setSizeAfter] = useState("-")
  const [leverageBefore, setLeverageBefore] = useState("-")
  const [leverageAfter, setLeverageAfter] = useState("-")

  const [LPFeeRateBN, setLPFeeRateBN] = useState<BigNumber>(BigNumber.from(0))
  const [MTFeeRateBN, setMTFeeRateBN] = useState<BigNumber>(BigNumber.from(0))

  const [LPFee, setLPFee] = useState("-")
  const [MTFee, setMTFee] = useState("-")
  const [fee, setFee] = useState("-")
  const side: Side = isBuy? Side.LONG : Side.SHORT

  const [maintenanceMarginRateBN, setMaintenanceMarginRateBN] = useState<BigNumber>()


  useEffect(() => {
    if (para?.isUnlocked) {
      updateOnchain().catch(err => console.error(err.stack));
      const refreshBalance = setInterval(updateOnchain, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [para?.isUnlocked, setQuoteAmount]);

  const updateOnchain = useCallback(async () => {
      let quoteAmountBN: BigNumber
      let entryPriceBN: BigNumber
      if (isBuy) {
        try {
          quoteAmountBN = await para.queryBuyBaseToken(decimal2BN(contractSize))
        } catch (err) {
          console.error(`Failed to query buy: ${err.data}`);
        }
        setQuoteAmount(BN2display(quoteAmountBN))
      } else {
        quoteAmountBN = await para.querySellBaseToken(decimal2BN(contractSize))
        setQuoteAmount(BN2display(quoteAmountBN))
      }
      entryPriceBN = decimalDiv(quoteAmountBN, decimal2BN(contractSize))
      setEntryPrice(BN2display(entryPriceBN))

      const marginAccount: MarginAccount = await para.getMarginAccount()
      setSizeBefore(BN2display(marginAccount.SIZE))
      const sizeAfterBN = marginAccount.SIDE === Side.FLAT || marginAccount.SIDE === side ? marginAccount.SIZE.add(decimal2BN(contractSize)) : marginAccount.SIZE.sub(decimal2BN(contractSize))
      setSizeAfter(BN2display(sizeAfterBN))
      const leverageBeforeBN = await para.getLeverage()
      const leverageAfterBN = await para.getLeverage(decimal2BN(contractSize), side)
      setLeverageBefore(BN2display(leverageBeforeBN))
      setLeverageAfter(BN2display(leverageAfterBN))

      // FEE
      const LPFeeRateBN = await para.getLPFeeRate()
      const MTFeeRateBN = await para.getMTFeeRate()
      const LPFeeBN = decimalMul(quoteAmountBN, LPFeeRateBN)
      const MTFeeBN = decimalMul(quoteAmountBN, MTFeeRateBN)
      const FeeBN = LPFeeBN.add(MTFeeBN)
      setLPFeeRateBN(LPFeeRateBN)
      setMTFeeRateBN(MTFeeRateBN)
      setLPFee(BN2display(LPFeeBN))
      setMTFee(BN2display(MTFeeBN))
      setFee(BN2display(FeeBN))

      setMaintenanceMarginRateBN(await para.getMaintenanceMarginRate())
    },
    [contractSize, isBuy]
  );


  return (
    <StyledModal>
      <StyledTitleArea>
        <StyledModalTitle>Confirmation</StyledModalTitle>
      </StyledTitleArea>
      <StyledContentArea>
        <StyledContentTitle>
          <CurrencyLogo name={'BTC'} style={{paddingRight: '12px'}}/>
          BUY/LONG BTC
        </StyledContentTitle>
        <RowBetween>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Entry Price'}
            </PositionText>
            <QuestionHelper text="The average entry price given the trading amount of contract against liquidity pool"/>
          </RowFixed>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
              {entryPrice}
            </PositionText>
          </RowFixed>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Amount'}
            </PositionText>
          </RowFixed>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
              {`${contractSize} (${sizeBefore}->${sizeAfter})`}
            </PositionText>
          </RowFixed>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Value'}
            </PositionText>
          </RowFixed>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
              {quoteAmount} BUSD
            </PositionText>
          </RowFixed>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Leverage'}
            </PositionText>
            <QuestionHelper text="The Maximum Allowed Leverage is 10x"/>
          </RowFixed>
          <RowFixed>
            <RowFixed>
              <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
                {`${leverageBefore} x->${leverageAfter} x`}
              </PositionText>
            </RowFixed>
          </RowFixed>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Liquidation Price'}
            </PositionText>
          </RowFixed>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
              {marginAccount && marginAccount.SIDE !== Side.FLAT ? BN2display(getLiquidationPrice(marginAccount, maintenanceMarginRateBN)): "-"}
            </PositionText>
          </RowFixed>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Fees'}
            </PositionText>
            <QuestionHelper text={`Fees include ${Number(BN2decimal(LPFeeRateBN))*100}% LP rate and ${Number(BN2decimal(MTFeeRateBN))*100}% MT rate for this pool`}/>
          </RowFixed>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
              {`${fee} (LP FEE:${LPFee} + MT FEE:${MTFee}) BUSD`}
            </PositionText>
          </RowFixed>
        </RowBetween>

        {/*<RowBetween>*/}
        {/*  <RowFixed>*/}
        {/*    <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>*/}
        {/*      {'Slippage Tolerance'}*/}
        {/*    </PositionText>*/}
        {/*  </RowFixed>*/}
        {/*  <RowFixed>*/}
        {/*    <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>*/}
        {/*      {"0.2%"}*/}
        {/*    </PositionText>*/}
        {/*  </RowFixed>*/}
        {/*</RowBetween>*/}
        <Spacer size="md"/>
        <Wrapper>
          <StyledModalAction>
            <Button text="CANCEL" variant="secondary" onClick={onDismiss} disabled={false}/>
          </StyledModalAction>
          <StyledSpacer/>
          <StyledModalAction>
            <Button text="SUBMIT" variant="secondary" onClick={onConfirmCallback} disabled={false}/>
          </StyledModalAction>
        </Wrapper>

      </StyledContentArea>
    </StyledModal>
  )
}


function PositionText(props: TextProps) {
  return <TextWrapper fontWeight={400} fontSize={14} padding={"10px 0 10px 0"} {...props} />
}


const StyledModal = styled(Modal)`
  width: 360px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const StyledSpacer = styled.div`
  width: ${props => props.theme.spacing[6]}px;
`;

const StyledModalAction = styled.div`
  flex: 1;
`

const StyledTitleArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${props => props.theme.topBarSize}px;
  margin-top: ${props => -props.theme.spacing[4]}px;
`;

const StyledContentArea = styled.div`
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 50px;
`;

const StyledModalTitle = styled.div`
  color: ${props => props.theme.color.grey[300]};
  flex: 1;
  font-size: 18px;
  font-weight: 700;
`;

const StyledContentTitle = styled.div`
  display: flex;
  color: ${props => props.theme.color.grey[300]};
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
`;


const Row = styled.div<{ align?: string; padding?: string; border?: string; borderRadius?: string }>`
  width: 100%;
  display: flex;
  padding: 0;
  align-items: ${({align}) => (align ? align : 'center')};
  padding: ${({padding}) => padding};
  border: ${({border}) => border};
  border-radius: ${({borderRadius}) => borderRadius};
`

const RowBetween = styled(Row)`
  justify-content: space-between;
  background-color: ${({theme}) => theme.color.grey[800]};
  padding: 0px 5px 0px 5px;
  :hover {
    background-color: ${({theme}) => theme.color.grey[600]};
  }
`



const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({gap}) => gap && `-${gap}`};
`

export default ConfirmModal;