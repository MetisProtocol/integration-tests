/**
 * Copyright 2020, Optimism PBC
 * MIT License
 * https://github.com/ethereum-optimism
 */

import { expect } from '../setup'

/* Imports: External */
import { ethers } from 'hardhat'
import { BigNumber, Contract, ContractFactory } from 'ethers'
import _ from 'lodash'

describe('Basic storage operations via CALL (get and set)', () => {
    // Use a shorter polling interval.
    ethers.provider.pollingInterval = 10

    let Factory__SimpleStorage: ContractFactory
    let Factory__SimpleProxy: ContractFactory
    before(async () => {
        Factory__SimpleStorage = await ethers.getContractFactory('SimpleStorage')
        Factory__SimpleProxy = await ethers.getContractFactory('SimpleProxy')
    })

    let SimpleStorageProxy: Contract
    beforeEach(async () => {
        const SimpleStorage = await Factory__SimpleStorage.deploy()
        await SimpleStorage.deployTransaction.wait()

        const SimpleProxy = await Factory__SimpleProxy.deploy()
        await SimpleProxy.deployTransaction.wait()

        const res = await SimpleProxy.setTarget(SimpleStorage.address)
        await res.wait()

        SimpleStorageProxy = Factory__SimpleStorage.attach(SimpleProxy.address)
    })

    describe('fixed size variables', () => {
        describe('bool', () => {
            it('should be able to set a boolean value', async () => {
                const res1 = await SimpleStorageProxy.setBool(true)
                await res1.wait()
            })

            it('should be able to set and then reset a boolean value', async () => {
                const res1 = await SimpleStorageProxy.setBool(true)
                await res1.wait()

                const res2 = await SimpleStorageProxy.setBool(false)
                await res2.wait()
            })

            it('should be able to retrieve an unset boolean value', async () => {
                expect(
                    await SimpleStorageProxy.getBool()
                ).to.equal(false)
            })

            it('should be able to retrieve a set boolean value', async () => {
                const res1 = await SimpleStorageProxy.setBool(true)
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getBool()
                ).to.equal(true)
            })

            it('should be able to retrieve a reset boolean value', async () => {
                const res1 = await SimpleStorageProxy.setBool(true)
                await res1.wait()

                const res2 = await SimpleStorageProxy.setBool(false)
                await res2.wait()

                expect(
                    await SimpleStorageProxy.getBool()
                ).to.equal(false)
            })
        })

        describe('int256', () => {
            it('should be able to set a positive int256 value', async () => {
                const res1 = await SimpleStorageProxy.setInt256(1234)
                await res1.wait()
            })

            it('should be able to set a negative int256 value', async () => {
                const res1 = await SimpleStorageProxy.setInt256(-1234)
                await res1.wait()
            })

            it('should be able to set and then reset an int256 value', async () => {
                const res1 = await SimpleStorageProxy.setInt256(1234)
                await res1.wait()

                const res2 = await SimpleStorageProxy.setInt256(0)
                await res2.wait()
            })

            it('should be able to retrieve an unset int256 value', async () => {
                expect(
                    await SimpleStorageProxy.getInt256()
                ).to.equal(0)
            })

            it('should be able to retrieve a positive int256 value', async () => {
                const res1 = await SimpleStorageProxy.setInt256(1234)
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getInt256()
                ).to.equal(1234)
            })

            it('should be able to retrieve a negative int256 value', async () => {
                const res1 = await SimpleStorageProxy.setInt256(-1234)
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getInt256()
                ).to.equal(-1234)
            })

            it('should be able to retrieve a reset int256 value', async () => {
                const res1 = await SimpleStorageProxy.setInt256(1234)
                await res1.wait()

                const res2 = await SimpleStorageProxy.setInt256(0)
                await res2.wait()

                expect(
                    await SimpleStorageProxy.getInt256()
                ).to.equal(0)
            })
        })

        describe('uint256', () => {
            it('should be able to set a uint256 value', async () => {
                const res1 = await SimpleStorageProxy.setUint256(1234)
                await res1.wait()
            })

            it('should be able to set and then reset a uint256 value', async () => {
                const res1 = await SimpleStorageProxy.setUint256(1234)
                await res1.wait()

                const res2 = await SimpleStorageProxy.setUint256(0)
                await res2.wait()
            })

            it('should be able to retrieve an unset uint256 value', async () => {
                expect(
                    await SimpleStorageProxy.getUint256()
                ).to.equal(0)
            })

            it('should be able to retrieve a uint256 value', async () => {
                const res1 = await SimpleStorageProxy.setUint256(1234)
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getUint256()
                ).to.equal(1234)
            })

            it('should be able to retrieve a reset uint256 value', async () => {
                const res1 = await SimpleStorageProxy.setUint256(1234)
                await res1.wait()

                const res2 = await SimpleStorageProxy.setUint256(0)
                await res2.wait()

                expect(
                    await SimpleStorageProxy.getUint256()
                ).to.equal(0)
            })
        })

        describe('bytes32', () => {
            it('should be able to set a bytes32 value', async () => {
                const res1 = await SimpleStorageProxy.setBytes32('0x1234123412341234123412341234123412341234123412341234123412341234')
                await res1.wait()
            })

            it('should be able to set and then reset a bytes32 value', async () => {
                const res1 = await SimpleStorageProxy.setBytes32('0x1234123412341234123412341234123412341234123412341234123412341234')
                await res1.wait()

                const res2 = await SimpleStorageProxy.setBytes32('0x0000000000000000000000000000000000000000000000000000000000000000')
                await res2.wait()
            })

            it('should be able to retrieve an unset bytes32 value', async () => {
                expect(
                    await SimpleStorageProxy.getBytes32()
                ).to.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
            })

            it('should be able to retrieve a bytes32 value', async () => {
                const res1 = await SimpleStorageProxy.setBytes32('0x1234123412341234123412341234123412341234123412341234123412341234')
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getBytes32()
                ).to.equal('0x1234123412341234123412341234123412341234123412341234123412341234')
            })

            it('should be able to retrieve a reset bytes32 value', async () => {
                const res1 = await SimpleStorageProxy.setBytes32('0x1234123412341234123412341234123412341234123412341234123412341234')
                await res1.wait()

                const res2 = await SimpleStorageProxy.setBytes32('0x0000000000000000000000000000000000000000000000000000000000000000')
                await res2.wait()

                expect(
                    await SimpleStorageProxy.getBytes32()
                ).to.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
            })
        })

        describe('address', () => {
            it('should be able to set an address value', async () => {
                const res1 = await SimpleStorageProxy.setAddress('0x1234123412341234123412341234123412341234')
                await res1.wait()
            })

            it('should be able to set and then reset an address value', async () => {
                const res1 = await SimpleStorageProxy.setAddress('0x1234123412341234123412341234123412341234')
                await res1.wait()

                const res2 = await SimpleStorageProxy.setAddress('0x0000000000000000000000000000000000000000')
                await res2.wait()
            })

            it('should be able to retrieve an unset address value', async () => {
                expect(
                    await SimpleStorageProxy.getAddress()
                ).to.equal('0x0000000000000000000000000000000000000000')
            })

            it('should be able to retrieve an address value', async () => {
                const res1 = await SimpleStorageProxy.setAddress('0x1234123412341234123412341234123412341234')
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getAddress()
                ).to.equal('0x1234123412341234123412341234123412341234')
            })

            it('should be able to retrieve a reset address value', async () => {
                const res1 = await SimpleStorageProxy.setAddress('0x1234123412341234123412341234123412341234')
                await res1.wait()

                const res2 = await SimpleStorageProxy.setAddress('0x0000000000000000000000000000000000000000')
                await res2.wait()

                expect(
                    await SimpleStorageProxy.getAddress()
                ).to.equal('0x0000000000000000000000000000000000000000')
            })
        })
    })

    describe('dynamic size variables', () => {
        describe('bytes', () => {
            it('should be able to set a bytes value smaller than 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setBytes('0x1234123412341234123412341234123412341234')
                await res1.wait()
            })

            it('should be able to set a bytes value exactly 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setBytes('0x1234123412341234123412341234123412341234123412341234123412341234')
                await res1.wait()
            })

            it('should be able to set a bytes value larger than 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setBytes('0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234')
                await res1.wait()
            })

            it('should be able to set and then reset a bytes value', async () => {
                const res1 = await SimpleStorageProxy.setBytes('0x1234123412341234123412341234123412341234')
                await res1.wait()

                const res2 = await SimpleStorageProxy.setBytes('0x')
                await res2.wait()
            })

            it('should be able to retrieve an unset bytes value', async () => {
                expect(
                    await SimpleStorageProxy.getBytes()
                ).to.equal('0x')
            })

            it('should be able to retrieve a bytes value smaller than 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setBytes('0x1234123412341234123412341234123412341234')
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getBytes()
                ).to.equal('0x1234123412341234123412341234123412341234')
            })

            it('should be able to retrieve a bytes value exactly 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setBytes('0x1234123412341234123412341234123412341234123412341234123412341234')
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getBytes()
                ).to.equal('0x1234123412341234123412341234123412341234123412341234123412341234')
            })

            it('should be able to retrieve a bytes value larger than 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setBytes('0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234')
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getBytes()
                ).to.equal('0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234')
            })

            it('should be able to retrieve a reset bytes value', async () => {
                const res1 = await SimpleStorageProxy.setBytes('0x1234123412341234123412341234123412341234')
                await res1.wait()

                const res2 = await SimpleStorageProxy.setBytes('0x')
                await res2.wait()

                expect(
                    await SimpleStorageProxy.getBytes()
                ).to.equal('0x')
            })
        })

        describe('string', () => {
            it('should be able to set a string value smaller than 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setString('hello this is a testing string')
                await res1.wait()
            })

            it('should be able to set a string value exactly 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setString('hello this is a testing string !')
                await res1.wait()
            })

            it('should be able to set a string value larger than 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setString('hello this is a testing string !!!!!!!!')
                await res1.wait()
            })

            it('should be able to set and then reset a string value', async () => {
                const res1 = await SimpleStorageProxy.setString('hello this is a testing string')
                await res1.wait()

                const res2 = await SimpleStorageProxy.setString('')
                await res2.wait()
            })

            it('should be able to retrieve an unset string value', async () => {
                expect(
                    await SimpleStorageProxy.getString()
                ).to.equal('')
            })

            it('should be able to retrieve a string value smaller than 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setString('hello this is a testing string')
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getString()
                ).to.equal('hello this is a testing string')
            })

            it('should be able to retrieve a string value exactly 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setString('hello this is a testing string !')
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getString()
                ).to.equal('hello this is a testing string !')
            })

            it('should be able to retrieve a string value larger than 32 bytes', async () => {
                const res1 = await SimpleStorageProxy.setString('hello this is a testing string !!!!!!!!')
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getString()
                ).to.equal('hello this is a testing string !!!!!!!!')
            })

            it('should be able to retrieve a reset string value', async () => {
                const res1 = await SimpleStorageProxy.setString('hello this is a testing string')
                await res1.wait()

                const res2 = await SimpleStorageProxy.setString('')
                await res2.wait()

                expect(
                    await SimpleStorageProxy.getString()
                ).to.equal('')
            })
        })
    })

    describe('mappings', () => {
        describe('mapping (uint256 => uint256)', () => {
            it('should be able to set a mapped uint256 value', async () => {
                const res1 = await SimpleStorageProxy.setMapUint256Uint256(1234, 5678)
                await res1.wait()
            })

            it('should be able to set and then reset a mapped uint256 value', async () => {
                const res1 = await SimpleStorageProxy.setMapUint256Uint256(1234, 5678)
                await res1.wait()

                const res2 = await SimpleStorageProxy.setMapUint256Uint256(1234, 0)
                await res2.wait()
            })

            it('should be able to retrieve an unset mapped uint256 value', async () => {
                expect(
                    await SimpleStorageProxy.getMapUint256Uint256(1234)
                ).to.equal(0)
            })

            it('should be able to retrieve a mapped uint256 value', async () => {
                const res1 = await SimpleStorageProxy.setMapUint256Uint256(1234, 5678)
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getMapUint256Uint256(1234)
                ).to.equal(5678)
            })

            it('should be able to retrieve a reset mapped uint256 value', async () => {
                const res1 = await SimpleStorageProxy.setMapUint256Uint256(1234, 5678)
                await res1.wait()

                const res2 = await SimpleStorageProxy.setMapUint256Uint256(1234, 0)
                await res2.wait()

                expect(
                    await SimpleStorageProxy.getMapUint256Uint256(1234)
                ).to.equal(0)
            })
        })

        describe('mapping (bytes32 => bytes32)', () => {
            it('should be able to set a mapped bytes32 value', async () => {
                const res1 = await SimpleStorageProxy.setMapBytes32Bytes32(
                    '0x1234123412341234123412341234123412341234123412341234123412341234',
                    '0x5678567856785678567856785678567856785678567856785678567856785678',   
                )
                await res1.wait()
            })

            it('should be able to set and then reset a mapped bytes32 value', async () => {
                const res1 = await SimpleStorageProxy.setMapBytes32Bytes32(
                    '0x1234123412341234123412341234123412341234123412341234123412341234',
                    '0x5678567856785678567856785678567856785678567856785678567856785678',
                )
                await res1.wait()

                const res2 = await SimpleStorageProxy.setMapBytes32Bytes32(
                    '0x1234123412341234123412341234123412341234123412341234123412341234',
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                )
                await res2.wait()
            })

            it('should be able to retrieve an unset mapped bytes32 value', async () => {
                expect(
                    await SimpleStorageProxy.getMapBytes32Bytes32(
                        '0x1234123412341234123412341234123412341234123412341234123412341234'
                    )
                ).to.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
            })

            it('should be able to retrieve a mapped bytes32 value', async () => {
                const res1 = await SimpleStorageProxy.setMapBytes32Bytes32(
                    '0x1234123412341234123412341234123412341234123412341234123412341234',
                    '0x5678567856785678567856785678567856785678567856785678567856785678',
                )
                await res1.wait()

                expect(
                    await SimpleStorageProxy.getMapBytes32Bytes32(
                        '0x1234123412341234123412341234123412341234123412341234123412341234'
                    )
                ).to.equal('0x5678567856785678567856785678567856785678567856785678567856785678')
            })

            it('should be able to retrieve a reset mapped bytes32 value', async () => {
                const res1 = await SimpleStorageProxy.setMapBytes32Bytes32(
                    '0x1234123412341234123412341234123412341234123412341234123412341234',
                    '0x5678567856785678567856785678567856785678567856785678567856785678',
                )
                await res1.wait()

                const res2 = await SimpleStorageProxy.setMapBytes32Bytes32(
                    '0x1234123412341234123412341234123412341234123412341234123412341234',
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                )
                await res2.wait()

                expect(
                    await SimpleStorageProxy.getMapBytes32Bytes32(
                        '0x1234123412341234123412341234123412341234123412341234123412341234'
                    )
                ).to.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
            })
        })
    })

    describe('structs', () => {
        describe('fixed struct', () => {
            it('should be able to set a fixed struct value', async () => {
                const res1 = await SimpleStorageProxy.setFixedStruct({
                    val_bool: true,
                    val_int256: 1234,
                    val_uint256: 5678,
                    val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                    val_address: '0x1234123412341234123412341234123412341234'
                })
                await res1.wait()
            })

            it('should be able to set and then reset a fixed struct value', async () => {
                const res1 = await SimpleStorageProxy.setFixedStruct({
                    val_bool: true,
                    val_int256: 1234,
                    val_uint256: 5678,
                    val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                    val_address: '0x1234123412341234123412341234123412341234'
                })
                await res1.wait()

                const res2 = await SimpleStorageProxy.setFixedStruct({
                    val_bool: false,
                    val_int256: 0,
                    val_uint256: 0,
                    val_bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    val_address: '0x0000000000000000000000000000000000000000'
                })
                await res2.wait()
            })

            it('should be able to retrieve an unset fixed struct value', async () => {
                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getFixedStruct()
                    )
                ).to.deep.include({
                    val_bool: false,
                    val_int256: BigNumber.from(0),
                    val_uint256: BigNumber.from(0),
                    val_bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    val_address: '0x0000000000000000000000000000000000000000'
                })
            })

            it('should be able to retrieve a fixed struct value', async () => {    
                const res1 = await SimpleStorageProxy.setFixedStruct({
                    val_bool: true,
                    val_int256: BigNumber.from(1234),
                    val_uint256: BigNumber.from(5678),
                    val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                    val_address: '0x1234123412341234123412341234123412341234'
                })
                await res1.wait()

                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getFixedStruct()
                    )
                ).to.deep.include({
                    val_bool: true,
                    val_int256: BigNumber.from(1234),
                    val_uint256: BigNumber.from(5678),
                    val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                    val_address: '0x1234123412341234123412341234123412341234'
                })
            })

            it('should be able to retrieve a reset fixed struct value', async () => {
                const res1 = await SimpleStorageProxy.setFixedStruct({
                    val_bool: true,
                    val_int256: BigNumber.from(1234),
                    val_uint256: BigNumber.from(5678),
                    val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                    val_address: '0x1234123412341234123412341234123412341234'
                })
                await res1.wait()

                const res2 = await SimpleStorageProxy.setFixedStruct({
                    val_bool: false,
                    val_int256: BigNumber.from(0),
                    val_uint256: BigNumber.from(0),
                    val_bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    val_address: '0x0000000000000000000000000000000000000000'
                })
                await res2.wait()
        
                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getFixedStruct()
                    )
                ).to.deep.include({
                    val_bool: false,
                    val_int256: BigNumber.from(0),
                    val_uint256: BigNumber.from(0),
                    val_bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    val_address: '0x0000000000000000000000000000000000000000'
                })
            })
        })

        describe('dynamic struct', () => {
            it('should be able to set a dynamic struct value', async () => {
                const res1 = await SimpleStorageProxy.setDynamicStruct({
                    val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                    val_string: 'hello this is a testing string !!!!!!!!'
                })
                await res1.wait()
            })

            it('should be able to set and then reset a fixed struct value', async () => {
                const res1 = await SimpleStorageProxy.setDynamicStruct({
                    val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                    val_string: 'hello this is a testing string !!!!!!!!'
                })
                await res1.wait()

                const res2 = await SimpleStorageProxy.setDynamicStruct({
                    val_bytes: '0x',
                    val_string: ''
                })
                await res2.wait()
            })

            it('should be able to retrieve an unset fixed struct value', async () => {
                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getDynamicStruct()
                    )
                ).to.deep.include({
                    val_bytes: '0x',
                    val_string: ''
                })
            })

            it('should be able to retrieve a fixed struct value', async () => {    
                const res1 = await SimpleStorageProxy.setDynamicStruct({
                    val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                    val_string: 'hello this is a testing string !!!!!!!!'
                })
                await res1.wait()

                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getDynamicStruct()
                    )
                ).to.deep.include({
                    val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                    val_string: 'hello this is a testing string !!!!!!!!'
                })
            })

            it('should be able to retrieve a reset fixed struct value', async () => {
                const res1 = await SimpleStorageProxy.setDynamicStruct({
                    val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                    val_string: 'hello this is a testing string !!!!!!!!'
                })
                await res1.wait()

                const res2 = await SimpleStorageProxy.setDynamicStruct({
                    val_bytes: '0x',
                    val_string: ''
                })
                await res2.wait()
        
                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getDynamicStruct()
                    )
                ).to.deep.include({
                    val_bytes: '0x',
                    val_string: ''
                })
            })
        })

        describe('mixed struct', () => {
            it('should be able to set a dynamic struct value', async () => {
                const res1 = await SimpleStorageProxy.setMixedStruct({
                    val_bool: true,
                    val_int256: 1234,
                    val_uint256: 5678,
                    val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                    val_address: '0x1234123412341234123412341234123412341234',
                    val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                    val_string: 'hello this is a testing string !!!!!!!!'
                })
                await res1.wait()
            })

            it('should be able to set and then reset a fixed struct value', async () => {
                const res1 = await SimpleStorageProxy.setMixedStruct({
                    val_bool: true,
                    val_int256: 1234,
                    val_uint256: 5678,
                    val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                    val_address: '0x1234123412341234123412341234123412341234',
                    val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                    val_string: 'hello this is a testing string !!!!!!!!'
                })
                await res1.wait()

                const res2 = await SimpleStorageProxy.setMixedStruct({
                    val_bool: false,
                    val_int256: 0,
                    val_uint256: 0,
                    val_bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    val_address: '0x0000000000000000000000000000000000000000',
                    val_bytes: '0x',
                    val_string: ''
                })
                await res2.wait()
            })

            it('should be able to retrieve an unset fixed struct value', async () => {
                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getMixedStruct()
                    )
                ).to.deep.include({
                    val_bool: false,
                    val_int256: BigNumber.from(0),
                    val_uint256: BigNumber.from(0),
                    val_bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    val_address: '0x0000000000000000000000000000000000000000',
                    val_bytes: '0x',
                    val_string: ''
                })
            })

            it('should be able to retrieve a fixed struct value', async () => {    
                const res1 = await SimpleStorageProxy.setMixedStruct({
                    val_bool: true,
                    val_int256: BigNumber.from(1234),
                    val_uint256: BigNumber.from(5678),
                    val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                    val_address: '0x1234123412341234123412341234123412341234',
                    val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                    val_string: 'hello this is a testing string !!!!!!!!'
                })
                await res1.wait()

                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getMixedStruct()
                    )
                ).to.deep.include({
                    val_bool: true,
                    val_int256: BigNumber.from(1234),
                    val_uint256: BigNumber.from(5678),
                    val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                    val_address: '0x1234123412341234123412341234123412341234',
                    val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                    val_string: 'hello this is a testing string !!!!!!!!'
                })
            })

            it('should be able to retrieve a reset fixed struct value', async () => {
                const res1 = await SimpleStorageProxy.setMixedStruct({
                    val_bool: true,
                    val_int256: BigNumber.from(1234),
                    val_uint256: BigNumber.from(5678),
                    val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                    val_address: '0x1234123412341234123412341234123412341234',
                    val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                    val_string: 'hello this is a testing string !!!!!!!!'
                })
                await res1.wait()

                const res2 = await SimpleStorageProxy.setMixedStruct({
                    val_bool: false,
                    val_int256: BigNumber.from(0),
                    val_uint256: BigNumber.from(0),
                    val_bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    val_address: '0x0000000000000000000000000000000000000000',
                    val_bytes: '0x',
                    val_string: ''
                })
                await res2.wait()
        
                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getMixedStruct()
                    )
                ).to.deep.include({
                    val_bool: false,
                    val_int256: BigNumber.from(0),
                    val_uint256: BigNumber.from(0),
                    val_bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    val_address: '0x0000000000000000000000000000000000000000',
                    val_bytes: '0x',
                    val_string: ''
                })
            })
        })

        describe('nested struct', () => {
            it('should be able to set a nested struct value', async () => {
                const res1 = await SimpleStorageProxy.setNestedStruct({
                    val_fixed_struct: {
                        val_bool: true,
                        val_int256: 1234,
                        val_uint256: 5678,
                        val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                        val_address: '0x1234123412341234123412341234123412341234',
                    },
                    val_dynamic_struct: {
                        val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                        val_string: 'hello this is a testing string !!!!!!!!'
                    },
                })
                await res1.wait()
            })

            it('should be able to set and then reset a nested struct value', async () => {
                const res1 = await SimpleStorageProxy.setNestedStruct({
                    val_fixed_struct: {
                        val_bool: true,
                        val_int256: 1234,
                        val_uint256: 5678,
                        val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                        val_address: '0x1234123412341234123412341234123412341234',
                    },
                    val_dynamic_struct: {
                        val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                        val_string: 'hello this is a testing string !!!!!!!!'
                    },
                })
                await res1.wait()

                const res2 = await SimpleStorageProxy.setNestedStruct({
                    val_fixed_struct: {
                        val_bool: false,
                        val_int256: 0,
                        val_uint256: 0,
                        val_bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
                        val_address: '0x0000000000000000000000000000000000000000',
                    },
                    val_dynamic_struct: {
                        val_bytes: '0x',
                        val_string: '',
                    }
                })
                await res2.wait()
            })

            it('should be able to retrieve an unset nested struct value', async () => {
                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getNestedStruct()
                    )
                ).to.deep.include({
                    val_fixed_struct: [
                        false,
                        BigNumber.from(0),
                        BigNumber.from(0),
                        '0x0000000000000000000000000000000000000000000000000000000000000000',
                        '0x0000000000000000000000000000000000000000',
                    ],
                    val_dynamic_struct: [
                        '0x',
                        '',
                    ]
                })
            })

            it('should be able to retrieve a nested struct value', async () => {    
                const res1 = await SimpleStorageProxy.setNestedStruct({
                    val_fixed_struct: {
                        val_bool: true,
                        val_int256: 1234,
                        val_uint256: 5678,
                        val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                        val_address: '0x1234123412341234123412341234123412341234',
                    },
                    val_dynamic_struct: {
                        val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                        val_string: 'hello this is a testing string !!!!!!!!'
                    },
                })
                await res1.wait()

                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getNestedStruct()
                    )
                ).to.deep.include({
                    val_fixed_struct: [
                        true,
                        BigNumber.from(1234),
                        BigNumber.from(5678),
                        '0x1234123412341234123412341234123412341234123412341234123412341234',
                        '0x1234123412341234123412341234123412341234',
                    ],
                    val_dynamic_struct: [
                        '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                        'hello this is a testing string !!!!!!!!'
                    ],
                })
            })

            it('should be able to retrieve a nested struct struct value', async () => {
                const res1 = await SimpleStorageProxy.setNestedStruct({
                    val_fixed_struct: {
                        val_bool: true,
                        val_int256: 1234,
                        val_uint256: 5678,
                        val_bytes32: '0x1234123412341234123412341234123412341234123412341234123412341234',
                        val_address: '0x1234123412341234123412341234123412341234',
                    },
                    val_dynamic_struct: {
                        val_bytes: '0x12341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234123412341234',
                        val_string: 'hello this is a testing string !!!!!!!!'
                    },
                })
                await res1.wait()

                const res2 = await SimpleStorageProxy.setNestedStruct({
                    val_fixed_struct: {
                        val_bool: false,
                        val_int256: 0,
                        val_uint256: 0,
                        val_bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
                        val_address: '0x0000000000000000000000000000000000000000',
                    },
                    val_dynamic_struct: {
                        val_bytes: '0x',
                        val_string: '',
                    }
                })
                await res2.wait()
        
                expect(
                    _.toPlainObject(
                        await SimpleStorageProxy.getNestedStruct()
                    )
                ).to.deep.include({
                    val_fixed_struct: [
                        false,
                        BigNumber.from(0),
                        BigNumber.from(0),
                        '0x0000000000000000000000000000000000000000000000000000000000000000',
                        '0x0000000000000000000000000000000000000000',
                    ],
                    val_dynamic_struct: [
                        '0x',
                        '',
                    ]
                })
            })
        })
    })
})
