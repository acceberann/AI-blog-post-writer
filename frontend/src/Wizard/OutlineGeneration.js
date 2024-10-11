import React, { useState } from 'react';
import axios from 'axios';

const OutlineGeneration = ({ keyword, onNext }) => {
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to generate outline using backend
  const generateOutline = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/generate-outline', {
        topic: keyword,
      });
      setOutline(response.data.outline);
    } catch (err) {
      setError('An error occurred while generating the outline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Run outline generation when the component loads
  React.useEffect(() => {
    generateOutline();
  }, []);

  return (
    <div className="outline-generation-container">
      <h2>Outline Generation</h2>
      <p>Keyword: <strong>{keyword}</strong></p>

      {loading && <p>Generating outline...</p>}
      {error && <p className="error">{error}</p>}

      {outline && (
        <div className="outline-result">
          <h3>Generated Outline:</h3>
          <pre>{outline}</pre>
          <button onClick={() => onNext(outline)}>Looks Good, Proceed</button>
        </div>
      )}

      {!loading && !outline && (
        <button onClick={generateOutline}>Retry Generating Outline</button>
      )}
    </div>
  );
};

export default OutlineGeneration;
