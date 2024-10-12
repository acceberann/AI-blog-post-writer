
import React, { useState } from 'react';
import KeywordSelection from './KeywordSelection';
import OutlineGeneration from './OutlineGeneration';
import BrandVoiceCheck from './BrandVoiceCheck';
import BlogDraftGeneration from './BlogDraftGeneration';
import HumanReview from './HumanReview';
import FinalReview from './FinalReview';
import PublishAndExport from './PublishAndExport';

const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [outline, setOutline] = useState('');
  const [brandVoiceProfile, setBrandVoiceProfile] = useState(null);
  const [draft, setDraft] = useState('');
  const [finalDraft, setFinalDraft] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleNextStep = (data) => {
    console.log("Handling next step. Current step:", currentStep, "Data received:", data);
    switch (currentStep) {
      case 1:
        setKeyword(data);
        console.log("Proceeding to Step 2: Outline Generation");
        setCurrentStep(2);
        break;
      case 2:
        setOutline(data);
        console.log("Proceeding to Step 3: BrandVoiceCheck with outline:", data);
        setCurrentStep(3);
        break;
      case 3:
        setBrandVoiceProfile(data);
        setCurrentStep(4);
        break;
      case 4:
        setDraft(data);
        setCurrentStep(5);
        break;
      case 5:
        setFinalDraft(data);
        setCurrentStep(6);
        break;
      case 6:
        setFinalDraft(data.finalDraft);
        setSelectedImage(data.selectedImage);
        setCurrentStep(7); // Move to the publish/export step
        break;
      default:
        break;
    }
  };

  console.log("Current step in wizard:", currentStep);

  return (
    <div className="wizard-container">
      {currentStep === 1 && <KeywordSelection onNext={handleNextStep} />}
      {currentStep === 2 && <OutlineGeneration keyword={keyword} onNext={handleNextStep} />}
      {currentStep === 3 && <BrandVoiceCheck onNext={handleNextStep} />}
      {currentStep === 4 && <BlogDraftGeneration outline={outline} brandVoiceProfile={brandVoiceProfile} onNext={handleNextStep} />}
      {currentStep === 5 && <HumanReview draft={draft} onNext={handleNextStep} />}
      {currentStep === 6 && <FinalReview draft={finalDraft} onNext={handleNextStep} />}
      {currentStep === 7 && <PublishAndExport finalDraft={finalDraft} selectedImage={selectedImage} />}
    </div>
  );
};

export default Wizard;