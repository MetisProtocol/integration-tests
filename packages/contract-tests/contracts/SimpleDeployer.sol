// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

import { SimpleProxy } from "./SimpleProxy.sol";
import { SimpleStorage } from "./SimpleStorage.sol";

contract SimpleDeployer is SimpleProxy {
    constructor() public
        SimpleProxy()
    {
        SimpleStorage tgt = new SimpleStorage();
        setTarget(address(tgt));
    }
}
