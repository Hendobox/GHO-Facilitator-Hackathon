// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {ISavvyPositionManager} from "./interfaces/ISavvyPositionManager.sol";

contract Facilitator {
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
    ) internal {
        aaveV3Pool.supply(asset, amount, onBehalfOf, 0);
    }

    function borrowAaveGHO(
        address asset,
        uint256 amount,
        address onBehalfOf
    ) internal {
        // use interest rate as 2 for unstable
        aaveV3Pool.borrow(asset, amount, 2, 0, onBehalfOf);
    }

    function repayAave(
        address asset,
        uint256 amount,
        uint256 rateMode,
        address onBehalfOf
    ) internal {
        aaveV3Pool.repay(asset, amount, rateMode, onBehalfOf);
    }

    function getUserAccountData(
        address user
    )
        public
        view
        returns (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        )
    {
        return aaveV3Pool.getUserAccountData(user);
    }

    function supplySavvyGHO(
        address yieldToken,
        uint256 amount,
        address recipient,
        uint256 minimumAmountOut
    ) internal returns (uint256) {
        return
            savvyPool.depositBaseToken(
                yieldToken,
                amount,
                recipient,
                minimumAmountOut
            );
    }

    function withdrawSavvyGHO(
        address owner_,
        address baseToken_,
        uint256 amount,
        address recipient
    ) internal {
        // savvyPool.withdrawBaseTokenFrom(
        //     owner_,
        //     baseToken_,
        //     amount,
        //     recipient,
        //     1
        // );
    }

    function convertSharesToBaseTokens(
        address yieldToken,
        uint256 amount
    ) public view returns (uint256) {
        // return savvyPool.convertSharesToBaseTokens(yieldToken, amount);
    }
}
