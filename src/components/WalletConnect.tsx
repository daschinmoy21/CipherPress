import React, { useState, useEffect } from 'react';
import { walletService } from '../services/wallet';

const WalletConnect: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>('');

  const updateNetworkName = async () => {
    if (!window.ethereum) return;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networks: { [key: string]: string } = {
        '0x1': 'Ethereum Mainnet',
        '0x5': 'Goerli Testnet',
        '0xaa36a7': 'Sepolia Testnet',
        '0x7a69': 'Hardhat Local',
        '0x13881': 'Mumbai Testnet'
      };
      
      setNetworkName(networks[chainId] || `Chain ID: ${chainId}`);
    } catch (error) {
      console.error('Failed to get network:', error);
      setNetworkName('Unknown Network');
    }
  };

  useEffect(() => {
    // Check initial connection
    walletService.checkConnection().then(addr => {
      setAddress(addr);
      if (addr) updateNetworkName();
    });

    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        updateNetworkName();
      });
    }

    return () => {
      // Cleanup listeners
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('chainChanged', updateNetworkName);
      }
    };
  }, []);

  const handleConnect = async () => {
    try {
      const addr = await walletService.connectWallet();
      setAddress(addr);
      await updateNetworkName();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  return (
    <div className="wallet-connect">
      {address ? (
        <div className="wallet-info">
          <span className="network">{networkName}</span>
          <span className="address">
            {address.substring(0, 6)}...{address.slice(-4)}
          </span>
        </div>
      ) : (
        <button onClick={handleConnect} className="connect-button">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;