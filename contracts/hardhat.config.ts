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
        url: "https://sepolia.gateway.tenderly.co	",
        blockNumber: 5083329,
      },
      chainId: 11155111,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/CvGnxp1M23ddg9DSf9ZwNSIXXqPzS52E",
      accounts: [process.env.PVT_KEY as string],
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/CvGnxp1M23ddg9DSf9ZwNSIXXqPzS52E",
      accounts: [process.env.PVT_KEY as string],
    },
    arbisepolia: {
      url: "https://arb-sepolia.g.alchemy.com/v2/mjXgVMd5C1IQaZYRMOv_tCC6GqwPMRkx",
      accounts: [process.env.PVT_KEY as string],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY as string,
      goerli: process.env.ETHERSCAN_API_KEY as string,
      arbisepolia: process.env.ETHERSCAN_API_KEY as string,
    },
    customChains: [
      {
        network: "arbisepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
    ],
  },
};

export default config;
