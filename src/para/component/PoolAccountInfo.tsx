import React, {useCallback, useContext, useEffect, useState} from 'react'
import styled, {ThemeContext} from 'styled-components'
import {TYPE} from '../../theme'
import {RowBetween, RowFixed} from '../../components/Row'
import {BN2display} from "../../utils/Converter";
import config from "../../config";
import usePara from "../../hooks/usePara";
import usePoolMarginAccount from "../../hooks/usePoolMarginAccount";
import useMarkPrice from "../../hooks/useMarkPrice";



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
  const markPrice = useMarkPrice()

  const [initialMarginRate, setInitialMarginRate] = useState("-")
  const [maintenanceMarginRate, setMaintenanceMarginRate] = useState("-")

  const [LPFee, setLPFee] = useState("-")
  const [MTFee, setMTFee] = useState("-")
  const [fee, setFee] = useState("-")

  const [ENP, setENP] = useState("-")


  useEffect(() => {
    if (para?.isUnlocked) {
      updateOnchain().catch(err => console.error(err.stack));
      const refreshOnchain = setInterval(updateOnchain, config.refreshInterval);
      return () => clearInterval(refreshOnchain);
    }
  }, [para?.isUnlocked]);

  const updateOnchain = useCallback(async () => {
      setInitialMarginRate(BN2display(await para.getInitialMarginRate()))
      setMaintenanceMarginRate(BN2display(await para.getMaintenanceMarginRate()))

      const LPFeeBN = await para.getLPFeeRate()
      const MTFeeBN = await para.getMTFeeRate()
      const FeeBN = LPFeeBN.add(MTFeeBN)
      setLPFee(BN2display(LPFeeBN))
      setMTFee(BN2display(MTFeeBN))
      setFee(BN2display(FeeBN))
      setENP(BN2display(await para._poolNetPositionRatio()))
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
      </RowBetween>

      <RowBetween>
        <InfoText text={"Pool ENP"}/>
        <InfoText text={poolAccount ? ENP : '-'}/>
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
