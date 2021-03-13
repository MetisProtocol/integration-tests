/*
Implements ERC20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
.*/


pragma solidity ^0.5.16;

import "./IERC20.sol";

contract MVM_ERC20 is IERC20 {

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;
    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                   //fancy name: eg OVM Coin
    uint8 public decimals;                //How many decimals to show.
    string public symbol;                 //An identifier: eg OVM
    uint256 public totalSupply;
    address taxAddress;
    uint256 taxRate; //percent of percent
    
    address l1MessengerAddress;
    address l2MessengerAddress;
    address l1MVMERC20Address;
    address l2MVMERC20Address;

    constructor(
        uint256 _initialAmount,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol,
        address _taxAddress,
        uint256 _taxRate,
        address _l1MessengerAddress,
        address _l2MessengerAddress
    ) public {
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
        taxAddress = _taxAddress;
        if(_taxRate<0)
            _taxRate=0;
        taxRate = _taxRate;
        l1MessengerAddress=_l1MessengerAddress;
        l2MessengerAddress=_l2MessengerAddress;
    }
    
    function init(address _l1MVMERC20Address, address _l2MVMERC20Address) external returns (bool success) {
        require(l1MVMERC20Address==address(0)&&l2MVMERC20Address==address(0));
        l1MVMERC20Address=_l1MVMERC20Address;
        l2MVMERC20Address=_l2MVMERC20Address;
        return true;
    }

    function transfer(address _to, uint256 _value) external returns (bool success) {
        require(balances[msg.sender] >= _value);
        uint256 tax=_value*taxRate/10000;
        uint256 remaining=_value-tax;
        require(tax >= 0 && remaining > 0);
        balances[msg.sender] -= _value;
        balances[_to] += remaining;
        balances[taxAddress] += tax;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success) {
        //todo need check permissions transfer _from address for this msg sender.
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);
        uint256 tax=_value*taxRate/10000;
        uint256 remaining=_value-tax;
        require(tax >= 0 && remaining > 0);
        balances[_from] -= _value;
        balances[_to] += remaining;
        balances[taxAddress] += tax;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value);
        return true;
    }

    function balanceOf(address _owner) external view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) external returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) external view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
    
    function depositL1ToL2(address l2OwnerAddrress,uint256 newValue) external returns (bool ret){
        balances[msg.sender]  -= newValue;
        bytes memory message=abi.encodeWithSignature(
            "depositMsg(address,uint256)",
            l2MVMERC20Address,
            l2OwnerAddrress,
            newValue
        );
        bytes memory data = _getXDomainCalldata(l1MessengerAddress,message,5000000);
        (bool success, )=l1MessengerAddress.call(data);
        emit Transfer(msg.sender,l2OwnerAddrress,newValue);
        return success;
    }
    
    function depositMsg(address _owner,uint256 newValue) public returns (bool ret){
        //todo check deposit or withdraw permissions
        //require(msg.sender==l1MessengerAddress);
        balances[_owner]  += newValue;
        emit Transfer(l1MessengerAddress,_owner,newValue);
        return true;
    }
    
    function withdrawL2ToL1(address l1OwnerAddrress,uint256 newValue) external returns (bool ret){
        balances[msg.sender]  -= newValue;
        bytes memory message=abi.encodeWithSignature(
            "withdrawMsg(address,uint256)",
            l1MVMERC20Address,
            l1OwnerAddrress,
            newValue
        );
        bytes memory data=_getXDomainCalldata(l2MessengerAddress,message,5000000);
        (bool success, )  = l2MessengerAddress.call(data);
        emit Transfer(msg.sender,l1OwnerAddrress,newValue);
        return success;
    }
    
    function withdrawMsg(address _owner,uint256 newValue) public returns (bool ret){
        //todo check deposit or withdraw permissions
        //require(msg.sender==l2MessengerAddress);
        balances[_owner]  += newValue;
        emit Transfer(l2MessengerAddress, _owner, newValue);
        return true;
    }
    
    function _getXDomainCalldata(
        address _target,
        bytes memory _message,
        uint32 _gasLimit
    )
        internal
        pure
        returns (
            bytes memory
        )
    {
        return abi.encodeWithSignature(
            "sendMessage(address,bytes,uint32)",
            _target,
            _message,
            _gasLimit
        );
    }
}
