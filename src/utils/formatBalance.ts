import { BigNumber } from 'ethers';
import {formatUnits, parseUnits} from 'ethers/lib/utils';


// bigNumber -> display decimal number
export const getDisplayBalance = (balance: BigNumber, decimals = 18, fractionDigits = 3) => {
  const number = getBalance(balance, decimals - fractionDigits);
  return (number / 10 ** fractionDigits).toFixed(fractionDigits);
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return getDisplayBalance(balance, decimals);
};

// bigNumber -> decimal number
export function getBalance(balance: BigNumber, decimals = 18) : number {
  return balance.div(BigNumber.from(10).pow(decimals)).toNumber();
}

// string -> bigNumber
export function decimalStr (value:string, decimals = 18): BigNumber {
  return BigNumber.from(value).mul(BigNumber.from(10).pow(decimals));
}



