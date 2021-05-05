import React from 'react';
import CurrencyInputPanel from "../../../components/uniswap/CurrencyInputPanel";
import useSpotPrice from "../../../hooks/useSpotPrice";
import useIndexPrice from "../../../hooks/useIndexPrice";
import {BN2display} from "../../../utils/Converter";

interface PricePanelProps {
  id: string;
  showHeaderLabel: boolean;
  currencyName: string;
  showCurrency: boolean;
}

const PricePanel: React.FC<PricePanelProps> = (
  {
    id,
    showHeaderLabel,
    currencyName,
    showCurrency
  }
) => {
  const onConfirm = () => {
    return
  };
  const onDismiss = () => {
    return
  };

  const spotPrice = useSpotPrice();
  const indexPrice = useIndexPrice();
  const headerLabel = showHeaderLabel? `Index Price: ${(indexPrice ? BN2display(indexPrice!) : "-")}` : undefined;

  return (
      <CurrencyInputPanel
        value={(spotPrice ? BN2display(spotPrice!) : "-")}
        onUserInput={onDismiss}
        onMax={onDismiss}
        label={'Spot Price'}
        headerLabel={headerLabel}
        currencyName={currencyName}
        showCurrency={showCurrency}
        id={id}
      />
    )
}


export default PricePanel