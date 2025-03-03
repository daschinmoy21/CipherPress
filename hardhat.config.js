require("@nomicfoundation/hardhat-toolbox");
const { task } = require("hardhat/config");

// Custom task to list accounts with their balances
task("accounts", "Prints all accounts with their ETH balance", async (_, hre) => {
    const ethers = hre.ethers;
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        const balance = await ethers.provider.getBalance(account.address);
        console.log(`Address: ${account.address} | Balance: ${ethers.formatEther(balance)} ETH`);
    }
});

module.exports = {
    solidity: "0.8.28",
    networks: {
        hardhat: {
            chainId: 1337,
        },
    },
};
