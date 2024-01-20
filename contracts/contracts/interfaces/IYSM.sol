// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.21;

interface IYSM {
    function convertSharesToBaseTokens(
        address yieldToken,
        uint256 shares
    ) external view returns (address baseToken, uint256 amountBaseTokens);
}
