// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract SimpleStorage {
    bool    private val_bool;
    int256  private val_int256;
    uint256 private val_uint256;
    bytes32 private val_bytes32;
    address private val_address;
    bytes   private val_bytes;
    string  private val_string;
    
    mapping (uint256 => uint256) private map_uint256_uint256;
    mapping (bytes32 => bytes32) private map_bytes32_bytes32;
    mapping (address => address) private map_address_address;

    mapping (bytes32 => uint256) private map_bytes32_uint256;
    mapping (bytes32 => address) private map_bytes32_address;

    mapping (uint256 => bytes32) private map_uint256_bytes32;
    mapping (uint256 => address) private map_uint256_address;

    mapping (address => bytes32) private map_address_bytes32;
    mapping (address => uint256) private map_address_uint256;

    struct FixedStruct {
        bool    val_bool;
        int256  val_int256;
        uint256 val_uint256;
        bytes32 val_bytes32;
        address val_address;
    }

    struct DynamicStruct {
        bytes  val_bytes;
        string val_string;
    }

    struct MixedStruct {
        // Fixed values.
        bool    val_bool;
        int256  val_int256;
        uint256 val_uint256;
        bytes32 val_bytes32;
        address val_address;

        // Dynamic values.
        bytes  val_bytes;
        string val_string;
    }

    struct NestedStruct {
        FixedStruct   val_fixed_struct;
        DynamicStruct val_dynamic_struct;
    }

    FixedStruct   private val_fixed_struct;
    DynamicStruct private val_dynamic_struct;
    MixedStruct   private val_mixed_struct;
    NestedStruct  private val_nested_struct;

    function getBool()
        public
        view
        returns (
            bool
        )
    {
        return val_bool;
    }

    function setBool(
        bool _val
    )
        public
    {
        val_bool = _val;
    }

    function getInt256()
        public
        view
        returns (
            int256
        )
    {
        return val_int256;
    }

    function setInt256(
        int256 _val
    )
        public
    {
        val_int256 = _val;
    }

    function getUint256()
        public
        view
        returns (
            uint256
        )
    {
        return val_uint256;
    }

    function setUint256(
        uint256 _val
    )
        public
    {
        val_uint256 = _val;
    }

    function getBytes32()
        public
        view
        returns (
            bytes32
        )
    {
        return val_bytes32;
    }

    function setBytes32(
        bytes32 _val
    )
        public
    {
        val_bytes32 = _val;
    }

    function getAddress()
        public
        view
        returns (
            address
        )
    {
        return val_address;
    }

    function setAddress(
        address _val
    )
        public
    {
        val_address = _val;
    }

    function getBytes()
        public
        view
        returns (
            bytes memory
        )
    {
        return val_bytes;
    }

    function setBytes(
        bytes memory _val
    )
        public
    {
        val_bytes = _val;
    }

    function getString()
        public
        view
        returns (
            string memory
        )
    {
        return val_string;
    }

    function setString(
        string memory _val
    )
        public
    {
        val_string = _val;
    }

    function getMapUint256Uint256(
        uint256 _key
    )
        public
        view
        returns (
            uint256
        )
    {
        return map_uint256_uint256[_key];
    }

    function setMapUint256Uint256(
        uint256 _key,
        uint256 _val
    )
        public
    {
        map_uint256_uint256[_key] = _val;
    }

    function getMapBytes32Bytes32(
        bytes32 _key
    )
        public
        view
        returns (
            bytes32
        )
    {
        return map_bytes32_bytes32[_key];
    }

    function setMapBytes32Bytes32(
        bytes32 _key,
        bytes32 _val
    )
        public
    {
        map_bytes32_bytes32[_key] = _val;
    }

    function getFixedStruct()
        public
        view
        returns (
            FixedStruct memory
        )
    {
        return val_fixed_struct;
    }

    function setFixedStruct(
        FixedStruct memory _val
    )
        public
    {
        val_fixed_struct = _val;
    }

    function getDynamicStruct()
        public
        view
        returns (
            DynamicStruct memory
        )
    {
        return val_dynamic_struct;
    }

    function setDynamicStruct(
        DynamicStruct memory _val
    )
        public
    {
        val_dynamic_struct = _val;
    }

    function getMixedStruct()
        public
        view
        returns (
            MixedStruct memory
        )
    {
        return val_mixed_struct;
    }

    function setMixedStruct(
        MixedStruct memory _val
    )
        public
    {
        val_mixed_struct = _val;
    }

    function getNestedStruct()
        public
        view
        returns (
            NestedStruct memory
        )
    {
        return val_nested_struct;
    }

    function setNestedStruct(
        NestedStruct memory _val
    )
        public
    {
        val_nested_struct = _val;
    }
}
