import React from 'react';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: number;
  author: string;
}

const NewsFeed: React.FC = () => {
  // Placeholder data - will be replaced with actual data from IPFS
  const articles: NewsArticle[] = [
    {
      id: '1',
      title: 'Sample News Article',
      content: 'This is a sample news article content. It will be replaced with real content from IPFS.',
      tags: ['tech', 'blockchain'],
      timestamp: Date.now(),
      author: '0x1234...5678'
    }
  ];

  return (
    <div className="news-feed">
      <div className="articles-grid">
        {articles.map(article => (
          <article key={article.id} className="article-card">
            <h3>{article.title}</h3>
            <div className="article-tags">
              {article.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className="article-meta">
              <span>{new Date(article.timestamp).toLocaleDateString()}</span>
              <span>by {article.author.substring(0, 6)}...{article.author.slice(-4)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed; 