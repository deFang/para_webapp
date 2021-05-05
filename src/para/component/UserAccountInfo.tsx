import React, {useCallback, useContext, useEffect, useState} from 'react'
import styled, {ThemeContext} from 'styled-components'
import {TYPE} from '../../theme'
import {RowBetween, RowFixed} from '../../components/Row'
import useMarginAccount from "../../hooks/useMarginAccount";
import {getLiquidationPrice, getSideText, Side} from "../../utils/Types";
import {BN2display, decimalDiv, decimalMul} from "../../utils/Converter";
import useIndexPrice from "../../hooks/useIndexPrice";
import config from "../../config";
import usePara from "../../hooks/usePara";
import {BigNumber} from "ethers";
import Button from "../../components/Button";


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
    fontWeight = 500,
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

interface MarketCloseProps {
  showMarketClose?: boolean;
  handleMarketClose?: () => void;
}

const UserAccountInfo: React.FC<MarketCloseProps> = ({
                                                       showMarketClose,
                                                       handleMarketClose
                                                     }) => {
  const theme = useContext(ThemeContext)
  const para = usePara()
  const marginAccount = useMarginAccount()
  const indexPrice = useIndexPrice()

  const [balanceMargin, setBalanceMargin] = useState("-")
  const [availableMargin, setAvailableMargin] = useState("-")
  const [maintenanceMarginRateBN, setMaintenanceMarginRateBN] = useState<BigNumber>()


  useEffect(() => {
    if (para?.isUnlocked) {
      updateOnchain().catch(err => console.error(err.stack));
      const refreshBalance = setInterval(updateOnchain, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [para?.isUnlocked]);

  const updateOnchain = useCallback(async () => {
      setBalanceMargin(BN2display(await para.balanceMargin()))
      setAvailableMargin(BN2display(await para.availableMargin()))
      setMaintenanceMarginRateBN(await para.getMaintenanceMarginRate())
    },
    []
  );


  return (
    <>
      <RowBetween>
        <InfoText text={"Cash Balance"}/>
        <InfoText text={marginAccount ? BN2display(marginAccount.CASH_BALANCE) : '-'}/>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Side"}/>
        <InfoText text={marginAccount ? getSideText(marginAccount.SIDE) : '-'}/>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Position Size"}/>
        <RowFixed>
          <RowInner>
            <TYPE.black fontSize={14} fontWeight={500} color={"#C3C5CB"}>
              {marginAccount ? BN2display(marginAccount.SIZE) : '-'}
            </TYPE.black>
          </RowInner>
          {showMarketClose && marginAccount && !marginAccount.SIZE.isZero() &&
          <Button
            onClick={handleMarketClose}
            size="sm"
            text="Market Close"
            variant="secondary"
            disabled={false}
          />
          }
        </RowFixed>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Avg. Entry Price"}/>
        <InfoText
          text={marginAccount && !marginAccount.SIZE.isZero() ? BN2display(decimalDiv(marginAccount.ENTRY_VALUE, marginAccount.SIZE)) : '-'}/>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Unrealized PNL"}/>
        <InfoText text={marginAccount && indexPrice
          ? marginAccount.SIDE === Side.LONG
            ? BN2display(decimalMul(marginAccount.SIZE, indexPrice).sub(marginAccount.ENTRY_VALUE))
            : BN2display(marginAccount.ENTRY_VALUE.sub(decimalMul(marginAccount.SIZE, indexPrice)))
          : '-'
        }/>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Balance Margin"}/>
        <InfoText text={balanceMargin}/>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Available Margin"}/>
        <InfoText text={availableMargin}/>
      </RowBetween>

      <RowBetween>
        <InfoText text={"Liquidation Price"}/>
        <InfoText
          text={marginAccount && marginAccount.SIDE !== Side.FLAT ? BN2display(getLiquidationPrice(marginAccount, maintenanceMarginRateBN)) : "-"}/>
      </RowBetween>

    </>
  );
}

export default UserAccountInfo;
