// SPDX-License-Identifier: MIT

pragma solidity 0.8.21;

interface IAssetVault {
    // ============= Enums ==============

    enum TokenType {
        ERC721,
        ERC1155
    }

    // ============= Events ==============

    event WithdrawEnabled(address operator);
    event WithdrawERC20(
        address indexed operator,
        address indexed token,
        address recipient,
        uint256 amount
    );
    event WithdrawERC721(
        address indexed operator,
        address indexed token,
        address recipient,
        uint256 tokenId
    );
    event WithdrawPunk(
        address indexed operator,
        address indexed token,
        address recipient,
        uint256 tokenId
    );
    event WithdrawSuperRareV1(
        address indexed operator,
        address indexed token,
        address recipient,
        uint256 tokenId
    );

    event WithdrawERC1155(
        address indexed operator,
        address indexed token,
        address recipient,
        uint256 tokenId,
        uint256 amount
    );

    event WithdrawETH(
        address indexed operator,
        address indexed recipient,
        uint256 amount
    );

    // ================ View Functions ================

    function withdrawEnabled() external view returns (bool);

    function whitelist() external view returns (address);

    // ================ Withdrawal Operations ================

    function enableWithdraw() external;

    function withdrawERC20(address token, address to) external;

    function withdrawERC721(
        address token,
        uint256 tokenId,
        address to
    ) external;

    function withdrawERC1155(
        address token,
        uint256 tokenId,
        address to
    ) external;

    function withdrawBatch(
        address[] calldata tokens,
        uint256[] calldata tokenIds,
        TokenType[] calldata tokenTypes,
        address to
    ) external;

    function withdrawETH(address to) external;
}
