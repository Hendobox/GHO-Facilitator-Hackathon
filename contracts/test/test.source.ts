import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Lock", function () {
  let tokenId: number = 1;
  let mockPunk: any,
    loanCore: any,
    usdc: any,
    aToken: any,
    gho: any,
    cCIP_Receiver: any,
    usdcHolder: HardhatEthersSigner,
    ghoHolder: HardhatEthersSigner,
    owner: HardhatEthersSigner,
    user1: HardhatEthersSigner,
    user2: HardhatEthersSigner;

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
    const ghoTokenArbSep = "0xb13Cfa6f8B2Eed2C37fB00fF0c1A59807C585810";
    const yieldToken = "0x6378A7A5f838C8919027F21498ae4683c3ce0346";
    const ccipRouterSepolia = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59";
    const ccipRouterArbitrumSepolia =
      "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165";

    const CCIP_Receiver = await ethers.getContractFactory("CCIP_Receiver");
    cCIP_Receiver = await CCIP_Receiver.deploy(
      ccipRouterArbitrumSepolia,
      ghoTokenArbSep,
      yieldToken
    );

    // Deploy libraries
    const ChainlinkDataLib = await ethers.getContractFactory(
      "ChainlinkDataLib"
    );
    const chainlinkDataLib = await ChainlinkDataLib.deploy();

    const AaveFacilitatorLib = await ethers.getContractFactory(
      "AaveFacilitatorLib"
    );
    const aaveFacilitatorLib = await AaveFacilitatorLib.deploy();

    // Deploy protocol
    const LoanCore = await ethers.getContractFactory("unHODL", {
      libraries: {
        ChainlinkDataLib: chainlinkDataLib.target,
        AaveFacilitatorLib: aaveFacilitatorLib.target,
      },
    });

    loanCore = await LoanCore.deploy(
      usdcAddress, // USDC
      ghoToken, // GHO
      atoken,
      owner.address, // whitelister admin
      ccipRouterSepolia, // CCIP router
      cCIP_Receiver.target,
      ethers.parseEther("3.478487238524512106") // arbitrum-sepolia chain selector
    );

    // impersonate USDC holder

    const holderusdc = "0x7a6A027D3233d52DcE403A0Fb5E3277b659ab6F1";
    usdcHolder = await ethers.getImpersonatedSigner(holderusdc);

    const holdergho = "0x3B4aCc1c831525550db2Cb71233C9262dF956b66";
    ghoHolder = await ethers.getImpersonatedSigner(holdergho);

    // get token artifacts

    usdc = await ethers.getContractAt("IERC20", usdcAddress);
    aToken = await ethers.getContractAt("IERC20", atoken);
    gho = await ethers.getContractAt("IGhoToken", ghoToken);

    // fund the treasury

    await usdc.connect(usdcHolder).transfer(owner.address, 10000000000);
    await usdc.approve(loanCore.target, 10000000000);
    await loanCore.demo_purpose_addUsdcToTreasury(10000000000);

    await usdcHolder.sendTransaction({
      to: holdergho,
      value: ethers.parseEther("1"),
    });

    console.log("GHObalance: ", await gho.balanceOf(holdergho));

    await gho
      .connect(ghoHolder)
      .transfer(owner.address, ethers.parseEther("3000"));
    await gho.approve(loanCore.target, ethers.parseEther("3000"));
    await loanCore.demo_purpose_addGhoToTreasury(ethers.parseEther("3000"));

    // fund contract for CCIP fees

    await usdcHolder.sendTransaction({
      to: loanCore.target,
      value: ethers.parseEther("10"),
    });
  });

  it("should properly supply a whitelisted NFT via Aave", async () => {
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

    const price = await loanCore.getLatestPrice();
    const maxBorrowable = await loanCore.calculateCollateralValue(price, true);
    const loanData: LoanData = {
      entryPrice: price,
      balance: terms.principal,
      allowance: maxBorrowable - terms.principal,
    };
    const data = await loanCore.getLoan(0);
    expect(data[0]).to.equal(1);
    expect(data[3]).to.equal(loanData.entryPrice);
    expect(data[4]).to.equal(loanData.balance);
    expect(data[6]).to.equal(loanData.allowance);
    expect(data[7].collateralAddress).to.equal(terms.collateralAddress);
    expect(data[8]).to.equal(user1.address);
    expect(Number(await gho.balanceOf(user1.address))).to.equal(
      loanData.balance
    );
  });

  it("should properly supply a whitelisted NFT natives", async () => {
    // mint cryptopunk to user2's wallet
    tokenId = 2;
    await mockPunk.mint(user2.address, tokenId);
    expect(await mockPunk.ownerOf(tokenId)).to.equal(user2.address);
    expect(await mockPunk.balanceOf(user2.address)).to.equal(1);

    // create loan term
    const terms: LoanTerms = {
      collateralAddress: mockPunk.target,
      collateralId: tokenId,
      principal: ethers.parseUnits("2500", 6),
      facilitator: 0, // native route
    };
    // set approval
    await mockPunk.connect(user2).approve(loanCore.target, tokenId);

    // start loan
    await loanCore.connect(user2).startLoan(terms);

    expect(await mockPunk.ownerOf(tokenId)).to.equal(loanCore.target);
    expect(await mockPunk.balanceOf(user2.address)).to.equal(0);
    expect(await mockPunk.balanceOf(loanCore.target)).to.equal(2);
    expect(await loanCore.loanIdTracker()).to.equal(2);

    const price = await loanCore.getLatestPrice();
    const maxBorrowable = await loanCore.calculateCollateralValue(price, true);

    const loanData: LoanData = {
      entryPrice: price,
      balance: terms.principal,
      allowance: maxBorrowable - terms.principal,
    };
    const data = await loanCore.getLoan(1);
    expect(data[0]).to.equal(1);
    expect(data[3]).to.equal(loanData.entryPrice);
    expect(data[4]).to.equal(loanData.balance);
    expect(data[6]).to.equal(loanData.allowance);
    expect(data[7].collateralAddress).to.equal(terms.collateralAddress);
    expect(data[8]).to.equal(user2.address);
    expect(Number(await gho.balanceOf(user2.address))).to.equal(
      loanData.balance
    );
  });

  it("should properly partly repay Aave lend", async () => {
    // fail if inactive debt
    await expect(
      loanCore.connect(user1).repayDebt(19, 1000)
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

    // increment time by 1 month
    await time.increase(86400 * 30);

    const interest = await loanCore.calculateInterest(0);

    console.log("interest: ", interest); // 20547968n

    // fail if exceeds debt + interest
    await expect(
      loanCore.connect(user1).repayDebt(0, ethers.parseUnits("2520.6", 6))
    ).to.revertedWithCustomError(loanCore, "Exceeds_Balance");

    let data = await loanCore.getLoan(0);

    // create approval
    await gho
      .connect(user1)
      .approve(loanCore.target, ethers.parseEther("100000"));

    // repay for real
    await loanCore.connect(user1).repayDebt(0, data[4]);

    data = await loanCore.getLoan(0);
  });

  it("should properly fully repay native lend", async () => {
    // increment time by 1 month
    // await time.increase(86400 * 10);

    let data = await loanCore.getLoan(0);

    // top up user2's GHO for complete repayment with interest
    await gho
      .connect(ghoHolder)
      .transfer(user1.address, ethers.parseEther("500"));

    const interest = await loanCore.calculateInterest(0);
    // repay for real
    await loanCore.connect(user1).repayDebt(0, Number(data[4] + interest));

    data = await loanCore.getLoan(0);

    expect(await mockPunk.ownerOf(1)).to.equal(user1.address);
    expect(data[4]).to.equal(0);
  });
});
