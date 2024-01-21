import { ethers } from "hardhat";

async function main() {
  const owner = "0x4B55a33ADBf7CC4ae3F6Bb991BcCbBF7CB681042";
  const usdcAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
  const atoken = "0x16dA4541aD1807f4443d92D26044C1147406EB80";
  const ghoToken = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60";
  const ccipRouterSepolia = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59";
  const receiverProtocol = "0x74b72f7acfdca6ce410fbf839b970749c23c5381";

  // // deploy mock crypto punk
  // const nft = await ethers.deployContract("MockERC721", [
  //   "Mock Punk",
  //   "MPK",
  //   owner,
  // ]);
  // await nft.waitForDeployment();
  // console.log(`NFT (Crypto Punk mock) deployed to ${nft.target}`);

  // Deploy libraries
  // const ChainlinkDataLib = await ethers.getContractFactory("ChainlinkDataLib");
  // const chainlinkDataLib = await ChainlinkDataLib.deploy({
  //   gasPrice: ethers.parseUnits("62", "gwei"),
  // });
  // console.log(`chainlinkDataLib deployed to ${chainlinkDataLib.target}`);

  // const AaveFacilitatorLib = await ethers.getContractFactory(
  //   "AaveFacilitatorLib"
  // );
  // const aaveFacilitatorLib = await AaveFacilitatorLib.deploy({
  //   gasPrice: ethers.parseUnits("63", "gwei"),
  // });
  // console.log(`aaveFacilitatorLib deployed to ${aaveFacilitatorLib.target}`);

  // Deploy protocol

  const protocol = await ethers.deployContract(
    "unHODL",
    [
      usdcAddress, // USDC
      ghoToken, // GHO
      atoken,
      owner, // whitelister admin
      ccipRouterSepolia, // CCIP router
      receiverProtocol,
      ethers.parseEther("3.478487238524512106"), // Arbitrum Sepolia destination selector 3478487238524512106
    ], // arbitrum-sepolia chain selector
    {
      libraries: {
        ChainlinkDataLib: "0x74B72F7aCFDCa6ce410FBf839b970749C23c5381",
        AaveFacilitatorLib: "0xb62515640d02c6f82EE13B8CB262c45708aa60D5",
      },
    }
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

// NFT (Crypto Punk mock) deployed to 0x8c427C56790f2C36664870a55B3A0189bFf9996d
// unHODL deployed to 0x0Ca73475715E42C559714F10274CadAacA3124A2
