import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.21",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 0,
          },
        },
      },
    ],
  },

  networks: {
    hardhat: {
      forking: {
        url: "https://sepolia.gateway.tenderly.co",
        blockNumber: 5071093,
        // url: "https://sepolia-rollup.arbitrum.io/rpc",
      },
    },
    sepolia: {
      url: "https://sepolia.gateway.tenderly.co",
      accounts: [process.env.PVT_KEY as string],
    },
    arbisepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: [process.env.PVT_KEY as string],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY as string,
      arbisepolia: process.env.ETHERSCAN_API_KEY as string,
    },
    customChains: [
      {
        network: "arbisepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://sepolia-rollup.arbitrum.io/rpc",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
      {
        network: "arbigoerli",
        chainId: 421613,
        urls: {
          apiURL: "https://api-goerli.arbiscan.io/api",
          browserURL: "https://goerli.arbiscan.io/",
        },
      },
    ],
  },
};

export default config;
