// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {SavvyRiskManagementLib} from "./libraries/SavvyRiskManagementLib.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract CCIP_Receiver is Ownable, CCIPReceiver {
    using SafeERC20 for IERC20;
    address public gho;
    address public yieldToken;

    mapping(address => uint256) public shares;

    receive() external payable {}

    event MessageReceived(
        bytes32 indexed latestMessageId,
        uint256 amount,
        address indexed recipient
    );

    constructor(
        address router,
        address gho_,
        address yieldToken_
    ) CCIPReceiver(router) Ownable(msg.sender) {
        gho = gho_;
        yieldToken = yieldToken_;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (
            bytes4 functionSelector,
            uint256 amountOverCollateralized,
            uint256 userBal,
            address recipient
        ) = abi.decode(message.data, (bytes4, uint256, uint256, address));

        if (
            functionSelector ==
            bytes4(keccak256("callSavvySupply(uint256,uint256,address)"))
        ) {
            // Call the supplySavvy function with the decoded arguments
            _supplySavvy(amountOverCollateralized, userBal, recipient);
        } else {
            withdrawSavvy(amountOverCollateralized, recipient);
        }

        emit MessageReceived(
            message.messageId,
            amountOverCollateralized + userBal,
            recipient
        );
    }

    function _supplySavvy(
        uint256 amountOverCollateralized,
        uint256 userBal,
        address recipient
    ) private {
        uint256 amount = amountOverCollateralized + userBal;
        // create the approval to savvy pool
        IERC20(gho).approve(address(SavvyRiskManagementLib.savvyPool), amount);

        // supply GHO into Savvy
        uint256 share = SavvyRiskManagementLib.supplySavvyGHO(
            yieldToken,
            amount,
            address(this),
            0
        );
        __splitShare(amountOverCollateralized, userBal, share, recipient);
    }

    function __splitShare(
        uint256 platformAmount,
        uint256 userAmount,
        uint256 share,
        address recipeint
    ) private {
        uint256 platformShare = userAmount == 0
            ? share
            : (platformAmount * share) / (platformAmount + userAmount);

        uint256 userShare = share - platformShare;

        unchecked {
            shares[address(this)] += platformShare;
            if (userShare > 0) shares[recipeint] += userShare;
        }
    }

    function withdrawSavvy(uint256 amount, address recipient) public {
        uint256 amount = sharesToBaseTokens(recipient);

        if (amount > 0) {
            shares[recipient] = 0;

            SavvyRiskManagementLib.withdrawSavvyGHO(
                yieldToken,
                amount,
                recipient
            );
        }
    }

    function sharesToBaseTokens(
        address recipient
    ) public view returns (uint256) {
        return
            SavvyRiskManagementLib.convertSharesToBaseTokens(
                yieldToken,
                shares[recipient]
            );
    }

    // to recover assets from demo contract to final version
    function drain(address to) external onlyOwner {
        uint256 ghoBalance = IERC20(gho).balanceOf(address(this));
        uint256 ethBalance = address(this).balance;

        if (ghoBalance > 0) {
            IERC20(gho).safeTransfer(to, ghoBalance);
        }

        if (ethBalance > 0) {
            (bool success, ) = payable(to).call{value: ethBalance}("");
            require(success, "ETH sending failed");
        }
    }
}
