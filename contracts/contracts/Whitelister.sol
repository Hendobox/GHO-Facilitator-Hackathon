// SPDX-License-Identifier: MIT

pragma solidity 0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "./Errors.sol";
import "./interfaces/IWhitelister.sol";

contract Whitelister is AccessControlEnumerable, Ownable, IWhitelister {
    mapping(address => bool) _isWhitelistedNFT;

    constructor(address admin) Ownable(admin) {}

    modifier onlyWhitelistedNFT(address nftAddress) {
        if (!_isWhitelistedNFT[nftAddress]) revert Only_Whitelisted_NFT();
        _;
    }

    function whitelistNFT(address token, bool whitelist) external onlyOwner {
        _isWhitelistedNFT[token] = whitelist;
        emit WhitelistNFT(token, whitelist);
    }

    function isWhitelistedNFT(address token) external view returns (bool) {
        return _isWhitelistedNFT[token];
    }

    function getChainId() public view returns (uint64 chainId) {
        assembly {
            chainId := chainid()
        }
    }
}
