// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./IYSM.sol";

interface ISavvyPositionManager {
    function depositBaseToken(
        address yieldToken,
        uint256 amount,
        address recipient,
        uint256 minimumAmountOut
    ) external returns (uint256);

    function repayWithBaseToken(
        address baseToken_,
        uint256 amount,
        address recipient
    ) external returns (uint256);

    function withdrawBaseToken(
        address yieldToken,
        uint256 shares,
        address recipient,
        uint256 minimumAmountOut
    ) external returns (uint256 amountWithdrawn);

    function yieldStrategyManager() external view returns (IYSM);

    function positions(
        address owner,
        address yieldToken
    )
        external
        view
        returns (
            uint256 shares,
            uint256 harvestedYield,
            uint256 lastAccruedWeight
        );

    function add(address caller) external;
}
