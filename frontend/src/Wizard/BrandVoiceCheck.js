import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BrandVoiceCheck = ({ onNext }) => {
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Function to check for existing brand voice profile
  const checkProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/check-brand-voice');
      setProfileExists(response.data.exists);
      setLoading(false);
    } catch (error) {
      console.error('Error checking brand voice profile:', error);
      setLoading(false);
    }
  };

  // Run check when component loads
  useEffect(() => {
    checkProfile();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCreateProfile = async () => {
    try {
      const response = await axios.post('http://localhost:3000/create-brand-voice', {
        answer: inputValue,
      });
      if (response.data.question) {
        setQuestion(response.data.question);
        setInputValue('');
      } else if (response.data.message) {
        onNext(); // Move to the next step once profile creation is complete
      }
    } catch (error) {
      console.error('Error creating brand voice profile:', error);
    }
  };

  return (
    <div className="brand-voice-check-container">
      <h2>Brand Voice Profile</h2>
      {loading && <p>Checking for existing brand voice profile...</p>}

      {!loading && profileExists && (
        <div>
          <p>We have your brand voice profile on file. Ready to proceed?</p>
          <button onClick={() => onNext()}>Proceed to Draft Generation</button>
        </div>
      )}

      {!loading && !profileExists && (
        <div>
          <p>We need to create a brand voice profile. Please answer the following questions:</p>
          {question && <p>{question}</p>}
          {!question && <p>First, what is the name of your brand?</p>}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter your answer..."
          />
          <button onClick={handleCreateProfile}>Submit Answer</button>
        </div>
      )}
    </div>
  );
};

export default BrandVoiceCheck;
