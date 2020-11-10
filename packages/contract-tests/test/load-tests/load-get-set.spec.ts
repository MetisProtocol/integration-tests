/**
 * Copyright 2020, Optimism PBC
 * MIT License
 * https://github.com/ethereum-optimism
 */

import { expect } from '../setup'

/* Imports: External */
import { ethers } from 'hardhat'
import { BigNumber, Contract, ContractFactory } from 'ethers'

describe('Load tests: basic storage operations (get and set)', () => {
    // Use a shorter polling interval.
    ethers.provider.pollingInterval = 10

    let Factory__SimpleStorage: ContractFactory
    before(async () => {
        Factory__SimpleStorage = await ethers.getContractFactory('SimpleStorage')
    })

    let SimpleStorage: Contract
    beforeEach(async () => {
        SimpleStorage = await Factory__SimpleStorage.deploy()
    })

    describe('stress test', () => {
        describe('fixed variables', () => {
            it('(in series) should be able to retrieve the default value of all fixed variables at once', async () => {
                for (let i = 0; i < 32; i++) {
                    const actions = [
                        SimpleStorage.getBool,
                        SimpleStorage.getInt256,
                        SimpleStorage.getUint256,
                        SimpleStorage.getBytes32,
                        SimpleStorage.getAddress,
                    ]

                    const results = []
                    for (const action of actions) {
                        results.push(await action())
                    }

                    expect(results).to.deep.equal([
                        false,
                        BigNumber.from(0),
                        BigNumber.from(0),
                        '0x0000000000000000000000000000000000000000000000000000000000000000',
                        '0x0000000000000000000000000000000000000000',
                    ])
                }
            })

            it('(in parallel) should be able to retrieve the default value of all fixed variables at once', async () => {
                for (let i = 0; i < 128; i++) {
                    const results = await Promise.all([
                        SimpleStorage.getBool(),
                        SimpleStorage.getInt256(),
                        SimpleStorage.getUint256(),
                        SimpleStorage.getBytes32(),
                        SimpleStorage.getAddress(),
                    ])

                    expect(results).to.deep.equal([
                        false,
                        BigNumber.from(0),
                        BigNumber.from(0),
                        '0x0000000000000000000000000000000000000000000000000000000000000000',
                        '0x0000000000000000000000000000000000000000',
                    ])
                }
            })
        })
    })
})
