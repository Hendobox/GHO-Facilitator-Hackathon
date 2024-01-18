import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
const Big = require("big.js");
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { int } from "hardhat/internal/core/params/argumentTypes";
import { parseEther } from "ethers";

describe("Lock", function () {
  let tokenId: number = 1;
  let mockPunk: any,
    loanCore: any,
    usdc: any,
    aToken: any,
    gho: any,
    riskManagementReceiver: any,
    usdcHolder: HardhatEthersSigner,
    owner: HardhatEthersSigner,
    user1: HardhatEthersSigner,
    user2: HardhatEthersSigner;

  before(async () => {
    // define get signers
    [owner, user1, user2] = await ethers.getSigners();

    // deploy mock crypto punk
    const MockERC721 = await ethers.getContractFactory("MockERC721");
    mockPunk = await MockERC721.deploy("Mock Punk", "MPK", owner.address);

    // deploy protocol
    const usdcAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
    const atoken = "0x16dA4541aD1807f4443d92D26044C1147406EB80";
    const ghoToken = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60";
    const ccipRouterSepolia = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59";
    const ccipRouterArbitrumSepolia =
      "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165";

    const RiskManagementReceiver = await ethers.getContractFactory(
      "RiskManagementReceiver"
    );
    riskManagementReceiver = await RiskManagementReceiver.deploy(
      ccipRouterArbitrumSepolia
    );

    const LoanCore = await ethers.getContractFactory("LoanCore");
    loanCore = await LoanCore.deploy(
      usdcAddress, // USDC
      ghoToken, // GHO
      atoken,
      owner.address, // whitelister admin
      ccipRouterSepolia, // CCIP router
      riskManagementReceiver.target,
      ethers.parseEther("3.478487238524512106") // arbitrum-sepolia chain selector
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
    aToken = await ethers.getContractAt("IERC20", atoken);
    gho = await ethers.getContractAt("IGhoToken", ghoToken);

    // fund the treasury

    await usdc.connect(usdcHolder).transfer(loanCore.target, 10000000000);

    // fund contract for CCIP fees

    await usdcHolder.sendTransaction({
      to: loanCore.target,
      value: ethers.parseEther("10"),
    });
  });

  it("should properly supply a whitelisted NFT", async () => {
    expect(await usdc.balanceOf(loanCore.target)).to.equal(
      ethers.parseUnits("10000", 6)
    );

    // whiteliset NFT

    await loanCore.whitelistNFT(mockPunk.target, true);

    // mint cryptopunk to user1's wallet

    await mockPunk.mint(user1.address, tokenId);
    expect(await mockPunk.ownerOf(tokenId)).to.equal(user1.address);
    expect(await mockPunk.balanceOf(user1.address)).to.equal(1);

    // create loan term

    interface Facilitator {
      // If using the native facilitator
      Native: number;
      // If using the AaveV3 facilitator
      AaveV3: number;
    }

    interface LoanTerms {
      collateralAddress: string;
      collateralId: number;
      principal: number | bigint;
      facilitator: number;
    }

    const terms: LoanTerms = {
      collateralAddress: mockPunk.target,
      collateralId: tokenId,
      principal: ethers.parseUnits("1000000", 6),
      facilitator: 1, // aave route
    };

    // set approval
    await mockPunk.connect(user1).approve(loanCore.target, tokenId);

    // test fail if principal above treshhold
    await expect(
      loanCore.connect(user1).startLoan(terms)
    ).to.be.revertedWithCustomError(loanCore, "Exceeds_Maximum_Borrowable");

    // change principal to viable
    terms.principal = ethers.parseUnits("2500", 6);

    // start loan
    await loanCore.connect(user1).startLoan(terms);

    expect(await mockPunk.ownerOf(tokenId)).to.equal(loanCore.target);
    expect(await mockPunk.balanceOf(user1.address)).to.equal(0);
    expect(await mockPunk.balanceOf(loanCore.target)).to.equal(1);
    expect(await loanCore.loanIdTracker()).to.equal(1);

    interface LoanData {
      state: number;
      startDate: number | bigint;
      lastAccrualTimestamp: number | bigint;
      entryPrice: number | bigint;
      balance: number | bigint;
      interestAmountPaid: number | bigint;
      allowance: number | bigint;
      terms: LoanTerms;
      owner: string;
    }

    const price = await loanCore.getLatestPrice();
    const maxBorrowable = await loanCore.calculateCollateralValue(price);

    const loanData: LoanData = {
      entryPrice: price,
      balance: terms.principal,
      allowance: maxBorrowable - terms.principal,
    };

    const data = await loanCore.loans(0);

    expect(data[0]).to.equal(1);
    expect(data[3]).to.equal(loanData.entryPrice);
    expect(data[4]).to.equal(loanData.balance);
    expect(data[6]).to.equal(loanData.allowance);
    expect(data[7].collateralAddress).to.equal(terms.collateralAddress);
    expect(data[8]).to.equal(user1.address);
    expect(Number(await gho.balanceOf(loanCore.target))).to.equal(
      loanData.allowance
    );
    expect(Number(await gho.balanceOf(user1.address))).to.equal(
      loanData.balance
    );
  });

  it("should properly repay", async () => {
    // fail if inactive debt
    await expect(
      loanCore.connect(user1).repayDebt(1, 1000)
    ).to.revertedWithCustomError(loanCore, "Invalid_State");

    // fail if zero amount
    await expect(
      loanCore.connect(user1).repayDebt(0, 0)
    ).to.revertedWithCustomError(loanCore, "Zero_Amount");

    // fail if unauthorized
    await expect(loanCore.repayDebt(0, 1000)).to.revertedWithCustomError(
      loanCore,
      "Unauthorized"
    );

    // fail increment time by 1 month
    await time.increase(86400 * 30);

    const interest = await loanCore.calculateInterest(0);

    console.log("interest: ", interest); // 20547968n

    // fail if exceeds debt + interest
    await expect(
      loanCore.connect(user1).repayDebt(0, ethers.parseUnits("2520.6", 6))
    ).to.revertedWithCustomError(loanCore, "Exceeds_Balance");

    let data = await loanCore.loans(0);

    // create approval
    await gho
      .connect(user1)
      .approve(loanCore.target, ethers.parseEther("100000"));

    // repay for real
    await loanCore.connect(user1).repayDebt(0, data[4]);

    data = await loanCore.loans(0);
  });
});
