# CipherPress

A decentralized news platform built with React, IPFS, and Ethereum. Articles are stored on IPFS and indexed on the blockchain, creating a censorship-resistant news platform.

## Features

- Decentralized content storage using IPFS (Helia)
- On-chain article indexing using Ethereum
- Web3 authentication with MetaMask
- Local caching for fast development
- Tag-based article organization
- Hacker News-inspired minimalist UI
- Terminal-inspired theme

## Tech Stack

- Frontend: React + TypeScript + Vite
- Smart Contracts: Solidity + Hardhat
- Storage: IPFS (Helia)
- Blockchain: Ethereum (Local/Sepolia/Mainnet)
- Web3: ethers.js + MetaMask

## UI Features

- Clean, minimalist article listing
- Numbered entries like Hacker News
- Full-screen article view
- Tag system for categorization
- Terminal-inspired dark theme
- Responsive design

## Getting Started

### Prerequisites

- Node.js 16+
- MetaMask browser extension
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cipherpress.git
   cd cipherpress
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment files:
   ```bash
   cp .env.example .env
   cp .env.example .env.development
   ```

4. Update environment variables in `.env`:
   ```env
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_RPC_URL=your_rpc_url
   ETHERSCAN_API_KEY=your_api_key
   ```

### Local Development and Testing

1. Start a local Hardhat blockchain:
   ```bash
   npm run node
   ```

2. Deploy the contract:
   ```bash
   npm run deploy:local
   ```

3. Configure MetaMask:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

4. Start the development server:
   ```bash
   npm run dev
   ```

### Testing the Application

1. **Connect Your Wallet**:
   - Click the profile icon in the top right
   - Connect with MetaMask
   - Ensure you're on the Hardhat Local network

2. **Create an Article**:
   - Click the upload icon in the header
   - Fill in the title and content
   - Add some tags (press Enter after each tag)
   - Click "Publish to IPFS"
   - Confirm the transaction in MetaMask

3. **View Articles**:
   - Return to the feed (click CipherPress logo)
   - Your article should appear at the top
   - Click the title to view full article
   - Articles are numbered like Hacker News

4. **Run Tests**:
   ```bash
   # Start local blockchain
   npm run node

   # Deploy contract (in new terminal)
   npm run deploy:local
   
   # Run contract tests
   npm run test:contract
   
   # Test IPFS integration
   npm run test:ipfs
   
   # Run full integration test
   npm run test:all
   ```

5. **Contract Testing Details**:
   - Tests contract deployment
   - Validates article publishing
   - Checks title and CID requirements
   - Verifies article retrieval
   - Tests pagination functionality

6. **Manual Testing**:
   ```javascript
   // In browser console
   // Get total articles
   const count = await contract.getNewsCount();
   console.log('Total articles:', count.toString());
   
   // Get latest 5 articles
   const latest = await contract.getLatestArticles(5);
   console.log('Latest articles:', latest);
   ```

### Troubleshooting

If you encounter CORS errors or issues with article loading:

1. Open browser console (F12)
2. Clear the cache:
   ```javascript
   import { clearIPFSCache } from './utils/debug';
   clearIPFSCache();
   ```

## License

MIT