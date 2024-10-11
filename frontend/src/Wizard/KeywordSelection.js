import React, { useState } from 'react';

const KeywordSelection = ({ onNext }) => {
  const [keyword, setKeyword] = useState('');

  const handleNext = () => {
    if (keyword.trim()) {
      onNext(keyword);
    }
  };

  return (
    <div className="wizard-step">
      <h2>Step 1: Keyword Selection</h2>
      <p>What is the main topic or keyword for your blog post?</p>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="e.g., Digital Marketing Trends"
      />
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default KeywordSelection;
