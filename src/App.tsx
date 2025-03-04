import React, { useState, useEffect } from 'react';
import NewsSubmissionForm from './components/NewsSubmissionForm';
import NewsFeed from './components/NewsFeed';
import Navigation from './components/Navigation';
import ProfileDropdown from './components/ProfileDropdown';
import ArticleDetailWrapper from './components/ArticleDetailWrapper';
import { ipfsService } from './services/ipfs';
import { walletService } from './services/wallet';
import { storageService } from './services/storage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

type View = 'feed' | 'submit';

function App() {
  const [currentView, setCurrentView] = useState<View>('feed');
  const [account, setAccount] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<Record<string, NewsArticle>>({});

  useEffect(() => {
    const initializeServices = async () => {
      try {
        await ipfsService.initialize();
        setIsInitializing(false);
      } catch (err) {
        console.error('Failed to initialize services:', err);
        setError('Failed to initialize IPFS. The app will have limited functionality.');
        setIsInitializing(false);
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      ipfsService.cleanup().catch(console.error);
    };
  }, []);

  useEffect(() => {
    // Setup wallet change listener
    walletService.setupEventListeners(setAccount);
  }, []);

  const handleConnect = async () => {
    try {
      const account = await walletService.connectWallet();
      setAccount(account);
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  const handlePublishSuccess = () => {
    // Only change view after successful publish
    setCurrentView('feed');
  };

  // Load article for detail view
  const loadArticle = async (cid: string) => {
    try {
      const article = await ipfsService.getArticle(cid);
      setArticles(prev => ({ ...prev, [cid]: article }));
      return article;
    } catch (err) {
      console.error('Failed to load article:', err);
      return null;
    }
  };

  if (isInitializing) {
    return <div>Initializing...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <p>You can still browse existing articles but cannot create new ones.</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <div className="brand" onClick={() => setCurrentView('feed')}>
              <h1>CipherPress</h1>
            </div>
            <div className="header-divider">|</div>
            <h2 className="section-title">
              {currentView === 'feed' ? 'News Feed' : 'Submit Article'}
            </h2>
          </div>
          <div className="header-right">
            <Navigation activeView={currentView} onViewChange={setCurrentView} />
            <div className="header-divider">|</div>
            <ProfileDropdown account={account} onConnect={handleConnect} />
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              !isInitializing ? (
                currentView === 'feed' ? (
                  <NewsFeed />
                ) : (
                  <NewsSubmissionForm 
                    account={account} 
                    onSubmitSuccess={handlePublishSuccess}
                  />
                )
              ) : (
                <div className="loading">Initializing IPFS...</div>
              )
            } />
            <Route path="/submit" element={
              <NewsSubmissionForm account={account} onSubmitSuccess={handlePublishSuccess} />
            } />
            <Route path="/article/:cid" element={<ArticleDetailWrapper />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>decentralized · uncensored · immutable</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
