import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
// import { networks } from "../hardhat.config";

describe("Lock", function () {
  let mockPunk, loanCore;
  before(async () => {
    // get addresses
    const [owner, user1, user2] = await ethers.getSigners();

    // deploy mock crypto punk
    const MockERC721 = await ethers.getContractFactory("MockERC721");
    mockPunk = await MockERC721.deploy("Mock Punk", "MPK", owner.address);

    // deployg protocol
    const LoanCore = await ethers.getContractFactory("LoanCore");
    loanCore = await LoanCore.deploy(
      "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", // USDC
      "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60", // GHO
      owner.address, // whitelister admin
      "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", // CCIP router
      421614 // arbitrum-sepolia chainId
    );
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
