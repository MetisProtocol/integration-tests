/**
 * Copyright 2020, Optimism PBC
 * MIT License
 * https://github.com/ethereum-optimism
 */

/* Imports: External */
import { Web3Provider } from '@ethersproject/providers'
import { ganache } from '@eth-optimism/ovm-toolchain'
import { OptimismProvider } from '@eth-optimism/provider'

/* Imports: Internal */
import { Config } from '../../../../common'
import { DUMMY_ADDRESS } from '../helpers/constants'

describe('Basic RPC tests', () => {
  let provider: OptimismProvider
  let signer: any
  let chainId: any
  let address: string
  before(async () => {
    provider = new OptimismProvider(Config.L2NodeUrlWithPort(), new Web3Provider(
      ganache.provider({
        mnemonic: Config.Mnemonic(),
      })
    ))

    provider.pollingInterval = 10
    signer = provider.getSigner()
    chainId = await signer.getChainId()
    address = await signer.getAddress()
  })

  it('should send eth_sendRawEthSignTransaction', async () => {
    const nonce = await provider.getTransactionCount(address)

    const tx = {
      to: DUMMY_ADDRESS,
      nonce,
      gasLimit: 4000000,
      gasPrice: 0,
      data: '0x',
      value: 0,
      chainId,
    }

    const hex = await signer.signTransaction(tx)

    const txid = await provider.send('eth_sendRawEthSignTransaction', [hex])
    await provider.waitForTransaction(txid)

    const transaction = await provider.getTransaction(txid)

    // The correct signature hashing was performed
    address.should.eq(transaction.from)

    // The correct transaction is being returned
    tx.to.should.eq(transaction.to)
    tx.value.should.eq(transaction.value.toNumber())
    tx.nonce.should.eq(transaction.nonce)
    tx.gasLimit.should.eq(transaction.gasLimit.toNumber())
    tx.gasPrice.should.eq(transaction.gasPrice.toNumber())
    tx.data.should.eq(transaction.data)

    // Fetching the transaction receipt works correctly
    const receipt = await provider.getTransactionReceipt(txid)
    address.should.eq(receipt.from)
    tx.to.should.eq(receipt.to)
  })

  it('should sendTransaction', async () => {
    const nonce = await provider.getTransactionCount(address)

    const tx = {
      to: DUMMY_ADDRESS,
      nonce,
      gasLimit: 4000000,
      gasPrice: 0,
      data: '0x',
      value: 0,
      chainId,
    }

    const result = await signer.sendTransaction(tx)

    // "from" is calculated client side here, so
    // make sure that it is computed correctly.
    result.from.should.eq(address)

    tx.nonce.should.eq(result.nonce)
    tx.gasLimit.should.eq(result.gasLimit.toNumber())
    tx.gasPrice.should.eq(result.gasPrice.toNumber())
    tx.data.should.eq(result.data)
  })

  it('gas price should be 0', async () => {
    const price = await provider.getGasPrice()
    const num = price.toNumber()
    num.should.eq(0)
  })

  it('should estimate gas', async () => {
    const template = {
      to: DUMMY_ADDRESS,
      gasLimit: 4000000,
      gasPrice: 0,
      value: 0,
      data: '',
    }

    // The gas price is the same with different
    // transaction sizes.
    const cases = ['0x', '0x' + '00'.repeat(256)]

    const estimates = []
    for (const c of cases) {
      template.data = c
      const estimate = await provider.estimateGas(template)
      estimates.push(estimate)
    }

    for (const estimate of estimates) {
      estimate.toNumber().should.eq(11999999)
    }
  })

  it('should get correct chainid', async () => {
    const chainId = await provider.send('eth_chainId', [])
    chainId.should.eq('0x1a4')
    parseInt(chainId, 16).should.eq(420)
  })

  it('should get transaction (l2 metadata)', async () => {
    const tx = {
      to: DUMMY_ADDRESS,
      gasLimit: 4000000,
      gasPrice: 0,
      data: '0x',
      value: 0,
    }

    const result = await signer.sendTransaction(tx)

    const txn = await provider.getTransaction(result.hash)

    txn.txType.should.be.a('string')
    txn.queueOrigin.should.be.a('string')
  })
})
