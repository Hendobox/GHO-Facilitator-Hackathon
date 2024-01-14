// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "./errors/WhitelisterError.sol";

contract Whitelister is AccessControlEnumerable, WhitelisterError {
    bytes32 public constant NFT_WHITELISTER_ROLE = keccak256("NFT_WHITELISTER");
    bytes32 public constant DESTINATION_CHAIN_WHITELISTER_ROLE =
        keccak256("DESTINATION_CHAIN_WHITELISTER");

    mapping(address => bool)  isWhitelistedNFT;
    mapping(address => bool)  isWhitelistedDstination;

    constructor(
        address nftWhitelister,
        address destinationWhitelister,
        bytes32 roleAdmin
    ) {
        _setupRole(NFT_WHITELISTER_ROLE, nftWhitelister);
        _setRoleAdmin(NFT_WHITELISTER_ROLE, roleAdmin);

        _setupRole(DESTINATION_CHAIN_WHITELISTER_ROLE, destinationWhitelister);
        _setRoleAdmin(DESTINATION_CHAIN_WHITELISTER_ROLE, roleAdmin);
    }

    modifier onlyWHitelistedNFT(address nftAddress) {
        if (!isWhitelistedNFT[nftAddress]) revert Only_WHitelisted_NFT();
        _;
    }

    modifier onlyWHitelistedDestination(uint64 destinationChain) {
        if (!isWhitelistedDstination[destinationChain]) revert Only_WHitelisted_ChainT();
        _;
    }

    function whitelistNFT(
        address token,
        bool whitelist
    ) external onlyRole(NFT_WHITELISTER_ROLE) {
        isWhitelistedNFT[token] = whitelist;
        emit WhitelistNFT(token, whitelist);
    }

    function whitelistDestinationChain(
        uint64 destinationChain,
        bool whitelist
    ) external onlyRole(DESTINATION_CHAIN_WHITELISTER_ROLE) {
        isWhitelistedDestination[destinationChain] = whitelist;
        emit whitelistDestinationChain(destinationChain, whitelist);
    }

    function isWhitelistedNFT(address token) external view returns (bool) {
        return isWhitelistedNFT[token];
    }

    function isWhitelistedDestination(
        uint64 destinationChain
    ) external view returns (bool) {
        return isWhitelistedDstination[destinationChain];
    };
}
