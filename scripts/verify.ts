import { run } from "hardhat";

async function main() {
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

  console.log("Verifying contract on Mumbai...");
  
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
      network: "mumbai"
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 