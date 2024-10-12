import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify'; // Import DOMPurify
import './App.css';

const WizardUI = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && keyword.trim() === '') {
      alert('Please enter a keyword to proceed.');
      return;
    }
    if (currentStep === 1) {
      setLoading(true);
      generateOutline(keyword);
    }
  };

  const generateOutline = async (keyword) => {
    try {
      const response = await axios.post('http://localhost:3000/generate-outline', {
        topic: keyword,
      });
      // Sanitize the outline content before setting it
      const sanitizedOutline = DOMPurify.sanitize(response.data.outline);
      setOutline(sanitizedOutline);
      setCurrentStep(2);
    } catch (err) {
      setError('An error occurred while generating the outline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wizard-container">
      {currentStep === 1 && (
        <div className="step step-1">
          <h2>Step 1: Keyword Selection</h2>
          <p>Enter the main topic or keyword for your blog post below:</p>
          <input
            type="text"
            className="keyword-input"
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="e.g., Digital Marketing Trends"
          />
          <button className="next-button" onClick={handleNextStep} disabled={loading}>
            {loading ? 'Generating Outline...' : 'Next'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
      {currentStep === 2 && (
        <div className="step step-2">
          <h2>Step 2: Outline Generation</h2>
          {outline ? (
            <div>
              <p>Outline for "{keyword}":</p>
              <pre dangerouslySetInnerHTML={{ __html: outline }}></pre>
              <button className="next-button" onClick={() => setCurrentStep(3)}>
                Looks Good, Proceed
              </button>
            </div>
          ) : (
            <p>Generating the outline for "{keyword}"...</p>
          )}
        </div>
      )}
      {/* Additional steps will follow here */}
    </div>
  );
};

export default WizardUI;