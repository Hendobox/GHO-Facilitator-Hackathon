import { ethers } from "hardhat";

async function main() {
  const owner = "0x4B55a33ADBf7CC4ae3F6Bb991BcCbBF7CB681042";
  const usdcAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
  const atoken = "0x16dA4541aD1807f4443d92D26044C1147406EB80";
  const ghoToken = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60";
  const ccipRouterSepolia = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59";
  const receiverProtocol;

  // deploy mock crypto punk
  const nft = await ethers.deployContract("MockERC721", [
    "Mock Punk",
    "MPK",
    owner,
  ]);
  await nft.waitForDeployment();
  console.log(`NFT (Crypto Punk mock) deployed to ${nft.target}`);

  const protocol = await ethers.deployContract(
    "unHODL",
    [
      usdcAddress, // USDC
      ghoToken, // GHO
      atoken,
      owner, // whitelister admin
      ccipRouterSepolia, // CCIP router
      receiverProtocol,
      ethers.parseEther("3.478487238524512106"), // Arbitrum Sepolia destination selector
    ] // arbitrum-sepolia chain selector
  );
  await protocol.waitForDeployment();
  console.log(`unHODL deployed to ${protocol.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
