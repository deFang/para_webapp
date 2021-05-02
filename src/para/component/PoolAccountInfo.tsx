import React, {useCallback, useContext, useEffect, useState} from 'react'
import styled, {ThemeContext} from 'styled-components'
import {TYPE} from '../../theme'
import {RowBetween, RowFixed} from '../../components/Row'
import {BN2display} from "../../utils/Converter";
import useIndexPrice from "../../hooks/useIndexPrice";
import config from "../../config";
import usePara from "../../hooks/usePara";
import usePoolMarginAccount from "../../hooks/usePoolMarginAccount";
import useMarkPrice from "../../hooks/useMarkPrice";


const StyledModalTitle = styled.div`
  color: ${props => props.theme.color.grey[300]};
  flex: 1;
  font-size: 18px;
  font-weight: 700;
`;

const RowInner = styled.div`
  margin-top: 4px;
  margin-bottom:4px;
`

interface InfoTextProps {
  text: string,
  fontSize?: string,
  fontWeight?: string,
  color?: string,
}

const InfoText: React.FC<InfoTextProps> = (
  {
    text,
    fontSize = 14,
    fontWeight = 400,
    color = "#C3C5CB"
  }
) => {
  const theme = useContext(ThemeContext)
  return (
    <RowFixed>
      <RowInner>
        <TYPE.black fontSize={fontSize} fontWeight={fontWeight} color={color}>
          {text}
        </TYPE.black>
      </RowInner>
    </RowFixed>
  )
}

export default function PoolAccountInfo() {
  const para = usePara()
  const poolAccount = usePoolMarginAccount()
  console.log('poolAccount', poolAccount)
  const markPrice = useMarkPrice()

  const [balanceMargin, setBalanceMargin] = useState("-")
  const [availableMargin, setAvailableMargin] = useState("-")

  const [initialMarginRate, setInitialMarginRate] = useState("-")
  const [maintenanceMarginRate, setMaintenanceMarginRate] = useState("-")

  const [LPFee, setLPFee] = useState("-")
  const [MTFee, setMTFee] = useState("-")
  const [fee, setFee] = useState("-")


  useEffect(() => {
    if (para?.isUnlocked) {
      updateOnchain().catch(err => console.error(err.stack));
      const refreshOnchain = setInterval(updateOnchain, config.refreshInterval);
      return () => clearInterval(refreshOnchain);
    }
  }, [para?.isUnlocked]);

  const updateOnchain = useCallback(async () => {
      setBalanceMargin(BN2display(await para.balanceMargin()))
      setAvailableMargin(BN2display(await para.availableMargin()))

      setInitialMarginRate(BN2display(await para.getInitialMarginRate()))
      setMaintenanceMarginRate(BN2display(await para.getMaintenanceMarginRate()))

      const LPFeeBN = await para.getLPFeeRate()
      const MTFeeBN = await para.getMTFeeRate()
      const FeeBN = LPFeeBN.add(MTFeeBN)
      setLPFee(BN2display(LPFeeBN))
      setMTFee(BN2display(MTFeeBN))
      setFee(BN2display(FeeBN))
    },
    []
  );

  return (
    <>
      <RowBetween>
        <InfoText text={"Ticker"}/>
        <InfoText text={poolAccount ? 'BTC/BUSD' : '-'}/>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Mark Price"}/>
        <InfoText text={markPrice ? `${BN2display(markPrice)}` : '-'}/>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Pool Liquidity"}/>
        <InfoText text={poolAccount ? `${BN2display(poolAccount.CASH_BALANCE)} BUSD` : '-'}/>
        <InfoText text={poolAccount ? `entry_value ${BN2display(poolAccount.ENTRY_VALUE)}` : '-'}/>
        <InfoText text={poolAccount ? `size ${BN2display(poolAccount.SIZE)}` : '-'}/>
        <InfoText text={poolAccount ? `side ${poolAccount.SIDE}` : '-'}/>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Initial Margin Rate"}/>
        <InfoText text={poolAccount ? `${Number(initialMarginRate) * 100}%` : '-'}/>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Maintenance Margin Rate"}/>
        <InfoText text={poolAccount ? `${Number(maintenanceMarginRate) * 100}%` : '-'}/>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Transaction Fee Rate"}/>
        <InfoText text={poolAccount ? `${Number(fee) * 100}%` : '-'}/>
      </RowBetween>

    </>
  );
}
