// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

contract SimpleProxy {
    address internal owner;
    address internal target;

    constructor() public {
        owner = msg.sender;
    }

    function()
        external
    {
        makeExternalCall(target, msg.data);
    }

    function setTarget(
        address _target
    )
        public
    {
        if (msg.sender == owner) {
            target = _target;
        } else {
            makeExternalCall(target, msg.data);
        }
    }

    function makeExternalCall(
        address _target,
        bytes memory _calldata
    )
        internal
    {
        (bool success, bytes memory returndata) = _target.call(_calldata);

        if (success) {
            assembly {
                return(add(returndata, 0x20), mload(returndata))
            }
        } else {
            assembly {
                revert(add(returndata, 0x20), mload(returndata))
            }
        }
    }
}
