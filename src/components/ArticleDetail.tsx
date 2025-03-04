import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { NewsArticle } from '../types/article';

interface ArticleDetailProps {
  article: NewsArticle;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }) => {
  const navigate = useNavigate();

  return (
    <div className="article-detail">
      <div className="article-header">
        <h1>{article.title}</h1>
        <div className="article-meta">
          <span className="timestamp">{new Date(article.timestamp).toLocaleDateString()}</span>
          <span className="author">by {article.author.substring(0, 6)}...{article.author.slice(-4)}</span>
          {article.cid && (
            <span className="ipfs-link" title="View on IPFS">
              IPFS: {article.cid.substring(0, 8)}...
            </span>
          )}
        </div>
        <div className="tags">
          {article.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="article-content">
        {article.content}
      </div>
      
      <button onClick={() => navigate('/')} className="back-button">
        ← back
      </button>
    </div>
  );
};

export default ArticleDetail; 