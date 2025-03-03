const fs = require("fs");
require("dotenv").config();
const { ethers } = require("hardhat");


//chnage the contract adress whenever want to the trasaction

async function main() {
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your deployed contract address
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Hardhat RPC URL

    // Get signer (Use the first account from Hardhat node)
    // change it to the acount of the user get from metamask
    const signer = await provider.getSigner(0);

    // Load compiled contract ABI
    const contractJSON = JSON.parse(fs.readFileSync("./artifacts/contracts/Indexer.sol/Indexer.json", "utf8"));
    const contractABI = contractJSON.abi;

    // Connect to the deployed contract
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    // Publish a new news entry
    const tx = await contract.publishNews(
        "Qm1234567890abcdef", // Example IPFS CID
        "Breaking: Decentralized News is Live!" // News title
    );

    console.log("Transaction sent! Waiting for confirmation...");
    await tx.wait();
    console.log("News Published!");

    // Retrieve news count
    const newsCount = await contract.getNewsCount();
    console.log(`Total news published: ${newsCount}`);

    // Retrieve all news entries
    const allNews = await contract.getAllNews();

    // Format the output properly
    console.log("All News:");
    allNews.forEach((news, index) => {
        console.log(`${index + 1}. Title: ${news.title}, CID: ${news.cid}, Timestamp: ${news.timeStamp}`);
    });
}

// Execute script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(" Error:", error);
        process.exit(1);
    });
