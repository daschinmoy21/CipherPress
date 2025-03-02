import React, { useState, useRef, useEffect } from 'react';

interface ProfileDropdownProps {
  account: string | null;
  onConnect: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ account, onConnect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFullAddress(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyAddress = async () => {
    if (account) {
      try {
        await navigator.clipboard.writeText(account);
        setShowCopyNotification(true);
        setTimeout(() => setShowCopyNotification(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const toggleAddressDisplay = () => {
    setShowFullAddress(!showFullAddress);
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-button" 
        onClick={() => setIsOpen(!isOpen)}
        title={account ? 'Your Profile' : 'Connect Wallet'}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {account ? (
            <>
              <div className="dropdown-header">Connected Wallet</div>
              <div className="wallet-info">
                {showCopyNotification && (
                  <div className="copy-notification">Address copied!</div>
                )}
                <div className="wallet-address-container">
                  <div 
                    className="wallet-address"
                    onClick={toggleAddressDisplay}
                    title="Click to toggle full address"
                  >
                    {showFullAddress ? account : `${account.substring(0, 6)}...${account.slice(-4)}`}
                  </div>
                  <button 
                    className="copy-button"
                    onClick={handleCopyAddress}
                    title="Copy address"
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button className="connect-wallet-btn" onClick={onConnect}>
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 