// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";

enum Facilitator {
    // If using the native facilitator
    Native,
    // If using the AaveV3 facilitator
    AaveV3
}

library FacilitatorLib {
    IPool private aaveV3Pool;
    uint16 public referralCode = 0;

    // sepolia - 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951
    // arbitrum testnet - 0x20fa38a4f8Af2E36f1Cc14caad2E603fbA5C535c
    constructor(address _aaveV3Pool) {
        aaveV3Pool = IPool(_aaveV3Pool);
    }

    function supplyUSDC(
        address asset,
        uint256 amount,
        address onBehalfOf
    ) public {
        aaveV3Pool.supply(asset, amount, onBehalfOf, referralCode);
    }

    function borrowGHO(
        address asset,
        uint256 amount,
        address onBehalfOf
    ) public {
        // use interest rate as 1 for stable
        aaveV3Pool.borrow(asset, amount, 1, onBehalfOf, referralCode);
    }
}
