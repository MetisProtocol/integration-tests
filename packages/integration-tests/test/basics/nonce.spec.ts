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
import { Config, sleep } from '../../../../common'
import { DUMMY_ADDRESS } from '../helpers/constants'
import { expect } from 'chai'

describe('Nonce manipulation tests', () => {
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

  describe('via sendTransaction', () => {
    it('should successfully execute if the given nonce is valid', async () => {
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

      const res1 = await signer.sendTransaction(tx)
      const rec1 = await res1.wait()

      rec1.from.should.equal(address)
      rec1.status.should.equal(1)
    })

    it('should correctly handle out of order transactions', async () => {
      const nonce = await provider.getTransactionCount(address)

      const tx1 = {
        to: DUMMY_ADDRESS,
        nonce: nonce + 1, // Off by one.
        gasLimit: 4000000,
        gasPrice: 0,
        data: '0x',
        value: 0,
        chainId,
      }

      const res1 = await signer.sendTransaction(tx1)
      await sleep(1000)
      const rec1 = await provider.getTransactionReceipt(res1.hash)

      const tx2 = {
        to: DUMMY_ADDRESS,
        nonce,
        gasLimit: 4000000,
        gasPrice: 0,
        data: '0x',
        value: 0,
        chainId,
      }

      const res2 = await signer.sendTransaction(tx2)
      await sleep(1000)
      const rec2 = await provider.getTransactionReceipt(res2.hash)
      const rec3 = await provider.getTransactionReceipt(res1.hash)

      expect(
        rec1
      ).to.equal(null)

      rec2.from.should.equal(address)
      rec2.status.should.equal(1)

      rec3.from.should.equal(address)
      rec3.status.should.equal(1)
    })

    it('should correctly handle transactions with a low nonce', async () => {
      const nonce = await provider.getTransactionCount(address)

      const tx1 = {
        to: DUMMY_ADDRESS,
        nonce: nonce,
        gasLimit: 4000000,
        gasPrice: 0,
        data: '0x',
        value: 0,
        chainId,
      }

      const res1 = await signer.sendTransaction(tx1)
      await sleep(1000)
      const rec1 = await provider.getTransactionReceipt(res1.hash)

      const tx2 = {
        to: DUMMY_ADDRESS,
        nonce,
        gasLimit: 4000000,
        gasPrice: 0,
        data: '0x1234', // Use different data to avoid "known transaction".
        value: 0,
        chainId,
      }

      try {
        await signer.sendTransaction(tx2)
      } catch (err) {
        expect(err.toString().includes('nonce has already been used')).to.equal(true)
      }

      rec1.from.should.equal(address)
      rec1.status.should.equal(1)
    })

    it('should correctly handle same transaction twice', async () => {
      const nonce = await provider.getTransactionCount(address)

      const tx1 = {
        to: DUMMY_ADDRESS,
        nonce: nonce,
        gasLimit: 4000000,
        gasPrice: 0,
        data: '0x',
        value: 0,
        chainId,
      }

      const res1 = await signer.sendTransaction(tx1)
      await sleep(1000)
      const rec1 = await provider.getTransactionReceipt(res1.hash)

      const tx2 = {
        to: DUMMY_ADDRESS,
        nonce,
        gasLimit: 4000000,
        gasPrice: 0,
        data: '0x',
        value: 0,
        chainId,
      }

      try {
        await signer.sendTransaction(tx2)
      } catch (err) {
        expect(err.toString().includes('nonce has already been used')).to.equal(true)
      }

      rec1.from.should.equal(address)
      rec1.status.should.equal(1)
    })

    it('should correctly handle transaction with too little gas', async () => {
      const nonce = await provider.getTransactionCount(address)

      const tx1 = {
        to: DUMMY_ADDRESS,
        nonce: nonce,
        gasLimit: 50000,
        gasPrice: 0,
        data: '0x',
        value: 0,
        chainId,
      }

      const res1 = await signer.sendTransaction(tx1)
      await sleep(1000)
      const rec1 = await provider.getTransactionReceipt(res1.hash)

      rec1.status.should.equal(0)
    })
  })
})
