const express = require('express');
const router = express.Router();

// Store for brand voice profile data
let brandVoiceProfile = null;

const questions = [
    "What is the name of your brand?",
    "How would you describe the core personality traits of the brand (e.g., friendly, professional, innovative)?",
    "What tone of voice do you aim to maintain in your communications (e.g., formal, informal, conversational)?",
    "What is the point of view the author of your content should take (e.g., first person, third person)?",
    "What are the key messages or themes that should always be conveyed in your brand's communication?",
    "Who is the primary audience for your brand? Describe the demographic and psychographic characteristics.",
    "Are there any specific terms, phrases, or jargon your brand uses that should be included in communications?"
];

let currentQuestionIndex = 0;

// Endpoint to create and store the brand voice profile
router.post('/create', (req, res) => {
    const userResponse = req.body.answer;

    // Initialize brand voice profile data if starting fresh
    if (!brandVoiceProfile) {
        brandVoiceProfile = {
            brandName: '',
            brandPersonality: '',
            toneOfVoice: '',
            pointOfView: '',
            keyMessagingPoints: '',
            targetAudience: '',
            specificLanguage: ''
        };
    }

    // Store the user's answer to the current question
    if (currentQuestionIndex > 0) {
        switch (currentQuestionIndex) {
            case 1:
                brandVoiceProfile.brandName = userResponse;
                break;
            case 2:
                brandVoiceProfile.brandPersonality = userResponse;
                break;
            case 3:
                brandVoiceProfile.toneOfVoice = userResponse;
                break;
            case 4:
                brandVoiceProfile.pointOfView = userResponse;
                break;
            case 5:
                brandVoiceProfile.keyMessagingPoints = userResponse;
                break;
            case 6:
                brandVoiceProfile.targetAudience = userResponse;
                break;
            case 7:
                brandVoiceProfile.specificLanguage = userResponse;
                break;
        }
    }

    // If all questions have been asked, send confirmation to the user
    if (currentQuestionIndex >= questions.length) {
        currentQuestionIndex = 0; // Reset for the next user
        res.status(200).json({ message: "Brand voice profile has been successfully created and stored!" });
    } else {
        // Send the next question to the user
        currentQuestionIndex++;
        res.status(200).json({ question: questions[currentQuestionIndex - 1] });
    }
});

module.exports = router;