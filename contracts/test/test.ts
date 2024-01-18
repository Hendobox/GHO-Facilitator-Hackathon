import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import hre from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Lock", function () {
  let mockPunk, loanCore, usdc: any, usdcHolder: HardhatEthersSigner;
  before(async () => {
    // define get signers
    const [owner, user1, user2] = await ethers.getSigners();

    // deploy mock crypto punk
    const MockERC721 = await ethers.getContractFactory("MockERC721");
    mockPunk = await MockERC721.deploy("Mock Punk", "MPK", owner.address);

    // deployg protocol
    const LoanCore = await ethers.getContractFactory("LoanCore");
    const usdcAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";

    loanCore = await LoanCore.deploy(
      usdcAddress, // USDC
      "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60", // GHO
      owner.address, // whitelister admin
      "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", // CCIP router
      421614 // arbitrum-sepolia chainId
    );

    // impersonate USDC holder
    const holder = "0x7a6A027D3233d52DcE403A0Fb5E3277b659ab6F1";

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [holder],
    });

    usdcHolder = await ethers.getSigner(holder);

    // get USDC artifacts
    usdc = await ethers.getContractAt("IERC20", usdcAddress);
  });

  it("should properly supply", async () => {
    console.log("Holder balance: ", await usdc.balanceOf(usdcHolder.address));
  });

  // async function deployOneYearLockFixture() {
  //   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  //   const ONE_GWEI = 1_000_000_000;

  //   const lockedAmount = ONE_GWEI;
  //   const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  //   // Contracts are deployed using the first signer/account by default
  //   const [owner, otherAccount] = await ethers.getSigners();

  //   const Lock = await ethers.getContractFactory("Lock");
  //   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  //   return { lock, unlockTime, lockedAmount, owner, otherAccount };
  // }
});
