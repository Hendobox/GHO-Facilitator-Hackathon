// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

contract IWhitelister {
    // ============= Events ==============

    event WhitelistNFT(address indexed token, bool indexed whitelist);
    event whitelistDestinationChain(
        uint64 indexed destinationChain,
        bool indexed whitelist
    );

    // ================ Resource Metadata ================

    function whitelistNFT(address token, bool whitelist) external;

    function whitelistDestinationChain(
        uint64 destinationChain,
        bool whitelist
    ) external;

    function isWhitelistedNFT(address token) external view returns (bool);

    function isWhitelistedDestination(uint64  destinationChain) external view returns (bool);
}
