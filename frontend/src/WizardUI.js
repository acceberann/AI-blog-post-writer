import React, { useState } from 'react';
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
  const [imagePrompts, setImagePrompts] = useState([]); // State to store image prompts
  const [suggestions, setSuggestions] = useState(''); // State to store user suggestions for outline
  const [draftSuggestions, setDraftSuggestions] = useState(''); // State to store user suggestions for draft

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

  const regenerateOutline = async (keyword, suggestions) => {
    console.log("Regenerating outline based on user suggestions...");
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/regenerate-outline', {
        topic: keyword,
        suggestions: suggestions,
      });
      console.log("New outline generated:", response.data.outline);
      const sanitizedOutline = DOMPurify.sanitize(response.data.outline);
      setOutline(sanitizedOutline);
      setIsEditing(false); // Close the editing mode
    } catch (err) {
      setError('An error occurred while generating the new outline. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateDraft = async (outline) => {
    console.log("Sending outline and topic to backend to generate draft...");
    setLoading(true);
    try {
        const response = await axios.post('http://localhost:3000/generate-draft', {
            outline: outline,
            topic: keyword // Pass the keyword as 'topic'
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

  const regenerateDraft = async (outline, draftSuggestions) => {
    console.log("Regenerating draft based on user suggestions...");
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/regenerate-draft', {
        outline: outline,
        suggestions: draftSuggestions,
      });
      console.log("New draft generated:", response.data.draft);
      setDraft(response.data.draft);
      setIsEditing(false); // Close the editing mode
    } catch (err) {
      setError('An error occurred while generating the new draft. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateImagePrompts = async (draft) => {
    console.log("Generating image prompts based on the blog post draft...");
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/generate-image-prompts', {
        draft: draft,
      });
      console.log("Image prompts generated:", response.data.prompts);
      setImagePrompts(response.data.prompts);
      setCurrentStep(4); // Move to the image prompts review step
    } catch (err) {
      setError('An error occurred while generating image prompts. Please try again.');
      console.error("Error generating image prompts:", err);
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
                <div>
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
              <button className="next-button" onClick={() => setCurrentStep(5)}>
                Approve Prompts
              </button>
              <button className="edit-button" onClick={() => generateImagePrompts(draft)}>
                Request New Prompts
              </button>
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
