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
        (bytes4 functionSelector, uint256 amount, address recipient) = abi
            .decode(message.data, (bytes4, uint256, address));

        if (
            functionSelector ==
            bytes4(keccak256("callSavvySupply(uint256,address)"))
        ) {
            // Call the supplySavvy function with the decoded arguments
            callSupplySavvy(amount, recipient);
        } else {
            callWithdrawSavvy(amount, recipient);
        }

        emit MessageReceived(message.messageId, amount, recipient);
    }

    function callSupplySavvy(uint256 amount, address recipient) private {
        // create the approval to savvy pool
        IERC20(gho).approve(address(savvyPool), amount);

        // supply GHO into Savvy
        unchecked {
            shares[recipient] += supplySavvyGHO(
                yieldToken,
                amount,
                recipient,
                0
            );
        }
    }

    function callWithdrawSavvy(uint256 amount, address recipient) private {
        uint256 share = shares[recipient];

        if (share > 0) {
            withdrawSavvyGHO(address(this), address(this), amount, recipient);
        }
    }
}
