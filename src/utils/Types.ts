import {BigNumber, constants} from "ethers";
import {decimal2BN, decimalDiv, decimalMul, ONE} from "./Converter";

export enum Side {FLAT, SHORT, LONG}

export enum RStatus {ONE, ABOVE_ONE, BELOW_ONE}

export enum Status {NORMAL, EMERGENCY, SETTLED}


export interface MarginAccount {
  SIDE: Side
  SIZE: BigNumber
  ENTRY_VALUE: BigNumber
  CASH_BALANCE: BigNumber
  ENTRY_SLOSS: BigNumber
}

export interface VirtualBalance {
  baseTarget: BigNumber
  baseBalance: BigNumber
  quoteTarget: BigNumber
  quoteBalance: BigNumber
  newSide: Side
}

export const getSideText = (side: Side) => {
  const text = side === Side.FLAT ? "FLAT" : side === Side.SHORT ? "SHORT" : "LONG"
  return text;
};

export const getLiquidationPrice = (marginAccount: MarginAccount, maintainenceMarginRate: BigNumber=decimal2BN("0.05")) => {
  let liquidationPrice: BigNumber;
  if (marginAccount.SIDE === Side.LONG) {
    // liquidationPrice = (marginAccount.CASH_BALANCE.sub(marginAccount.ENTRY_VALUE)).div(decimalMul(maintainenceMarginRate.sub(ONE), marginAccount.SIZE))
    const nominator = marginAccount.CASH_BALANCE.sub(marginAccount.ENTRY_VALUE)
    const denom = decimalMul(maintainenceMarginRate.sub(ONE), marginAccount.SIZE)
    liquidationPrice = decimalDiv(nominator, denom);
    return liquidationPrice
  }
  if (marginAccount.SIDE === Side.SHORT) {
    const nominator = marginAccount.CASH_BALANCE.add(marginAccount.ENTRY_VALUE)
    const denom = decimalMul(maintainenceMarginRate.add(ONE), marginAccount.SIZE)
    liquidationPrice = decimalDiv(nominator, denom);
    return liquidationPrice
  }
  return constants.MaxUint256
}
