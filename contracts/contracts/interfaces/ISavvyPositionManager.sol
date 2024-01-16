// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

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
}
