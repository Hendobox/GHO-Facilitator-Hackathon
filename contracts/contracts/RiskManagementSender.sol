// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract RiskManagementSender {
    address immutable i_router;
    uint64 immutable destinationChainSelector;

    event MessageSent(bytes32 messageId);

    constructor(address router, uint64 _destinationChainSelector) {
        i_router = router;
        destinationChainSelector = _destinationChainSelector;
    }

    receive() external payable {}

    function supplySavvyCCIP(
        address receiver,
        uint256 amountOverCollateralized,
        uint256 userBal,
        address recipient
    ) public {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encodeWithSignature(
                "callSavvySupply(uint256,uint256,address)",
                amountOverCollateralized,
                userBal,
                recipient
            ),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0) // native payment
        });

        uint256 fee = IRouterClient(i_router).getFee(
            destinationChainSelector,
            message
        );

        bytes32 messageId = IRouterClient(i_router).ccipSend{value: fee}(
            destinationChainSelector,
            message
        );

        emit MessageSent(messageId);
    }

    function withdrawSavvyCCIP(
        address receiver,
        address recipient,
        uint256 amountOverCollateralized
    ) external {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encodeWithSignature(
                "callWithdrawSavvy(uint256,address)",
                amountOverCollateralized,
                recipient
            ),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });

        uint256 fee = IRouterClient(i_router).getFee(
            destinationChainSelector,
            message
        );

        bytes32 messageId = IRouterClient(i_router).ccipSend{value: fee}(
            destinationChainSelector,
            message
        );

        emit MessageSent(messageId);
    }
}
