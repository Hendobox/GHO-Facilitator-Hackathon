// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {ISavvyPositionManager} from "../interfaces/ISavvyPositionManager.sol";

library FacilitatorLib {
    // sepolia - 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951
    // arbitrum testnet - 0x20fa38a4f8Af2E36f1Cc14caad2E603fbA5C535c
    IPool internal constant aaveV3Pool =
        IPool(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951);

    ISavvyPositionManager internal constant savvyPool =
        ISavvyPositionManager(0x409304EBF2EBA28461eb1Be36b2984178850848c);

    function supplyAaveUSDC(
        address asset,
        uint256 amount,
        address onBehalfOf
    ) public {
        aaveV3Pool.supply(asset, amount, onBehalfOf, 0);
    }

    function borrowAaveGHO(
        address asset,
        uint256 amount,
        address onBehalfOf
    ) public {
        // use interest rate as 1 for stable
        aaveV3Pool.borrow(asset, amount, 1, 0, onBehalfOf);
    }

    function supplySavvyGHO(
        address yieldToken,
        uint256 amount,
        address recipient,
        uint256 minimumAmountOut
    ) public {
        savvyPool.depositBaseToken(
            yieldToken,
            amount,
            recipient,
            minimumAmountOut
        );
    }

    function repaySavvyGHO(
        address baseToken_,
        uint256 amount,
        address recipient
    ) public {
        savvyPool.repayWithBaseToken(baseToken_, amount, recipient);
    }
}
