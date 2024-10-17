import React from 'react';
import './App.css'; // Continue using existing styles

const Sidebar = ({ currentStep }) => {
  const steps = ['Keyword Selection', 'Outline Generation', 'Draft Generation', 'Image Prompts'];

  return (
    <div className="sidebar">
      <ul>
        {steps.map((step, index) => (
          <li key={index} className={currentStep === index + 1 ? 'active' : ''}>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
