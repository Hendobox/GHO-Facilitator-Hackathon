// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockERC721 is ERC721Enumerable, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        address owner_
    ) ERC721(name, symbol) Ownable(owner_) {}

    // Mint new tokens
    function mint(address to, uint256 tokenId) external onlyOwner {
        _safeMint(to, tokenId);
    }
}
