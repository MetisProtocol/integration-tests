import * as path from 'path'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

import '@eth-optimism/ovm-toolchain/build/src/hardhat-plugins/hardhat-ovm-compiler'

const config = {
  network: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 420,
      gasPrice: 0
    }
  },
  mocha: {
    timeout: 50000,
  },
  solidity: {
    version: '0.5.0',
  },
  solc: {
    path: path.resolve(__dirname, 'node_modules', '@eth-optimism', 'solc', 'soljson.js'),
  }
}

export default config
