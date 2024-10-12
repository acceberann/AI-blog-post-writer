
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
  const [isEditing, setIsEditing] = useState(false); // New state for editing mode
  const [draft, setDraft] = useState(''); // New state to store the generated draft

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
      console.log("Starting to generate outline for keyword:", keyword);
      generateOutline(keyword);
    }
  };

  const generateOutline = async (keyword) => {
    try {
      const response = await axios.post('http://localhost:3000/generate-outline', {
        topic: keyword,
      });
      console.log("Outline generated:", response.data.outline);
      const sanitizedOutline = DOMPurify.sanitize(response.data.outline);
      setOutline(sanitizedOutline);
      setCurrentStep(2);
    } catch (err) {
      setError('An error occurred while generating the outline. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateDraft = async (outline) => {
    console.log("Sending outline to backend to generate draft...");
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/generate-draft', {
        outline: outline,
      });
      console.log("Draft generated:", response.data.draft);
      setDraft(response.data.draft);
      setCurrentStep(3); // Move to the draft review step
    } catch (err) {
      setError('An error occurred while generating the draft. Please try again.');
      console.error("Error generating draft:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);  // Enable editing mode
  };

  const handleSaveClick = () => {
    setIsEditing(false);  // Save changes and disable editing mode
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

              {/* Conditionally render textarea for editing or pre-formatted outline */}
              {isEditing ? (
                <textarea 
                  value={outline} 
                  onChange={(e) => setOutline(e.target.value)} 
                />
              ) : (
                <pre dangerouslySetInnerHTML={{ __html: outline }}></pre>
              )}

              <div className="button-group">
                {!isEditing ? (
                  <>
                    <button className="next-button" onClick={() => {
                      console.log("Proceeding with outline:", outline);
                      generateDraft(outline);
                    }}>
                      Looks Good, Proceed
                    </button>
                    <button className="edit-button" onClick={handleEditClick}>
                      Needs Changes
                    </button>
                  </>
                ) : (
                  <button className="save-button" onClick={handleSaveClick}>
                    Save Outline
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p>Generating the outline for "{keyword}"...</p>
          )}
        </div>
      )}
      {currentStep === 3 && (
        <div className="step step-3">
          <h2>Step 3: Blog Post Draft</h2>
          {loading ? (
            <p>Generating the blog post draft...</p>
          ) : (
            <div>
              <pre>{draft}</pre>
              {/* Additional buttons for review and editing could be added here */}
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
      {/* Additional steps can be added here */}
    </div>
  );
};

export default WizardUI;