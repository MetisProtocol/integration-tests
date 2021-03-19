import { expect } from 'chai'
import assert = require('assert')
import { JsonRpcProvider } from '@ethersproject/providers'

import { Config } from '../../../common'
import { Watcher } from '@eth-optimism/watcher'
import { getContractInterface, getContractFactory } from 'metiseth-optimism-contracts'
import l1SimnpleStorageJson = require('../../../contracts/build/SimpleStorage.json')
import l2SimpleStorageJson = require('../../../contracts/build-ovm/SimpleStorage.json')
import l1erc20Json = require('../../../contracts/build/MVM_ERC20.json')
import l2erc20Json = require('../../../contracts/build-ovm/MVM_ERC20.json')

import {
  Contract, ContractFactory, Wallet, utils
} from 'ethers'
import * as path from 'path'
import dotenv = require('dotenv')

let l1erc20
let l2erc20
let l1MessengerAddress
let l2MessengerAddress

const envPath = path.join(__dirname, '/.env');
dotenv.config({ path: envPath })

console.log(envPath)
  
const L1_USER_PRIVATE_KEY = Config.DeployerPrivateKey()
const L2_USER_PRIVATE_KEY = Config.DeployerPrivateKey()
const L2_TAX_PRIVATE_KEY = Config.DeployerPrivateKey()
const SEQUENCER_PRIVATE_KEY = Config.SequencerPrivateKey()
const goerliURL = Config.L1NodeUrlWithPort()
const optimismURL = Config.L2NodeUrlWithPort()
const l1Provider = new JsonRpcProvider(goerliURL)
const l2Provider = new JsonRpcProvider(optimismURL)
const l1Wallet = new Wallet(L1_USER_PRIVATE_KEY, l1Provider)
const l2Wallet = new Wallet(L2_USER_PRIVATE_KEY, l2Provider)
const taxWallet = new Wallet(L2_TAX_PRIVATE_KEY, l2Provider)

const addressManagerAddress = Config.AddressResolverAddress()
const addressManagerInterface = getContractInterface('Lib_AddressManager')
const AddressManager = new Contract(addressManagerAddress, addressManagerInterface, l1Provider)

const l1ERC20Factory=new ContractFactory(l1erc20Json.abi, l1erc20Json.bytecode, l1Wallet)
const l2ERC20Factory=new ContractFactory(l2erc20Json.abi, l2erc20Json.bytecode, l2Wallet)

  
let watcher
const initWatcher = async () => {
  l1MessengerAddress = await AddressManager.getAddress('Proxy__OVM_L1CrossDomainMessenger')
  l2MessengerAddress = await AddressManager.getAddress('OVM_L2CrossDomainMessenger')
  return new Watcher({
    l1: {
      provider: l1Provider,
      messengerAddress: l1MessengerAddress
    },
    l2: {
      provider: l2Provider,
      messengerAddress: l2MessengerAddress
    }
  })
}

// const deposit = async (amount, value) => {
//   const [msgHash] = await watcher.getMessageHashesFromL1Tx(l1ToL2Tx.hash)
//   const receipt = await watcher.getL2TransactionReceipt(msgHash)
// }

let l2mvmcb
const mvmCoinBaseFactory = getContractFactory('MVM_Coinbase',l2Wallet,true)
let l1ERC20Gateway
let l1EthGateway
    
describe('MVM_ERC20', async () => {
  const alice = new Wallet(SEQUENCER_PRIVATE_KEY, l2Provider)
  const initialAmount = 1000
  const tokenName = 'OVM Test'
  const tokenDecimals = 9
  const TokenSymbol = 'OVM'
  const TaxRate = 250

  before(async () => {
      watcher = await initWatcher()
    }
  )
  
  it('deploy all contracts for test',async()=>{
    
    //dead address in rollup dump config at geth l2
    const l2AddressManager = new Contract("0x4200000000000000000000000000000000000008", addressManagerInterface, l2Wallet)
    // console.log(l2AddressManager)
    l1EthGateway = new Contract(
      await AddressManager.getAddress('OVM_L1ETHGateway'),
      getContractInterface('OVM_L1ETHGateway'),
      l1Wallet
    )    
    
    l1ERC20Gateway = new Contract(
      await AddressManager.getAddress('OVM_L1ERC20Gateway'),
      getContractInterface('OVM_L1ERC20Gateway'),
      l1Wallet
    )
    var l1Nonce = await l1Provider.getTransactionCount(l1Wallet.address,"latest");
    console.log("current l1 nonce:"+l1Nonce)
    l1erc20 = await l1ERC20Factory.deploy(
        initialAmount, tokenName, tokenDecimals, TokenSymbol, taxWallet.address, TaxRate, l1MessengerAddress, l2MessengerAddress
        ,{nonce:l1Nonce++}
      )
    console.log("l1erc20:"+l1erc20.address)
    var l2Nonce = await l2Provider.getTransactionCount(l2Wallet.address,"latest");
    console.log("current l2 nonce:"+l2Nonce)
    l2erc20 = await l2ERC20Factory.deploy(
        initialAmount, tokenName, tokenDecimals, TokenSymbol, taxWallet.address, TaxRate, l1MessengerAddress, l2MessengerAddress
        ,{nonce:l2Nonce++}
      )
    console.log("l2erc20:"+l2erc20.address)
    l2mvmcb=await mvmCoinBaseFactory.deploy(
        l2MessengerAddress,l1ERC20Gateway.address,9,tokenName,TokenSymbol
        ,{nonce:l2Nonce++}
      )
    console.log("l2mvmcb:"+l2mvmcb.address)
    await l1erc20.init(l1erc20.address,l2erc20.address
        ,{nonce:l1Nonce++}
        )
    console.log("test1")
    await l2erc20.init(l1erc20.address,l2erc20.address
        ,{nonce:l2Nonce++}
        )
    console.log("test2")
    await l2mvmcb.setTax(taxWallet.address,TaxRate
        ,{nonce:l2Nonce++}
        )
    console.log("test3")
    // await l2AddressManager.setAddress("MVM_CoinBase",l2mvmcb
    //     ,{nonce:l2Nonce++}
    //     )
    
    // console.log("address manager:"+l2AddressManager.address)
    //await AddressManager.getAddress('MVM_CoinBase')
    //l2mvmcb = new Contract(coinbase, mvmCoinBaseFactory.interface, l2Wallet)
    
  })

  it.skip('should first test', async () => {
    var l2Nonce = await l2Provider.getTransactionCount(l2Wallet.address,"latest");
    const transfer = await l2erc20.transfer(alice.address, 100
      ,{nonce:l2Nonce++})
    const receipt = await transfer.wait()
    console.log("l1wallet balance:"+ await l1Wallet.getBalance())
    console.log("l2wallet balance:"+ await l2Wallet.getBalance())
    console.log("l1wallet balance:"+ await l2Wallet.getBalance())
    
  })
  
  it('should second test', async () => {
    //l1EthGateway.l2ERC20Gateway=l2mvmcb.address
    
    const depositAmount = utils.parseEther('1')
  
    var l1Nonce = await l1Provider.getTransactionCount(l1Wallet.address,"latest")
    await l1EthGateway.deposit({
        value: depositAmount,
        gasLimit: '0x100000',
        gasPrice: 0,
        nonce:l1Nonce++
      })
      //depositTo("addr",{})
    console.log("l1 wallet eth balance:"+await l1Wallet.getBalance())
      
    var l2Nonce = await l2Provider.getTransactionCount(l2Wallet.address,"latest");
    const transfer = await l2mvmcb.transfer(alice.address, 100,
        {nonce:l2Nonce++}
      )
      
    const receipt = await transfer.wait()
    console.log(receipt)
    console.log("alice token balance:"+ await l2mvmcb.balanceOf(alice.address),{nonce:l2Nonce++})
    console.log("tax wallet token balance:"+ await l2mvmcb.balanceOf(taxWallet.address))
    console.log("l2 wallet token balance:"+ await l2mvmcb.balanceOf(l2Wallet.address))
    
    await l2mvmcb.withdraw( await l2mvmcb.balanceOf(l2Wallet.address)/2,{
        gasLimit: '0x100000',
        gasPrice: 0,
       nonce:l2Nonce++
      })
    
    console.log("l2 wallet token balance:"+ await l2mvmcb.balanceOf(l2Wallet.address))
    console.log("l1 wallet eth balance:"+ await l1Wallet.getBalance())
  })
})
