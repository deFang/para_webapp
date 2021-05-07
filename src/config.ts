import { ChainId } from '@uniswap/sdk';
import { Configuration } from './para/config';




const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: 1337,
    etherscanUrl: 'https://etherscan.io',
    defaultProvider: 'http://localhost:7545',
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  },
  testnet: {
    chainId: ChainId.MAINNET,
    etherscanUrl: 'https://etherscan.io',
    defaultProvider: 'https://mainnet.infura.io/v3/c674b8938c9f424d8c12532ab8b811e5',
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  },
  kovan: {
    chainId: ChainId.KOVAN,
    etherscanUrl: 'https://kovan.etherscan.io',
    defaultProvider: 'https://kovan.infura.io/v3/c674b8938c9f424d8c12532ab8b811e5',
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  }
};


export default configurations["kovan"];
