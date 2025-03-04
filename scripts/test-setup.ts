import hre from "hardhat";

async function main() {
  // Get the test account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Testing with account:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy test contract
  const CipherPress = await hre.ethers.getContractFactory("CipherPress");
  const cipherPress = await CipherPress.deploy();
  await cipherPress.waitForDeployment();
  
  // Test publishing an article
  const tx = await cipherPress.publishArticle("test-cid");
  await tx.wait();
  console.log("✓ Test article published");
  
  // Test retrieving articles
  const cids = await cipherPress.getArticleCIDs();
  console.log("✓ Retrieved article CIDs:", cids);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 