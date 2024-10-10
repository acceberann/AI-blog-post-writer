const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const { OpenAI } = require('openai');
const cors = require('cors'); // Import CORS library

const PORT = process.env.PORT || 3000;

// Set up OpenAI API configuration
let openai;
try {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
} catch (error) {
    console.error("Error configuring OpenAI API:", error);
}

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

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
app.post('/create-brand-voice', (req, res) => {
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

// Updated /generate-outline endpoint to generate an outline without requiring a brand voice profile
app.post('/generate-outline', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: "Topic is required." });
    }

    try {
        // Create a prompt to generate the blog outline based on the provided topic
        const prompt = `Create a detailed blog outline on the topic of "${topic}". The outline should include multiple sections, subsections, and points to cover the topic thoroughly. Structure it using Roman numerals (I, II, III, etc.) for main sections, capital letters (A, B, C, etc.) for subsections, and numbers (1, 2, 3, etc.) for finer details.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
            temperature: 0.7,
        });

        const outline = completion.choices[0].message.content.trim();
        res.status(200).json({ outline });
    } catch (error) {
        console.error("Error generating outline:", error);
        res.status(500).json({ error: "An error occurred while generating the outline" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});