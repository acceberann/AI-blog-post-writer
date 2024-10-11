import React, { useState } from 'react';
import axios from 'axios';

const HumanReview = ({ draft, onNext }) => {
  const [userDraft, setUserDraft] = useState(draft);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    setUserDraft(e.target.value);
  };

  const handleSave = () => {
    setEditing(false);
  };

  const handleRequestTweaks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/tweak-draft', {
        draft: userDraft,
      });
      setUserDraft(response.data.updatedDraft);
      setLoading(false);
    } catch (err) {
      console.error('Error requesting tweaks:', err);
      setError('There was an error requesting tweaks. Please try again.');
      setLoading(false);
    }
  };

  const handleProceed = () => {
    onNext(userDraft); // Move to the next step with the final draft
  };

  return (
    <div className="human-review-container">
      <h2>Human Review and Polishing</h2>
      {loading ? (
        <p>Processing your request, please wait...</p>
      ) : (
        <div>
          {editing ? (
            <textarea
              value={userDraft}
              onChange={handleInputChange}
              rows={20}
              cols={80}
              className="edit-draft-textarea"
            />
          ) : (
            <div className="review-draft-container">
              <p>{userDraft}</p>
            </div>
          )}
          {error && <p className="error">{error}</p>}
          <div className="review-controls">
            <button onClick={handleEditToggle}>{editing ? 'Save Edits' : 'Edit Draft'}</button>
            {editing && <button onClick={handleSave}>Finish Editing</button>}
            {!editing && <button onClick={handleRequestTweaks}>Request Tweaks from AI</button>}
            {!editing && <button onClick={handleProceed}>Proceed to Final Review</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default HumanReview;
