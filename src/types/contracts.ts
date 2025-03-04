import type { ethers } from 'ethers';

export interface CipherPressContract extends ethers.Contract {
  publishArticle(cid: string): Promise<ethers.ContractTransaction>;
  getArticleCIDs(): Promise<string[]>;
  articles(cid: string): Promise<{
    cid: string;
    author: string;
    timestamp: ethers.BigNumber;
    exists: boolean;
  }>;
}

export interface ContractArtifact {
  address: string;
  abi: any[];
  network: string;
  deployedAt: string;
} 