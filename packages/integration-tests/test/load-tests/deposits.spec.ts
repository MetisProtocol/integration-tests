/**
 * Copyright 2020, Optimism PBC
 * MIT License
 * https://github.com/ethereum-optimism
 */

/* Imports: External */
import {
  Web3Provider,
  JsonRpcProvider,
} from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { Contract } from '@ethersproject/contracts'
import { add0x } from '@eth-optimism/core-utils'
import { ganache } from '@eth-optimism/ovm-toolchain'
import { OptimismProvider } from '@eth-optimism/provider'
import { getContractFactory } from '@eth-optimism/contracts'

/* Imports: Internal */
import { Config, sleep } from '../../../../common'
import { DUMMY_ADDRESS, TEST_SIZES } from '../helpers/constants'

describe("Load tests: deposits", () => {
  let l1Provider: JsonRpcProvider
  let l1Signer: Wallet
  let l2Provider: OptimismProvider
  let l2Signer: any
  before(async () => {
    l1Provider = new JsonRpcProvider(Config.L1NodeUrlWithPort())
    l1Signer = new Wallet(Config.DeployerPrivateKey()).connect(l1Provider)

    l2Provider = new OptimismProvider(Config.L2NodeUrlWithPort(), new Web3Provider(
      ganache.provider({
        mnemonic: Config.Mnemonic(),
      })
    ))
    l2Signer = await l2Provider.getSigner()
  })

  let AddressResolver: Contract
  let CanonicalTransactionChain: Contract
  before(async () => {
    const addressResolverAddress = add0x(Config.AddressResolverAddress())
    const AddressResolverFactory = getContractFactory('Lib_AddressManager')
    AddressResolver = AddressResolverFactory.connect(l1Signer).attach(
      addressResolverAddress
    )

    const ctcAddress = await AddressResolver.getAddress('OVM_CanonicalTransactionChain')
    const CanonicalTransactionChainFactory = getContractFactory(
      'OVM_CanonicalTransactionChain'
    )
    CanonicalTransactionChain = CanonicalTransactionChainFactory.connect(
      l1Signer
    ).attach(ctcAddress)
  })

  for (const size of TEST_SIZES) {
    it(`should handle ${size} deposits in a row`, async () => {

    })
  }
})
