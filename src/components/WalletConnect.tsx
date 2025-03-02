import React, { useState, useEffect } from 'react';

const WalletConnect: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('WalletConnect mounted');
    const checkMetaMask = async () => {
      console.log('Checking MetaMask...');
      console.log('window.ethereum:', window.ethereum);
      try {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          console.log('Found accounts:', accounts);
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } else {
          console.log('MetaMask not found');
          setError('MetaMask is not installed. Please install it to use this app.');
        }
      } catch (err) {
        console.error('Error checking MetaMask:', err);
        setError('Failed to connect to MetaMask.');
      }
    };

    checkMetaMask();
  }, []);

  const connectWallet = async () => {
    console.log('Connecting wallet...');
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected accounts:', accounts);
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          setError(null);
        }
      } else {
        console.log('MetaMask not found');
        setError('MetaMask is not installed. Please install it to use this app.');
      }
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
      setError('Failed to connect to MetaMask.');
    }
  };

  console.log('Rendering WalletConnect', { account, error });

  return (
    <div className="wallet-connect">
      {error && <p className="error">{error}</p>}
      {account ? (
        <div>
          <p>Connected account:</p>
          <p className="account">{account}</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default WalletConnect;