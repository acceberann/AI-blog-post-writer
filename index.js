const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require('openai');

const PORT = process.env.PORT || 3000;

// Set up OpenAI API configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

// Endpoint to generate a blog draft using the stored brand voice profile
app.post('/generate-blog', async (req, res) => {
    const { topic } = req.body;

    try {
        // Ensure that the brand voice profile exists before generating the blog
        if (!brandVoiceProfile) {
            return res.status(400).json({ error: "Brand voice profile not found. Please create the brand voice profile first." });
        }

        // Incorporate the stored brand voice profile into the prompt
        const prompt = `
        Use the following brand voice profile when generating content:
        Brand Personality: ${brandVoiceProfile.brandPersonality}
        Tone of Voice: ${brandVoiceProfile.toneOfVoice}
        Point of View: ${brandVoiceProfile.pointOfView}
        Key Messaging Points: ${brandVoiceProfile.keyMessagingPoints}
        Target Audience: ${brandVoiceProfile.targetAudience}
        Specific Language or Jargon: ${brandVoiceProfile.specificLanguage}

        Now, create a detailed outline for a blog post about "${topic}" using the above brand voice context.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
            max_tokens: 500,
            temperature: 0.7,
        });

        const outline = response.choices[0].message.content.trim();
        res.status(200).json({ outline });
    } catch (error) {
        console.error("Error generating blog content:", error);
        res.status(500).json({ error: "An error occurred while generating the blog content" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
