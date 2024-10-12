
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OutlineGeneration = ({ keyword, onNext }) => {
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to generate outline using backend
  const generateOutline = async () => {
    setLoading(true);
    setError('');
    console.log("Sending request to generate outline for keyword:", keyword);

    try {
      const response = await axios.post('http://localhost:3000/generate-outline', { topic: keyword });
      console.log("Outline generated:", response.data.outline);
      setOutline(response.data.outline);
    } catch (err) {
      console.error("Error generating outline:", err);
      setError('An error occurred while generating the outline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Run outline generation when the component loads
  useEffect(() => {
    console.log("OutlineGeneration component loaded");
    generateOutline();
  }, []);

  return (
    <div className="outline-generation-container">
      <h2>Step 2: Outline Generation</h2>
      <p>Keyword: <strong>{keyword}</strong></p>

      {loading && <p>Generating outline...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && outline && (
        <div className="outline-result">
          <h3>Generated Outline:</h3>
          <pre>{outline}</pre>

          <div className="button-group">
            <button onClick={() => onNext(outline)}>Looks Good, Proceed</button>
            <button onClick={() => alert('Editing not implemented yet')}>Needs Changes</button>
          </div>
        </div>
      )}

      {!loading && !outline && (
        <button onClick={generateOutline}>Retry Generating Outline</button>
      )}
    </div>
  );
};

export default OutlineGeneration;