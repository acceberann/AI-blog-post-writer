import React, { useState } from 'react';
import './App.css';

const WizardUI = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [keyword, setKeyword] = useState('');

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && keyword.trim() === '') {
      alert('Please enter a keyword to proceed.');
      return;
    }
    setCurrentStep(currentStep + 1);
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
          <button className="next-button" onClick={handleNextStep}>Next</button>
        </div>
      )}
      {currentStep === 2 && (
        <div className="step step-2">
          <h2>Step 2: Outline Generation</h2>
          <p>Generating the outline for "{keyword}"...</p>
          {/* Placeholder for outline - future functionality */}
        </div>
      )}
      {/* Add more steps as needed */}
    </div>
  );
};

export default WizardUI;
