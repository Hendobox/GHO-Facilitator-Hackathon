// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Chainlink {
    AggregatorV3Interface internal constant nftFloorPriceFeed =
        AggregatorV3Interface(0x5c13b249846540F81c093Bc342b5d963a7518145);

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        // prettier-ignore
        (
            /*uint80 roundID*/,
            int nftFloorPrice,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = nftFloorPriceFeed.latestRoundData();

        // since chainlind does not currently support Sepolia network
        // we are forced to use the aggregator address of Crypto Punk
        // deployed on Goerli. The same address also is deployed on sepolia
        // though it maps to a different market. we will just use it for
        // demo purposes and estimate a desired value
        // since we expect to convert to USDC which has 6 decimals, we multitply
        // the value by 10 to take it close to 5000 USD in the case of USDC for demo purposes

        return nftFloorPrice * 10;
    }
}
