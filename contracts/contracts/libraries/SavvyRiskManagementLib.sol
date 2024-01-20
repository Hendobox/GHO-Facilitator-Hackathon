// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {ISavvyPositionManager} from "../interfaces/ISavvyPositionManager.sol";
import {IYSM} from "../interfaces/IYSM.sol";

library SavvyRiskManagementLib {
    // spm usd - 0x32C66f13C282212193C37dD7643C9EfFb303A83d
    // beefy gho yield token - 0x6378A7A5f838C8919027F21498ae4683c3ce0346

    ISavvyPositionManager internal constant savvyPool =
        ISavvyPositionManager(0x32C66f13C282212193C37dD7643C9EfFb303A83d);

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
        address yieldToken,
        uint256 share,
        address recipient
    ) internal {
        savvyPool.withdrawBaseToken(yieldToken, share, recipient, 1);
    }

    function convertSharesToBaseTokens(
        address yieldToken,
        uint256 amount
    ) internal view returns (uint256 amountBaseTokens) {
        (, amountBaseTokens) = IYSM(address(savvyPool.yieldStrategyManager()))
            .convertSharesToBaseTokens(yieldToken, amount);
    }
}
