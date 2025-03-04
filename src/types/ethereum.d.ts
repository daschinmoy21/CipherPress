interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    isMetaMask?: boolean;
    on?: (event: string, callback: any) => void;
    removeListener?: (event: string, callback: any) => void;
  }
} 