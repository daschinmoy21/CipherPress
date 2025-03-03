const { ethers } = require("hardhat");

async function main() {
    // Get contract factory
    const Index = await ethers.getContractFactory("Indexer");

    console.log("Deploying contract...");
    
    // Deploy contract
    const index = await Index.deploy();
    
    await index.waitForDeployment(); // Ensure deployment is complete

    // Get deployed contract address
    const contractAddress = await index.getAddress();
    
    console.log(`Contract deployed at: ${contractAddress}`);
}

// Execute script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
