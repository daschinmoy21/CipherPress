import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ipfsService } from '../services/ipfs';
import { storageService } from '../services/storage';
import type { NewsArticle } from '../types/article';
import { clearIPFSCache } from '../utils/debug';

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cids = await storageService.getStoredCIDs();
      
      if (cids.length === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      // Get articles from either cache or IPFS
      const loadedArticles = await ipfsService.getAllArticles(cids);
      
      if (loadedArticles.length === 0 && cids.length > 0) {
        // If we have CIDs but no articles loaded, there's probably a CORS issue
        setError('Unable to load articles. There may be CORS issues with IPFS gateways.');
      } else {
        // Sort by timestamp, newest first
        loadedArticles.sort((a, b) => b.timestamp - a.timestamp);
        setArticles(loadedArticles);
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
      setError('Failed to load articles. Try clearing the cache from browser console.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    clearIPFSCache();
    loadArticles();
  };

  const handleArticleClick = (article: NewsArticle) => {
    navigate(`/article/${article.cid}`);
  };

  if (loading) {
    return <div className="loading">Loading articles...</div>;
  }

  return (
    <div className="news-feed">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={handleClearCache} className="clear-cache-btn">
            Clear Cache
          </button>
        </div>
      )}
      
      {articles.length === 0 && !error ? (
        <div className="empty-state">
          <p>No articles yet. Be the first to publish!</p>
        </div>
      ) : (
        <div className="articles-list">
          {articles.map((article, index) => (
            <div key={article.id} className="article-item">
              <div className="article-index">{index + 1}.</div>
              <div className="article-content">
                <div className="article-title" onClick={() => handleArticleClick(article)}>
                  {article.title}
                </div>
                <div className="article-meta">
                  <span>{new Date(article.timestamp).toLocaleDateString()}</span>
                  <span>by {article.author.substring(0, 6)}...{article.author.slice(-4)}</span>
                  <span>{article.tags.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed; 