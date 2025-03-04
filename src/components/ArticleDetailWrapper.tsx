import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArticleDetail from './ArticleDetail';
import type { NewsArticle } from '../types/article';
import { ipfsService } from '../services/ipfs';

const ArticleDetailWrapper: React.FC = () => {
  const { cid } = useParams<{ cid: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!cid) return;
      
      try {
        const loadedArticle = await ipfsService.getArticle(cid);
        setArticle(loadedArticle);
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [cid]);

  if (loading) {
    return <div className="loading">Loading article...</div>;
  }

  if (error || !article) {
    return <div className="error">Error: {error || 'Article not found'}</div>;
  }

  return <ArticleDetail article={article} />;
};

export default ArticleDetailWrapper; 