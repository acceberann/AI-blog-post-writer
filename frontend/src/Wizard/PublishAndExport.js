import React from 'react';

const PublishAndExport = ({ finalDraft, selectedImage }) => {
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([finalDraft], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "blog_post.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(finalDraft).then(() => {
      alert("Blog post copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  const handleSendToCMS = () => {
    alert("Feature to send directly to CMS is coming soon!");
  };

  return (
    <div className="publish-container">
      <h2>Final Review & Publish Options</h2>
      <div className="final-content">
        <p>{finalDraft}</p>
        {selectedImage && (
          <div className="selected-image">
            <img src={selectedImage.url} alt="Selected Visual for Blog Post" />
          </div>
        )}
      </div>
      <div className="publish-options">
        <button onClick={handleDownload}>Download as Text File</button>
        <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
        <button onClick={handleSendToCMS}>Send to CMS</button>
      </div>
    </div>
  );
};

export default PublishAndExport;
