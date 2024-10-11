import React from 'react';
import './App.css';
import './index.css'; // Ensure the updated CSS is referenced
import WizardUI from './WizardUI'; // Import the WizardUI component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the AI Blog Post Writer</h1>
        <p className="description">
          This tool will guide you through keyword selection, outline creation, and drafting an AI-powered blog post.
        </p>
      </header>
      <WizardUI /> {/* Include the wizard interface */}
    </div>
  );
}

export default App;
