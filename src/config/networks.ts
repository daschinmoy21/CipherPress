export const networks = {
  mainnet: {
    chainId: '0x1', // 1
    name: 'Ethereum Mainnet',
    currency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3/your-project-id'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  sepolia: {
    chainId: '0xaa36a7', // 11155111
    name: 'Sepolia Testnet',
    currency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/your-project-id'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }
} as const;

// Type declaration for Vite's import.meta.env
declare global {
  interface ImportMeta {
    env: {
      DEV: boolean;
      PROD: boolean;
      MODE: string;
      VITE_CONTRACT_ADDRESS: string;
    };
  }
} 