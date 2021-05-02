import {Configuration} from './config';
import {BigNumber, Contract, ethers} from 'ethers';
// import { ERC20 } from "../deployment/ABI/ERC20.json";
import ERC20 from '../para/ERC20';
import {
  AdminAddress, LpTokenAddress,
  NaiveOracleAddress,
  ParaAddress,
  ParaPlaceAddress,
  PricingAddress,
  TestUSDTAddress
} from "../deployment/const";
import config from '../config';
import {web3ProviderFrom} from './ether-utils';
import {decimalStr} from "../utils/formatBalance";
import {NaiveOracle as NaiveOracleABI} from "../deployment/ABI/NaiveOracle.json";
import {Para as ParaABI} from "../deployment/ABI/Para.json";
import {ParaPlace as ParaPlaceABI} from "../deployment/ABI/ParaPlace.json";
import {Pricing as PricingABI} from "../deployment/ABI/Pricing.json";
import {Admin as AdminABI} from "../deployment/ABI/Admin.json"
import {decimal2BN, decimalDiv, decimalMul} from "../utils/Converter";
import {MarginAccount, Side} from "../utils/Types";
import ERC20Mintable from "./ERC20Mintable";

export function getDefaultProvider(): ethers.providers.Web3Provider {
  return new ethers.providers.Web3Provider(
    web3ProviderFrom(config.defaultProvider),
    config.chainId,
  )
}

const MAX_INT = ethers.constants.MaxUint256;
const ClaimTestBUSDAmount = decimal2BN("10000")
/**
 * An API module of Basis Cash contracts.
 * All contract-interacting domain logic should be defined in here.
 */
declare global {
  interface Window {
    ethereum: any;
  }
}


export class Para {
  myAccount: string | undefined;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  TestUSDT: ERC20Mintable;
  LpToken: ERC20;
  ethereum = window.ethereum;

  constructor(cfg: Configuration) {
    const provider = getDefaultProvider();
    this.config = cfg;
    this.provider = provider;
    // parapara contracts
    this.contracts = {};
    this.contracts["NaiveOracleInstance"] = new Contract(NaiveOracleAddress, NaiveOracleABI, provider);
    this.contracts["ParaInstance"] = new Contract(ParaAddress, ParaABI, provider);
    this.contracts["ParaPlaceInstance"] = new Contract(ParaPlaceAddress, ParaPlaceABI, provider);
    this.contracts["PricingInstance"] = new Contract(PricingAddress, PricingABI, this.provider);
    this.contracts["AdminInstance"] = new Contract(AdminAddress, AdminABI, this.provider);
    // BUSD contract
    this.TestUSDT = new ERC20Mintable(TestUSDTAddress, this.provider, 'TestUSDT');
    this.LpToken = new ERC20(LpTokenAddress, this.provider, 'FANG_PARA_LP_TOKEN_');

  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string, chainId: any) {
    // const ethersProvider = new ethers.providers.Web3Provider(this.ethereum, "any");
    // this.signer = ethersProvider.getSigner();
    // this.TestUSDT = new ethers.Contract(TestUSDTAddress, ERC20, this.signer);
    // // this.TestUSDT.connect(this.signer);
    // this.myAccount = account;

    const newProvider = new ethers.providers.Web3Provider(provider, chainId);
    this.signer = newProvider.getSigner();
    this.myAccount = account;
    this.TestUSDT.connect(this.signer);
    this.contracts["ParaInstance"] = this.contracts["ParaInstance"].connect(this.signer);
    this.contracts["ParaPlaceInstance"] = this.contracts["ParaPlaceInstance"].connect(this.signer);
    this.contracts["PricingInstance"] = this.contracts["PricingInstance"].connect(this.signer);
    this.contracts["AdminInstance"] = this.contracts["AdminInstance"].connect(this.signer);

    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }


  async getTestUSDTApproval(): Promise<any> {
    await this.provider.ready;
    try {
      let tx = await this.TestUSDT.approve(
        ParaAddress, MAX_INT);
      // let tx = await this.TestUSDT.totalSupply();
      console.log(tx);
    } catch (err) {
      console.log("signer", this.signer);
      console.error(`Failed to approve TestUSDT: ${err}`);
    }
  }

  async claimTestBUSD(): Promise<any> {
    await this.provider.ready;
    return await this.TestUSDT.claim(this.myAccount)
  }

  async getTestUSDTBalance(): Promise<BigNumber | undefined> {
    const balance = await this.TestUSDT.balanceOf(this.myAccount)
    return balance
  }

  async getLpTokenBalance(): Promise<BigNumber | undefined> {
    const balance = await this.LpToken.balanceOf(this.myAccount)
    return balance
  }

  async getLpTokenTotalSupply(): Promise<BigNumber | undefined> {
    const supply = await this.LpToken.totalSupply()
    return supply
  }



  async getLPFeeRate(): Promise<BigNumber | undefined> {
    const {AdminInstance} = this.contracts;
    return await AdminInstance._LP_FEE_RATE_();
  }

  async getMTFeeRate(): Promise<BigNumber | undefined> {
    const {AdminInstance} = this.contracts;
    return await AdminInstance._MT_FEE_RATE_();
  }

  async getInitialMarginRate(): Promise<BigNumber | undefined> {
    const {AdminInstance} = this.contracts;
    return await AdminInstance._INITIAL_MARGIN_RATE_();
  }

  async getMaintenanceMarginRate(): Promise<BigNumber | undefined> {
    const {AdminInstance} = this.contracts;
    return await AdminInstance._MAINTENANCE_MARGIN_RATE_();
  }

  async getIndexPrice(): Promise<BigNumber | undefined> {
    const {NaiveOracleInstance} = this.contracts;
    return await NaiveOracleInstance.getPrice();
  }

  async getSpotPrice(): Promise<BigNumber | undefined> {
    const {PricingInstance} = this.contracts;
    const spotPrice = await PricingInstance.getMidPrice()
    return spotPrice
  }

  async getTwapPrice(): Promise<BigNumber | undefined> {
    const {PricingInstance} = this.contracts;
    const twapPrice = await PricingInstance.getTwapPrice()
    return twapPrice
  }


  async traderDeposit(amountStr: string): Promise<any> {
    const {ParaInstance} = this.contracts;
    const amount = decimalStr(amountStr);
    console.log("amount", amount, 'signer', this.signer);
    await ParaInstance.collateralTraderTransferIn(this.myAccount, amount);
  }

  async traderWithdraw(amountStr: string): Promise<any> {
    const {ParaInstance} = this.contracts;
    const amount = decimalStr(amountStr);
    await ParaInstance.collateralTraderTransferOut(this.myAccount, amount)
  }

  async lpAdd(amountStr: string): Promise<any> {
    const {ParaInstance} = this.contracts;
    const amount = decimalStr(amountStr);
    await ParaInstance.depositCollateral(amount);
  }

  async lpRemove(amountStr: string): Promise<any> {
    const {ParaInstance} = this.contracts;
    const amount = decimalStr(amountStr);
    await ParaInstance.withdrawCollateral(amount);
  }

  async getMarginAccount(): Promise<MarginAccount> {
    const {ParaInstance} = this.contracts;
    return await ParaInstance._MARGIN_ACCOUNT_(this.myAccount);
  }

  async getPoolMarginAccount(): Promise<any> {
    const {ParaInstance} = this.contracts;
    console.log("poolAccount", await ParaInstance._MARGIN_ACCOUNT_(ParaAddress))
    return await ParaInstance._MARGIN_ACCOUNT_(ParaAddress);
  }

  async availableMargin(): Promise<BigNumber | undefined> {
    const {ParaInstance} = this.contracts;
    const marginAccount = await this.getMarginAccount()
    const oraclePrice = await this.getIndexPrice()
    return await ParaInstance.availableMargin(marginAccount, oraclePrice)
  }

  async balanceMargin(): Promise<BigNumber | undefined> {
    const {ParaInstance} = this.contracts;
    const marginAccount = await this.getMarginAccount()
    return await ParaInstance.balanceMargin(marginAccount)
  }

  async getLeverage(
      size = BigNumber.from(0),
      side = Side.LONG
    ): Promise<BigNumber | undefined> {
    const {ParaInstance} = this.contracts;
    const marginAccount = await this.getMarginAccount()
    const balancemargin = await ParaInstance.balanceMargin(marginAccount)
    let nominalValue: BigNumber
    if (marginAccount.SIDE===Side.FLAT || marginAccount.SIDE===side) { // SIDE===1 是short
      nominalValue = decimalMul(marginAccount.SIZE.add(size), await this.getIndexPrice()) // 此处应用mark price
    }
    else {
      nominalValue = decimalMul(marginAccount.SIZE.sub(size), await this.getIndexPrice()) // 此处应用mark price
    }
    const leverage = balancemargin.gt(0)? decimalDiv(nominalValue, balancemargin): undefined
    return leverage
  }

  async buyBaseToken(amount: BigNumber, maxPayQuote: BigNumber = MAX_INT): Promise<any> {
    await this.provider.ready;
    // try {
    //   const {ParaInstance} = this.contracts
    //   const estimateGas = await ParaInstance.estimateGas.buyBaseToken(amount, maxPayQuote);
    //   console.log('estimateGas', estimateGas)
    //   ParaInstance.on("BuyBaseToken", (buyer, receiveBase, payQuote, event) => {
    //     console.log('buyer', buyer);
    //     console.log('receiveBase', receiveBase);
    //     console.log('payQuote', payQuote);
    //     console.log('event', event);
    //   });
    //   return await ParaInstance.buyBaseToken(amount, maxPayQuote);
    // } catch (err) {
    //   console.error(`Failed to buy: ${err.stack}`);
    // }
    const {ParaInstance} = this.contracts
    return await ParaInstance.buyBaseToken(amount, maxPayQuote);
  }

  async sellBaseToken(amount: BigNumber, minReceiveQuote: BigNumber = BigNumber.from(0)): Promise<any> {
    await this.provider.ready;
    const {ParaInstance} = this.contracts
    return await ParaInstance.sellBaseToken(amount, minReceiveQuote);
  }

  async getExpectedTarget(): Promise<any> {
    const {PricingInstance} = this.contracts;
    const [baseTarget, baseBalance, quoteTarget, quoteBalance] = await PricingInstance.getExpectedTarget();
    return [baseTarget, baseBalance, quoteTarget, quoteBalance]
  }

  async queryBuyBaseToken(amount: BigNumber): Promise<any> {
    const {PricingInstance} = this.contracts;
    return await PricingInstance.queryBuyBaseToken(amount)
  }

  async querySellBaseToken(amount: BigNumber): Promise<any> {
    const {PricingInstance} = this.contracts;
    return await PricingInstance.querySellBaseToken(amount)
  }


}
