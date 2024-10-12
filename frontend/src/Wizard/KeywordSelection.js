import React, { useState } from 'react';

const KeywordSelection = ({ onNext }) => {
  const [keyword, setKeyword] = useState('');

  console.log('KeywordSelection component loaded'); // Check if the component is rendering

  const handleNextClick = () => {
    console.log('Keyword submitted:', keyword); // Debugging message to check if the button click is handled
    if (keyword.trim()) {
      onNext(keyword);
    } else {
      console.log('Keyword input is empty'); // Log if keyword is empty
    }
  };

  return (
    <div className="keyword-selection-container">
      <h2>Step 1: Select a Keyword</h2>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter your keyword..."
        className="input-box"
      />
      <button className="button" onClick={handleNextClick}>
        Next
      </button>
    </div>
  );
};

export default KeywordSelection;
