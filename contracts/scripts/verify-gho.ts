const fss = require('fs');

async function verifyGHOContract() {
    // Get the contract address from the .env.gho file
    const contractAddress = fss.readFileSync('.env.gho', 'utf8').trim();
    if (!contractAddress) {
        console.error("Please deploy the contract first.");
        process.exit(1);
    }

    // Signers
    const [deployer] = await hre.ethers.getSigners();

    // Verify the contract
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [deployer.address],
        });
        console.log(`Verified GhoToken at ${contractAddress}`);
    } catch (error) {
        console.error("Contract verification failed:", error);
    }
}

verifyGHOContract()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
