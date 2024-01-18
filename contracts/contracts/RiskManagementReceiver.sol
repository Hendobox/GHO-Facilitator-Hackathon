// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Facilitator} from "./Facilitator.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract RiskManagementReceiver is Facilitator, CCIPReceiver {
    mapping(address => uint256) public shares;
    address public gho;
    address public yieldToken;

    event MessageReceived(
        bytes32 indexed latestMessageId,
        uint256 amount,
        address indexed recipient
    );

    constructor(address router) CCIPReceiver(router) {}

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
            callSupplySavvy(amountOverCollateralized, userBal, recipient);
        } else {
            callWithdrawSavvy(amountOverCollateralized, recipient);
        }

        emit MessageReceived(
            message.messageId,
            amountOverCollateralized + userBal,
            recipient
        );
    }

    function callSupplySavvy(
        uint256 amountOverCollateralized,
        uint256 userBal,
        address recipient
    ) private {
        uint256 amount = amountOverCollateralized + userBal;
        // create the approval to savvy pool
        IERC20(gho).approve(address(savvyPool), amount);

        // supply GHO into Savvy
        uint256 share = supplySavvyGHO(yieldToken, amount, recipient, 0);
        _splitShare(amountOverCollateralized, userBal, share, recipient);
    }

    function _splitShare(
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

    function callWithdrawSavvy(uint256 amount, address recipient) private {
        uint256 share = shares[recipient];

        if (share > 0) {
            withdrawSavvyGHO(address(this), address(this), amount, recipient);
        }
    }
}
