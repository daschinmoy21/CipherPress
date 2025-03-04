import React, { useState, useEffect } from 'react';
import { ipfsService } from '../services/ipfs';
import { storageService } from '../services/storage';
import type { NewsSubmission } from '../types/news';

interface Props {
  account: string | null;
  onSubmitSuccess?: () => void;
}

const NewsSubmissionForm: React.FC<Props> = ({ account, onSubmitSuccess }) => {
  const [formData, setFormData] = useState<NewsSubmission>({
    title: '',
    content: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [networkName, setNetworkName] = useState<string>('');

  // Get network name on mount
  useEffect(() => {
    const fetchNetworkName = async () => {
      if (!window.ethereum) return 'No Web3 Provider';
      
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        // Network mapping
        const networks: { [key: string]: string } = {
          '0x1': 'Ethereum Mainnet',
          '0x5': 'Goerli Testnet',
          '0xaa36a7': 'Sepolia Testnet',
          '0x7a69': 'Hardhat Local', // 31337 in hex
          '0x13881': 'Mumbai Testnet'
        };

        setNetworkName(networks[chainId] || `Chain ID: ${chainId}`);
      } catch (error) {
        console.error('Failed to get network:', error);
        setNetworkName('Unknown Network');
      }
    };

    fetchNetworkName();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError('Please connect your wallet to publish');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('submitting');
    setError(null);

    try {
      const article = {
        ...formData,
        id: `${Date.now()}-${account}`,
        timestamp: Date.now(),
        author: account
      };

      const cid = await ipfsService.uploadArticle(article);
      await storageService.storeCID(cid);
      
      // Cache the article locally to avoid CORS issues
      localStorage.setItem(`ipfs-article-${cid}`, JSON.stringify({
        ...formData,
        id: cid,
        author: account,
        timestamp: Date.now(),
        cid
      }));
      
      setSubmitStatus('success');
      // Reset form
      setFormData({ title: '', content: '', tags: [] });
      
      // Show success message before redirecting
      setTimeout(() => {
        onSubmitSuccess?.();
      }, 1500);
      
    } catch (err) {
      console.error('Failed to upload article:', err);
      setError('Failed to publish article. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submission-container">
      <form onSubmit={handleSubmit} className="submission-form">
        {error && <div className="error-message">{error}</div>}
        {submitStatus === 'success' && (
          <div className="success-message">
            Article published successfully! Redirecting...
          </div>
        )}
        <div className="form-header">
          <span className="prompt">$</span> New Article
        </div>
        
        <div className="form-group">
          <label htmlFor="title">
            <span className="prompt">&gt;</span> Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter article title..."
            className="terminal-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">
            <span className="prompt">&gt;</span> Content:
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            placeholder="Write your article content..."
            rows={12}
            className="terminal-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">
            <span className="prompt">&gt;</span> Tags: <span className="hint">(Press Enter to add)</span>
          </label>
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInput}
            placeholder="Add tags..."
            className="terminal-input"
          />
          {formData.tags.length > 0 && (
            <div className="tags-container">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="remove-tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="network-info">
          Publishing to {networkName}
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isSubmitting}
        >
          {submitStatus === 'submitting' ? (
            <span className="loading">Publishing...</span>
          ) : submitStatus === 'success' ? (
            <span className="success">Published!</span>
          ) : (
            <>
              <span className="prompt">&gt;</span> Publish to IPFS
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default NewsSubmissionForm; 