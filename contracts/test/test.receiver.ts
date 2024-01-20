import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Lock", function () {
  let gho: any,
    cCIP_Receiver: any,
    owner: HardhatEthersSigner,
    user1: HardhatEthersSigner,
    user2: HardhatEthersSigner;

  before(async () => {
    // define get signers
    [owner, user1, user2] = await ethers.getSigners();

    // deploy protocol
    const ghoTokenArbSep = "0xb13Cfa6f8B2Eed2C37fB00fF0c1A59807C585810";
    const yieldToken = "0x6378A7A5f838C8919027F21498ae4683c3ce0346";
    const ccipRouterArbitrumSepolia =
      "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165";

    const CCIP_Receiver = await ethers.getContractFactory("CCIP_Receiver");

    cCIP_Receiver = await CCIP_Receiver.deploy(
      ccipRouterArbitrumSepolia,
      ghoTokenArbSep,
      yieldToken
    );

    gho = await ethers.getContractAt("IGhoToken", ghoTokenArbSep);

    const ethHolder: any = await ethers.getImpersonatedSigner(
      "0x7103caAbb5c7484b59993594AF5774E88CAa8aC5"
    );

    const ghoHolder: any = await ethers.getImpersonatedSigner(
      "0x44f751ead3d88b04a57c298789fcc26632e8179b"
    );

    await ethHolder.sendTransaction({
      to: ghoHolder.address,
      value: ethers.parseEther("1"),
    });

    // fund contract
    await gho
      .connect(ghoHolder)
      .transfer(cCIP_Receiver.target, ethers.parseEther("150"));
  });

  const grantApproval = async (address: string, contract: any) => {
    const signer = await ethers.getImpersonatedSigner(
      "0x8Ae946a8580A9cc179660A7FCFd0cF6524a63D83"
    );

    await contract.connect(signer).add(address);
  };

  it("should deposit savvy", async () => {
    let savvyPM: any = await ethers.getContractAt(
      "ISavvyPositionManager",
      "0x919A30947599eCD2c4A93E389277085D559D91A5"
    );
    await grantApproval(cCIP_Receiver.target, savvyPM);
    await cCIP_Receiver.testSavvyDeposit(
      ethers.parseEther("90"),
      ethers.parseEther("10"),
      user1.address
    );

    const ghoPoolKey: string = "0x6378A7A5f838C8919027F21498ae4683c3ce0346";

    savvyPM = await ethers.getContractAt(
      "ISavvyPositionManager",
      "0x32C66f13C282212193C37dD7643C9EfFb303A83d"
    );

    console.log(
      "user's position: ",
      await savvyPM.positions(user1.address, ghoPoolKey)
    );
    console.log(
      "protocol's posision: ",
      await savvyPM.positions(cCIP_Receiver.target, ghoPoolKey)
    );

    console.log(
      "shares protocol: ",
      await cCIP_Receiver.shares(cCIP_Receiver.target)
    );

    console.log("shares user: ", await cCIP_Receiver.shares(user1.address));

    await cCIP_Receiver.testSavvyWithdraw(user1.address);
  });
});
