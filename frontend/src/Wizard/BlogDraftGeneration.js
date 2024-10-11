import React, { useState } from 'react';
import axios from 'axios';

const BlogDraftGeneration = ({ outline, brandVoiceProfile, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const generateDraft = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/generate-draft', {
        outline,
        brandVoiceProfile,
      });
      setDraft(response.data.draft);
      setLoading(false);
    } catch (err) {
      console.error('Error generating blog draft:', err);
      setError('There was an error generating the blog draft. Please try again.');
      setLoading(false);
    }
  };

  const handleProceed = () => {
    onNext(draft); // Move to the next step with the generated draft
  };

  return (
    <div className="blog-draft-generation-container">
      <h2>Blog Draft Generation</h2>
      {!draft && !loading && (
        <div>
          <button onClick={generateDraft}>Generate Blog Draft</button>
        </div>
      )}
      {loading && <p>Generating your blog draft, please wait...</p>}
      {error && <p className="error">{error}</p>}
      {draft && (
        <div>
          <h3>Draft Generated:</h3>
          <div className="draft-container">
            <p>{draft}</p>
          </div>
          <button onClick={handleProceed}>Proceed to Review & Polish</button>
        </div>
      )}
    </div>
  );
};

export default BlogDraftGeneration;
