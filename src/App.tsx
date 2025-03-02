import React, { useState } from 'react';
import NewsSubmissionForm from './components/NewsSubmissionForm';
import NewsFeed from './components/NewsFeed';
import Navigation from './components/Navigation';
import ProfileDropdown from './components/ProfileDropdown';

type View = 'feed' | 'submit';

function App() {
  const [currentView, setCurrentView] = useState<View>('feed');
  const [account, setAccount] = useState<string | null>(null);

  const goToFeed = () => setCurrentView('feed');

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error('Failed to connect:', err);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="brand" onClick={goToFeed}>
            <h1>CipherPress</h1>
          </div>
          <div className="header-divider">|</div>
          <h2 className="section-title">{currentView === 'feed' ? 'News Feed' : 'Submit Article'}</h2>
        </div>
        <div className="header-right">
          <Navigation activeView={currentView} onViewChange={setCurrentView} />
          <div className="header-divider">|</div>
          <ProfileDropdown account={account} onConnect={handleConnect} />
        </div>
      </header>
      <main>
        {currentView === 'feed' ? <NewsFeed /> : <NewsSubmissionForm />}
      </main>
      <footer className="app-footer">
        <p>decentralized · uncensored · immutable</p>
      </footer>
    </div>
  );
}

export default App;