import React, { useState } from 'react';
import axios from 'axios';

const FinalReview = ({ draft, onNext }) => {
  const [finalDraft, setFinalDraft] = useState(draft);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageSuggestions, setImageSuggestions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateImages = async () => {
    setLoadingImages(true);
    try {
      const response = await axios.post('http://localhost:3000/generate-images', { draft: finalDraft });
      setImageSuggestions(response.data.images);
      setLoadingImages(false);
    } catch (error) {
      console.error('Error generating image suggestions:', error);
      setLoadingImages(false);
    }
  };

  const handleSelectImage = (image) => {
    setSelectedImage(image);
  };

  const handleProceed = () => {
    // Move to the next step with the final draft and selected image
    onNext({ finalDraft, selectedImage });
  };

  return (
    <div className="final-review-container">
      <h2>Final Review and Visual Suggestions</h2>
      <div className="final-draft-container">
        <p>{finalDraft}</p>
      </div>
      <div className="image-suggestions-container">
        <button onClick={handleGenerateImages} disabled={loadingImages}>
          {loadingImages ? 'Generating Images...' : 'Get Image Suggestions'}
        </button>
        {imageSuggestions.length > 0 && (
          <div className="images-list">
            {imageSuggestions.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Suggested Visual ${index + 1}`}
                onClick={() => handleSelectImage(image)}
                className={`suggested-image ${selectedImage === image ? 'selected' : ''}`}
              />
            ))}
          </div>
        )}
      </div>
      <button onClick={handleProceed}>Proceed to Finalize Blog Post</button>
    </div>
  );
};

export default FinalReview;
