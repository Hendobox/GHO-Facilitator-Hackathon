# Cross-Chain NFT Lending for GHO with Chainlink CCIP Integration

## Overview

Welcome to our GitHub repository for the hackathon project aiming to become a GHO facilitator. In this project, we focus on enabling cross-chain lending of whitelisted NFTs to mint GHO, a stablecoin created by the Aave protocol and collateralized by various assets. To achieve this, we leverage Chainlink's Cross-Chain Interoperability Protocol for seamless communication between different blockchain networks.

## Table of Contents

- [Project Title: Cross-Chain NFT Lending for GHO with Chainlink Integration](#project-title-cross-chain-nft-lending-for-gho-with-chainlink-integration)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Integration with Aave Protocol](#integration-with-aave-protocol)
  - [Integration with Chainlink](#integration-with-chainlink)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/)
- [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started)
- [Chainlink Node](https://docs.chain.link/docs/running-a-chainlink-node)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Hendobox/GHO-Facilitator-Hackathon.git
   cd gho-cross-chain-lending
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Project Structure

Describes the project structure briefly. Highlight important directories and files.

## Features

- Cross-chain lending of whitelisted NFTs.
- Minting GHO stablecoin on the desired blockchain.
- Secondary Investment to maximize yield and manage risk
- Open liquidation for liquidators to participate.

## Architecture

## Architecture

Our project's architecture is designed to facilitate cross-chain lending of whitelisted NFTs and minting GHO stablecoins using Aave protocol, with the integration of Chainlink's Cross Chain Interoperability Protocol (CCIP). Below are the key components and their interactions:

### Needed Contracts:

1. **Mock NFT**
   - Simulates a whitelisted NFT contract for testing purposes.

2. **Mock ERC20 token(s) - (USDC and/or GHO)**
   - Mock implementation of ERC20 tokens, such as USDC and GHO, used for collateralization and minting.

3. **Lending Protocol**
   - Main contract responsible for managing the borrowing, repayment, and claiming processes.

## Integration with Aave Protocol

Our project seamlessly integrates with the Aave protocol for collateralization, ensuring a secure and reliable lending process. The integration involves utilizing Aave's lending and borrowing functionalities to lock collateral and mint GHO stablecoins. 

## Integration with Savvy DeFi

Our integration with Savvy DeFi introduces a unique dimension to our project, combining NFT collateralization with decentralized finance opportunities. Users lock their NFTs in our vault as collateral, enabling them to generate the maximum possible GHO within the collateral ratio. As borrowers are typically over-collateralized, we leverage this excess collateral to provide an avenue for borrowing svUSD from Savvy DeFi. This innovative approach not only enhances risk management for borrowers but also introduces a revenue model through incentives. By connecting our project with Savvy DeFi, we aim to create a symbiotic relationship that empowers users with additional financial opportunities while maintaining the security and integrity of our cross-chain NFT lending platform.

## Integration with Chainlink

Our integration with Chainlink forms a crucial part of our project, enhancing cross-chain interoperability and ensuring seamless communication between different blockchain networks. Leveraging Chainlink's Cross Chain Interoperability Protocol (CCIP), our Protocol Contract facilitates the secure and transparent movement of data and assets across supported chains. This integration enables borrowers to initiate transactions from any chain, ensuring a decentralized and inclusive lending experience. Chainlink's robust infrastructure enhances the overall reliability of our cross-chain NFT lending solution, providing users with a trustworthy and scalable platform.

## Usage

To make the most of our cross-chain NFT lending platform, follow these steps:

1. 2. Head over to [Installation](#installation).

3. **Configure Environment:**
   - Set up the necessary environment variables, including API keys and blockchain node endpoints, in the configuration files. Refer to the provided examples or documentation for guidance.

4. **Deploy Smart Contracts:**
   - Deploy the required smart contracts, including the Mock NFT contract and the Protocol Contract, using tools like Hardhat. Follow the deployment script and instructions in the repository.

5. **Interact with the Platform:**
   - Utilize the Protocol Contract's functions for borrowing, repaying, and claiming. For example, use the `_BorrowGHO` function to initiate a loan by providing the NFT details, borrowing amount, and destination chain. Monitor the loan status using the `GetDebt` read method.

6. **Explore Savvy DeFi Integration:**
   - If interested in the Savvy DeFi integration, ensure you have set up an account with Savvy and configure the necessary parameters in your environment. The excess collateral sent to Savvy can be managed through the Protocol Contract.

7. **Contribute and Customize:**
   - Feel free to contribute to the project or customize it to suit your specific needs. Refer to the contribution guidelines in the repository for details on how to contribute effectively.

8. **Stay Informed:**
   - Keep an eye on our repository for updates, enhancements, and additional features. Stay connected with our community for discussions and support.

By following these steps, you'll be able to seamlessly interact with our cross-chain NFT lending platform, explore innovative borrowing opportunities, and contribute to the decentralized finance ecosystem. Happy lending!

## Contributing

We welcome contributions from the community! Check out our [Contribution Guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to Aave, Savvy, and Chainlink for their powerful protocols.
- Shoutout to the open-source community for their valuable contributions.

Feel free to reach out to us for any questions or collaborations! Happy hacking!
