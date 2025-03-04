import { networks } from '../config/networks';
import { Web3Error } from '../utils/errors';

export class WalletService {
  private static WALLET_KEY = 'connected_wallet';
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  async ensureCorrectNetwork(): Promise<void> {
    if (!window.ethereum) return;

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const targetNetwork = import.meta.env.DEV ? networks.mumbai : networks.mainnet;

    if (chainId !== targetNetwork.chainId) {
      try {
        // Try to switch to the correct network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetNetwork.chainId }],
        });
      } catch (switchError: any) {
        // If the network isn't added to MetaMask, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: targetNetwork.chainId,
                chainName: targetNetwork.name,
                nativeCurrency: targetNetwork.currency,
                rpcUrls: targetNetwork.rpcUrls,
                blockExplorerUrls: targetNetwork.blockExplorerUrls
              }],
            });
          } catch (addError) {
            console.error('Failed to add network:', addError);
          }
        }
        console.error('Failed to switch network:', switchError);
      }
    }
  }

  async connectWallet(): Promise<string | null> {
    try {
      if (!window.ethereum) {
        throw new Web3Error('MetaMask not installed');
      }

      // Add delay between retries
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

      // Try to connect with retries
      while (this.retryCount < this.maxRetries) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          
          if (accounts && accounts[0]) {
            localStorage.setItem(WalletService.WALLET_KEY, accounts[0]);
            return accounts[0];
          }
        } catch (error: any) {
          // Handle "Already processing" error
          if (error.code === -32002) {
            await delay(this.retryDelay);
            this.retryCount++;
            continue;
          }
          throw error;
        }
      }

      throw new Web3Error('Failed to connect after retries');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Web3Error('Failed to connect wallet', undefined, error);
    } finally {
      this.retryCount = 0;
    }
  }

  async checkConnection(): Promise<string | null> {
    try {
      // First check localStorage
      const savedAddress = this.getSavedWalletAddress();
      
      // Then verify with MetaMask
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts && accounts[0]) {
          // If the addresses match, return it
          if (savedAddress && savedAddress.toLowerCase() === accounts[0].toLowerCase()) {
            return savedAddress;
          }
          // If they don't match, update storage
          this.saveWalletAddress(accounts[0]);
          return accounts[0];
        }
      }
      
      // If no active connection, clear storage
      this.clearSavedWalletAddress();
      return null;
    } catch (err) {
      console.error('Failed to check wallet connection:', err);
      return null;
    }
  }

  private saveWalletAddress(address: string): void {
    localStorage.setItem(WalletService.WALLET_KEY, address);
  }

  private getSavedWalletAddress(): string | null {
    return localStorage.getItem(WalletService.WALLET_KEY);
  }

  private clearSavedWalletAddress(): void {
    localStorage.removeItem(WalletService.WALLET_KEY);
  }

  setupEventListeners(callback: (account: string | null) => void): void {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        const newAccount = accounts[0] || null;
        if (newAccount) {
          this.saveWalletAddress(newAccount);
        } else {
          this.clearSavedWalletAddress();
        }
        callback(newAccount);
      });
    }
  }

  private async clearPendingRequests() {
    if (window.ethereum && window.ethereum.removeAllListeners) {
      window.ethereum.removeAllListeners('accountsChanged');
    }
  }
}

export const walletService = new WalletService(); 