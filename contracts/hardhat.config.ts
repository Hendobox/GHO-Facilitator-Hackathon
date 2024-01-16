require('dotenv').config({ path: __dirname + '/.env' })
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PVT_KEY: string = process.env.PVT_KEY ?? ""
const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API ?? ""
const ARBISCAN_API_KEY: string = process.env.ARBISCAN_API ?? ""

const config: HardhatUserConfig = {
  solidity: "0.8.21",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/CvGnxp1M23ddg9DSf9ZwNSIXXqPzS52E",
      accounts: [PVT_KEY]
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/CvGnxp1M23ddg9DSf9ZwNSIXXqPzS52E",
      accounts: [PVT_KEY],
    },
    arbisepolia: {
      url: "https://arb-sepolia.g.alchemy.com/v2/mjXgVMd5C1IQaZYRMOv_tCC6GqwPMRkx",
      accounts: [PVT_KEY]
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      arbisepolia: ARBISCAN_API_KEY,
    },
    customChains: [
      {
        network: "arbisepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/"
        }
      }
    ],
  }
};

export default config;
