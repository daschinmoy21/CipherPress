import { ethers } from 'ethers';
import type { CipherPressContract } from '../types/contracts';
import { Contract } from 'ethers';
import { Web3Error } from '../utils/errors';

export class StorageService {
  private contract: Contract | null = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    // Prevent multiple simultaneous initialization attempts
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        if (!window.ethereum) {
          throw new Web3Error('MetaMask not installed');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        const contractInfo = await import('../contracts/CipherPress.json');
        this.contract = new Contract(
          contractInfo.address,
          contractInfo.abi,
          signer
        ) as CipherPressContract;

        this.isInitialized = true;
        console.log('Storage contract initialized');
      } catch (error) {
        console.error('Failed to initialize contract:', error);
        throw new Web3Error('Failed to initialize contract', undefined, error);
      }
    })();

    return this.initializationPromise;
  }

  async storeCID(cid: string): Promise<void> {
    await this.ensureInitialized();
    
    try {
      const tx = await this.contract!.publishArticle(cid);
      await tx.wait();
      console.log('CID stored on chain:', cid);
    } catch (err) {
      console.error('Failed to store CID:', err);
      throw err;
    }
  }

  async getStoredCIDs(): Promise<string[]> {
    await this.ensureInitialized();
    
    try {
      // Get CIDs from chain
      const chainCIDs = await this.contract!.getArticleCIDs();
      
      // In development, filter out CIDs that we don't have in local storage
      if (import.meta.env.DEV) {
        const validCIDs = chainCIDs.filter(cid => {
          const hasLocal = localStorage.getItem(`ipfs-article-${cid}`) !== null;
          if (!hasLocal) {
            console.log(`Skipping CID not in local storage: ${cid}`);
          }
          return hasLocal;
        });
        
        // Add any additional local CIDs
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('ipfs-article-')) {
            const cid = key.replace('ipfs-article-', '');
            if (!validCIDs.includes(cid)) {
              validCIDs.push(cid);
            }
          }
        }
        
        return validCIDs;
      }
      
      return chainCIDs;
    } catch (err) {
      console.error('Failed to get CIDs:', err);
      
      // Fallback to local storage
      if (import.meta.env.DEV) {
        const localCIDs: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('ipfs-article-')) {
            localCIDs.push(key.replace('ipfs-article-', ''));
          }
        }
        return localCIDs;
      }
      
      throw err;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }
}

export const storageService = new StorageService(); 