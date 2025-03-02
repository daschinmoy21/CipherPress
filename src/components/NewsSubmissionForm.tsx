import React, { useState } from 'react';

interface NewsSubmission {
  title: string;
  content: string;
  tags: string[];
}

const NewsSubmissionForm: React.FC = () => {
  const [formData, setFormData] = useState<NewsSubmission>({
    title: '',
    content: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    // Placeholder for IPFS submission
    console.log('Submitting news:', formData);
    setTimeout(() => setIsSaving(false), 1000); // Simulate submission
  };

  return (
    <div className="submission-container">
      <form onSubmit={handleSubmit} className="submission-form">
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

        <button type="submit" className="submit-button" disabled={isSaving}>
          {isSaving ? (
            <span className="loading">Publishing...</span>
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