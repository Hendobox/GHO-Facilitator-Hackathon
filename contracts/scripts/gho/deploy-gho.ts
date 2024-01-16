const hre = require("hardhat");
const fs = require('fs');

async function deployGHOContract() {
    // Get the Contract Factory
    const GhoToken = await hre.ethers.getContractFactory("GhoToken");
    // Signers
    const [deployer] = await hre.ethers.getSigners();

    // Deploy the contract
    const ghoToken = await GhoToken.deploy(deployer.address);

    await ghoToken.waitForDeployment();

    console.log("GhoToken deployed to:", ghoToken.target);

    // Save the contract address to an environment variable
    fs.writeFileSync('.env.gho', `${ghoToken.target}\n`);
}

deployGHOContract()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
