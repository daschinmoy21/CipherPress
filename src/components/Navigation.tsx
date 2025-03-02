import React from 'react';

interface NavigationProps {
  activeView: 'feed' | 'submit';
  onViewChange: (view: 'feed' | 'submit') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  return (
    <button 
      className={`nav-button upload-button ${activeView === 'submit' ? 'active' : ''}`}
      onClick={() => onViewChange('submit')}
      title="Upload News"
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
    </button>
  );
};

export default Navigation; 