import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import Sidebar from './Sidebar';
import './App.css';

const WizardUI = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [imagePrompts, setImagePrompts] = useState([]);
  const [suggestions, setSuggestions] = useState('');
  const [draftSuggestions, setDraftSuggestions] = useState('');

  // Define progress based on the current step (there are 5 steps)
  const getProgress = () => {
    return `${(currentStep / 5) * 100}%`;
  };

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
              <div className="progress-bar-fill" style={{ width: getProgress() }} />
            </div>
          </div>
        </div>
      </div>

      <div className="wizard-container">
        <Sidebar currentStep={currentStep} />
        <div className="main-content">
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
