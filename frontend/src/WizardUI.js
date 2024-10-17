import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import Sidebar from './Sidebar';
import './App.css';

const WizardUI = () => {
  const [currentStep, setCurrentStep] = useState(0); // Updated to start from the brand voice step
  const [keyword, setKeyword] = useState('');
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [imagePrompts, setImagePrompts] = useState([]);
  const [suggestions, setSuggestions] = useState('');
  const [draftSuggestions, setDraftSuggestions] = useState('');
  const [brandVoiceQuestion, setBrandVoiceQuestion] = useState('');
  const [brandVoiceAnswer, setBrandVoiceAnswer] = useState('');
  const [brandVoiceProfileComplete, setBrandVoiceProfileComplete] = useState(false);

  useEffect(() => {
    if (currentStep === 0) {
      getBrandVoiceQuestion();
    }
  }, [currentStep]);

  // Fetch the next brand voice question from the backend
  const getBrandVoiceQuestion = async () => {
    try {
      const response = await axios.post('http://localhost:3000/create-brand-voice', {
        answer: brandVoiceAnswer, // Send the previous answer
      });
      if (response.data.message) {
        setBrandVoiceProfileComplete(true);
      } else {
        setBrandVoiceQuestion(response.data.question);
        setBrandVoiceAnswer(''); // Reset the input for the next question
      }
    } catch (err) {
      setError('An error occurred while creating the brand voice profile. Please try again.');
    }
  };

  const handleBrandVoiceAnswerSubmit = () => {
    if (brandVoiceAnswer.trim() === '') {
      alert('Please provide an answer before proceeding.');
      return;
    }
    getBrandVoiceQuestion(); // Send the answer and get the next question
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
      const sanitizedOutline = DOMPurify.sanitize(response.data.outline);
      setOutline(sanitizedOutline);
      setCurrentStep(2);
    } catch (err) {
      setError('An error occurred while generating the outline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const regenerateOutline = async (keyword, suggestions) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/regenerate-outline', {
        topic: keyword,
        suggestions: suggestions,
      });
      const sanitizedOutline = DOMPurify.sanitize(response.data.outline);
      setOutline(sanitizedOutline);
      setIsEditing(false);
    } catch (err) {
      setError('An error occurred while generating the new outline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateDraft = async (outline) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/generate-draft', {
        outline: outline,
        topic: keyword,
      });
      setDraft(response.data.draft);
      setCurrentStep(3); // Move to draft review
    } catch (err) {
      setError('An error occurred while generating the draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const regenerateDraft = async (outline, draftSuggestions) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/regenerate-draft', {
        outline: outline,
        suggestions: draftSuggestions,
      });
      setDraft(response.data.draft);
      setIsEditing(false);
    } catch (err) {
      setError('An error occurred while generating the new draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateImagePrompts = async (draft) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/generate-image-prompts', {
        draft: draft,
      });
      setImagePrompts(response.data.prompts);
      setCurrentStep(4);
    } catch (err) {
      setError('An error occurred while generating image prompts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="card-container">
      <div className="header">
        <div className="progress-container">
          <span className="progress-text">Progress:</span>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${(currentStep / 5) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="wizard-container">
        <Sidebar currentStep={currentStep} />
        <div className="main-content">
          {currentStep === 0 && (
            <div className="step step-0">
              <h2>Welcome to the Blog Post Generator</h2>
              <p>To get started, we will establish your brand voice profile so that all of your blog posts are written in your unique brand voice. You will be presented with a series of questions to dial in the tone and style of the writing. It is important that you answer them as thoroughly as possible.</p>
              <h3>Question:</h3>
              {!brandVoiceProfileComplete ? (
                <>
                  <p>{brandVoiceQuestion}</p>
                  <input
                    type="text"
                    className="answer-input"
                    value={brandVoiceAnswer}
                    onChange={(e) => setBrandVoiceAnswer(e.target.value)}
                    placeholder="Enter your answer"
                  />
                  <button className="next-button" onClick={handleBrandVoiceAnswerSubmit} disabled={loading}>
                    {loading ? 'Saving Answer...' : 'Next Question'}
                  </button>
                </>
              ) : (
                <>
                  <p>Your brand voice profile has been completed. Let's move on to generating your blog post!</p>
                  <button className="next-button" onClick={() => setCurrentStep(1)}>
                    Proceed to Keyword Input
                  </button>
                </>
              )}
              {error && <p className="error-message">{error}</p>}
            </div>
          )}

          {/* Existing Steps */}
          {currentStep === 1 && (
            <div className="step step-1">
              <h2>Step 1: Keyword Selection</h2>
              <p>Enter the main topic or keyword for your blog post below:</p>
              <input
                type="text"
                className="keyword-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
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

                  {isEditing ? (
                    <div>
                      <textarea
                        value={suggestions}
                        onChange={(e) => setSuggestions(e.target.value)}
                        placeholder="Provide your suggestions for improving the outline"
                      />
                      <button onClick={() => regenerateOutline(keyword, suggestions)}>
                        Submit Suggestions and Generate New Outline
                      </button>
                    </div>
                  ) : (
                    <pre dangerouslySetInnerHTML={{ __html: outline }}></pre>
                  )}

                  <div className="button-group">
                    {!isEditing ? (
                      <>
                        <button className="next-button" onClick={() => generateDraft(outline)}>
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

                  {isEditing ? (
                    <div>
                      <textarea
                        value={draftSuggestions}
                        onChange={(e) => setDraftSuggestions(e.target.value)}
                        placeholder="Provide your suggestions for improving the draft"
                      />
                      <button onClick={() => regenerateDraft(outline, draftSuggestions)}>
                        Submit Suggestions and Regenerate Draft
                      </button>
                    </div>
                  ) : (
                    <div className="button-group">
                      <button className="next-button" onClick={() => generateImagePrompts(draft)}>
                        Approve and Generate Image Prompts
                      </button>
                      <button className="edit-button" onClick={handleEditClick}>
                        Needs Changes
                      </button>
                    </div>
                  )}
                </div>
              )}
              {error && <p className="error-message">{error}</p>}
            </div>
          )}
          {currentStep === 4 && (
            <div className="step step-4">
              <h2>Step 4: Image Prompts</h2>
              {loading ? (
                <p>Generating image prompts...</p>
              ) : (
                <div>
                  <ul>
                    {imagePrompts.map((prompt, index) => (
                      <li key={index}>{prompt}</li>
                    ))}
                  </ul>
                  <div className="button-group">
                    <button className="next-button" onClick={() => setCurrentStep(5)}>
                      Approve Prompts
                    </button>
                    <button className="edit-button" onClick={() => generateImagePrompts(draft)}>
                      Request New Prompts
                    </button>
                  </div>
                </div>
              )}
              {error && <p className="error-message">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WizardUI;
