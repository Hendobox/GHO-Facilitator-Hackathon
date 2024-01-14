// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(
        address initHolder,
        uint256 supply,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        _mint(initHolder, supply);
    }
}
