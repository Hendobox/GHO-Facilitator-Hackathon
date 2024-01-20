import { ethers } from "hardhat";

async function main() {
  const ccipRouterArbitrumSepolia =
    "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165";
  const ghoTokenArbSep = "0xb13Cfa6f8B2Eed2C37fB00fF0c1A59807C585810";
  const yieldToken = "0x6378A7A5f838C8919027F21498ae4683c3ce0346";

  const unHODLReceiver = await ethers.deployContract("CCIP_Receiver", [
    ccipRouterArbitrumSepolia,
    ghoTokenArbSep,
    yieldToken,
  ]);
  await unHODLReceiver.waitForDeployment();
  console.log(`unHODL Receiver deployed to ${unHODLReceiver.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0x238C700e008CC4A8Bf5D2c6B1257879d563Ba71e

// npx hardhat verify --network arbisepolia 0x238C700e008CC4A8Bf5D2c6B1257879d563Ba71e 0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165 0xb13Cfa6f8B2Eed2C37fB00fF0c1A59807C585810 0x6378A7A5f838C8919027F21498ae4683c3ce0346
