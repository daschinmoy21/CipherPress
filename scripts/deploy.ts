import { ethers } from "hardhat";
import fs from 'fs';
import path from 'path';

async function main() {
  console.log("Deploying CipherPress contract...");

  const CipherPress = await ethers.getContractFactory("CipherPress");
  const cipherPress = await CipherPress.deploy();
  await cipherPress.waitForDeployment();
  
  const address = await cipherPress.getAddress();
  console.log("CipherPress deployed to:", address);

  // Save deployment info
  const deploymentInfo = {
    address,
    abi: JSON.parse(CipherPress.interface.formatJson())
  };

  // Save to file
  fs.writeFileSync(
    path.join(__dirname, '../src/contracts/CipherPress.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to src/contracts/CipherPress.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 