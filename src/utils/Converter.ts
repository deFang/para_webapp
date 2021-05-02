import {formatUnits, parseUnits} from 'ethers/lib/utils';
import {BigNumber, ethers} from "ethers";
export const MAX_INT = ethers.constants.MaxUint256;
export const ONE = ethers.constants.WeiPerEther;

export function decimal2BN(decimal: string): BigNumber {
  return parseUnits(decimal, 18);
}

export function BN2decimal(bn: BigNumber): string {
  return formatUnits(bn.toString(), 18);
}

export function BN2display(bn: BigNumber, fixed:number =3): string {
  return Number.parseFloat(BN2decimal(bn)).toFixed(fixed);
}


export function decimalMul(a:BigNumber, b:BigNumber): BigNumber {
  return a.mul(b).div(ONE)
}

export function decimalDiv(a: BigNumber, b:BigNumber): BigNumber {
  return a.mul(ONE).div(b)
}