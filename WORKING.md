# CipherPress: Technical Flow Documentation

## Technology Stack Overview

- **Frontend**: React + TypeScript + Vite
- **Smart Contract**: Solidity (Ethereum)
- **Storage**: IPFS (InterPlanetary File System)
- **Web3 Integration**: ethers.js + MetaMask
- **Local Development**: Hardhat

## Data Flow & Component Interaction

### 1. Initial Application Load

When a user opens the website (http://localhost:3000):
1. `main.tsx` bootstraps the React application
2. `App.tsx` initializes core services:
   - `ipfsService` connects to IPFS node
   - `walletService` checks for existing MetaMask connection
   - `storageService` prepares contract interaction

### 2. Wallet Connection Flow

When user clicks "Connect Wallet":
1. `WalletConnect` component triggers `walletService.connectWallet()`
2. MetaMask popup appears requesting connection
3. If approved:
   - `eth_requestAccounts` method is called
   - User's address is stored in localStorage
   - UI updates to show connected address
4. Connection status is maintained by `walletService`

### 3. Article Submission Flow

When user submits an article:
1. `NewsSubmissionForm` component:
   - Collects title, content, tags
   - Validates input
   - Shows submission status

2. IPFS Storage:
   ```typescript
   // ipfsService.storeArticle()
   - Creates article object
   - Converts to JSON
   - Uploads to IPFS
   - Returns Content Identifier (CID)
   ```

3. Blockchain Storage:
   ```solidity
   // CipherPress.sol
   function publishArticle(string memory _cid) public {
     // Stores CID and metadata on-chain
     // Emits ArticlePublished event
   }
   ```

4. Transaction Flow:
   - MetaMask prompts for transaction approval
   - User confirms transaction
   - Contract emits event
   - UI shows success message

### 4. Article Retrieval Flow

When loading the news feed:
1. `NewsFeed` component mounts
2. Contract interaction:
   ```typescript
   // storageService.getStoredCIDs()
   - Calls contract.getArticleCIDs()
   - Returns array of CIDs
   ```

3. IPFS Content Loading:
   ```typescript
   // ipfsService.getArticle(cid)
   - Fetches content from IPFS
   - Decodes JSON data
   - Returns article object
   ```

4. Development Mode:
   - Uses local storage cache
   - Filters non-existent CIDs
   - Faster development experience

### 5. Article Detail View

When user clicks an article:
1. `ArticleDetailWrapper`:
   - Gets CID from URL params
   - Loads full article from IPFS
   - Handles loading states

2. `ArticleDetail`:
   - Displays formatted article
   - Shows metadata (author, timestamp)
   - Provides navigation

## Service Architecture

### 1. IPFS Service (`ipfsService`)
```typescript
class IPFSService {
  // Handles IPFS node connection
  // Manages content upload/download
  // Provides caching in development
}
```

### 2. Wallet Service (`walletService`)
```typescript
class WalletService {
  // Manages MetaMask connection
  // Handles network switching
  // Maintains connection state
}
```

### 3. Storage Service (`storageService`)
```typescript
class StorageService {
  // Interacts with smart contract
  // Manages contract initialization
  // Handles transaction errors
}
```

## Development Environment

### Local Setup
1. Start Hardhat node:
   ```bash
   npm run node
   ```

2. Deploy contract:
   ```bash
   npm run deploy:local
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### MetaMask Configuration
- Network: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Import test account private key

## Error Handling

1. MetaMask Errors:
   - Connection rejection
   - Network switching
   - Transaction failures

2. IPFS Errors:
   - Content not found
   - Upload failures
   - Connection issues

3. Contract Errors:
   - Initialization failures
   - Transaction reverts
   - Network issues

## Development vs Production

### Development Mode
- Uses local Hardhat network
- IPFS content cached in localStorage
- Faster content loading
- Test ETH available

### Production Mode
- Uses Ethereum mainnet
- Real IPFS network
- Real gas costs
- Persistent storage

## Testing

1. Contract Tests:
   - Deployment verification
   - Function testing
   - Event emission

2. IPFS Tests:
   - Content upload/download
   - Data integrity
   - Cache management

3. Integration Tests:
   - End-to-end flows
   - Service interaction
   - Error scenarios 