import { ethers } from 'ethers';
import type { Article } from '../types/article';
import type { CipherPressContract, ContractArtifact } from '../types/contracts';
import { Web3Error, handleError } from '../utils/errors';
import { getEnvVar } from '../utils/env';

/**
 * Service for interacting with the CipherPress smart contract
 */
class ContractService {
  private contract: CipherPressContract | null = null;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private networkChecked = false;

  private async loadContract(): Promise<void> {
    try {
      // Load contract artifact
      const artifact: ContractArtifact = await import('../contracts/CipherPress.json');
      
      if (!artifact.address || !artifact.abi) {
        throw new Web3Error('Invalid contract artifact');
      }

      return artifact;
    } catch (err) {
      throw new Web3Error('Failed to load contract artifact', 'LOAD_FAILED', err);
    }
  }

  private async checkNetwork(): Promise<void> {
    if (this.networkChecked) return;

    const chainId = await this.provider?.getNetwork()
      .then(network => network.chainId)
      .catch(() => null);

    const expectedChainId = import.meta.env.DEV ? 11155111n : 1n; // Sepolia or Mainnet

    if (chainId !== expectedChainId) {
      throw new Web3Error(
        `Wrong network. Please connect to ${import.meta.env.DEV ? 'Sepolia' : 'Mainnet'}`
      );
    }

    this.networkChecked = true;
  }

  /**
   * Initializes the contract connection
   */
  async initialize(): Promise<void> {
    if (!window.ethereum) {
      throw new Web3Error('No Web3 Provider found. Please install MetaMask.');
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      await this.checkNetwork();
      
      const artifact = await this.loadContract();
      
      this.contract = new ethers.Contract(
        artifact.address,
        artifact.abi,
        this.signer
      ) as CipherPressContract;

    } catch (err) {
      throw handleError(err);
    }
  }

  /**
   * Ensures contract is initialized before operations
   */
  private async ensureInitialized() {
    if (!this.contract) {
      await this.initialize();
    }
  }

  /**
   * Stores an article CID on the blockchain
   * @param cid IPFS Content Identifier
   */
  async storeCID(cid: string): Promise<void> {
    if (!cid || typeof cid !== 'string') {
      throw new Web3Error('Invalid CID');
    }

    try {
      await this.ensureInitialized();
      
      const tx = await this.contract!.publishArticle(cid);
      await tx.wait();
      
      console.log('Article published on-chain:', cid);
    } catch (err) {
      throw handleError(err);
    }
  }

  /**
   * Retrieves all stored article CIDs
   * @returns Array of CIDs
   */
  async getStoredCIDs(): Promise<string[]> {
    await this.ensureInitialized();
    
    try {
      return await this.contract!.getArticleCIDs();
    } catch (err) {
      console.error('Failed to get CIDs from chain:', err);
      throw new Error('Failed to fetch articles');
    }
  }

  /**
   * Gets article details by CID
   * @param cid Article CID
   * @returns Article details
   */
  async getArticle(cid: string): Promise<Article> {
    await this.ensureInitialized();
    
    try {
      const article = await this.contract!.articles(cid);
      return {
        cid: article.cid,
        author: article.author,
        timestamp: article.timestamp.toNumber(),
        exists: article.exists
      };
    } catch (err) {
      console.error('Failed to get article:', err);
      throw new Error('Failed to fetch article details');
    }
  }
}

export const contractService = new ContractService(); 