// SPDX-License-Identifier: MIT

pragma solidity 0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "./Errors.sol";
import "./interfaces/IWhitelister.sol";

contract Whitelister is AccessControlEnumerable, Ownable, IWhitelister {
    mapping(address => bool) _isWhitelistedNFT;
    mapping(uint64 => bool) _isWhitelistedDestination;

    constructor(address admin) Ownable(admin) {
        // whitelist base network
        _isWhitelistedDestination[getChainId()] = true;
    }

    modifier onlyWhitelistedNFT(address nftAddress) {
        if (!_isWhitelistedNFT[nftAddress]) revert Only_Whitelisted_NFT();
        _;
    }

    modifier onlyWhitelistedDestination(uint64 destinationChain) {
        if (!_isWhitelistedDestination[destinationChain])
            revert Only_Whitelisted_Chain();
        _;
    }

    function whitelistNFT(address token, bool whitelist) external onlyOwner {
        _isWhitelistedNFT[token] = whitelist;
        emit WhitelistNFT(token, whitelist);
    }

    function whitelistDestinationChain(
        uint64 destinationChain,
        bool whitelist
    ) external onlyOwner {
        _isWhitelistedDestination[destinationChain] = whitelist;
        emit WhitelistDestinationChain(destinationChain, whitelist);
    }

    function isWhitelistedNFT(address token) external view returns (bool) {
        return _isWhitelistedNFT[token];
    }

    function isWhitelistedDestination(
        uint64 destinationChain
    ) external view returns (bool) {
        return _isWhitelistedDestination[destinationChain];
    }

    function getChainId() public view returns (uint64 chainId) {
        assembly {
            chainId := chainid()
        }
    }
}
