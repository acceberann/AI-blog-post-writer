import React from 'react';
import './App.css';
import './index.css'; // Ensure the updated CSS is referenced
import WizardUI from './WizardUI'; // Import the WizardUI component

function App() {
  return (
    <div className="App">
    <img src="https://promptsincluded.com/wp-content/uploads/2024/02/logo-horizontal-hi-res.png" width="50%"></img>
      <header className="App-header">
        <h1>Welcome to the AI Blog Post Writer</h1>
        <p className="description">
          This tool will guide you through creating a ready-to-publish blog post based on any keyword you choose, written in your unique brand voice.
        </p>
      </header>
      <WizardUI /> {/* Include the wizard interface */}
    </div>
  );
}

export default App;
