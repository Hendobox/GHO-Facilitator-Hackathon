import { ethers } from "hardhat";
const fs = require('fs');

async function addFacilitator(ghoTokenAddress: string, facilitatorAddress: string, facilitatorLabel: string, bucketCapacity: bigint) {

    // Signers
    const [deployer] = await hre.ethers.getSigners();

    // Get the Contract Factory
    const GhoToken = await ethers.getContractFactory("GhoToken");

    // Attach to existing contract
    const ghoToken = GhoToken.attach(ghoTokenAddress);

    // Add deployer as Facilitator Manager
    const fctx = await ghoToken.getFunction("grantRole").send(ethers.keccak256(ethers.toUtf8Bytes("FACILITATOR_MANAGER_ROLE")), deployer.address);

    // Wait for the transaction
    const fcreceipt = await fctx.wait();

    console.log(fcreceipt ? `Facilitator Manager role added. Transaction hash: ${fcreceipt.hash}` : "Null FcTxn Receipt");

    // Call the addFacilitator method
    const tx = await ghoToken.getFunction("addFacilitator").send(facilitatorAddress, facilitatorLabel, bucketCapacity);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log(receipt ? `Facilitator added. Transaction hash: ${receipt.hash}` : "Null Txn Receipt");
}


const facilitatorAddress = "0x0ff8BA5d8208F17fFC334B6a6EB08D7D7137e7b4"
const facilitatorName = "Test LFGHO"
const bucketCapacity = 100000000000000000000n

// Get the gho contract address from the .env.gho file
const ghoContractAddress = fs.readFileSync('.env.gho', 'utf8').trim();
if (!ghoContractAddress) {
    console.error("Please deploy the contract first.");
    process.exit(1);
}

addFacilitator(ghoContractAddress, facilitatorAddress, facilitatorName, bucketCapacity)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
