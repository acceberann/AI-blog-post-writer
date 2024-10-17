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
let brandVoiceProfile = null; // To store brand voice profile data
const questions = [
    "What is the name of your brand?",
    "How would you describe the core personality traits of the brand, such as friendly, professional, innovative, traditional, authoritative, playful, compassionate, etc.?",
    "What tone of voice do you aim to maintain in your communications? (e.g., formal, informal, conversational, technical, educational, etc. This helps in adjusting the level of formality and approachability in the communication.)",
    "What is the point of view the author of your content should take? (first person, third person, singular, plural, etc.)",
    "What are the key messages or themes that should always be conveyed in your brand's communication? List the key messages that could include unique value propositions, taglines, or important thematic elements.",
    "Who is the primary audience for your brand? Define the primary demographic and psychographic characteristics of the audience the brand aims to engage, such as age group, professional background, interests, and emotional drivers.",
    "Are there any specific terms, phrases, or jargon your brand uses that should be included in communications?"
];

let currentQuestionIndex = 0;

// Endpoint to create and store the brand voice profile
app.post('/create-brand-voice', (req, res) => {
    const userResponse = req.body.answer;

    // Initialize brand voice profile if starting fresh
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

    // Store user's answer to the current question
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

    // If all questions are answered, send confirmation and reset the index
    if (currentQuestionIndex >= questions.length) {
        currentQuestionIndex = 0;
        res.status(200).json({ message: "Brand voice profile successfully created and stored!" });
    } else {
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
        const prompt = `Create a comprehensive blog outline on the topic of '${topic}'. The outline should include a clear introduction, multiple detailed sections and subsections, and a conclusion. Each section should build logically, covering the key points necessary to give a thorough explanation. Structure the outline using Roman numerals (I, II, III, etc.) for main sections, capital letters (A, B, C, etc.) for subsections, and numbers (1, 2, 3, etc.) for supporting details. Ensure the outline is well-balanced and complete enough for a long-form blog post.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 5000,
            temperature: 0.7,
        });

        const outline = response.choices[0].message.content.trim();
        res.status(200).json({ outline });
    } catch (error) {
        console.error("Error generating outline:", error);
        res.status(500).json({ error: "An error occurred while generating the outline" });
    }
});

app.post('/regenerate-outline', async (req, res) => {
    const { topic, suggestions } = req.body;

    if (!topic || !suggestions) {
        return res.status(400).json({ error: "Both topic and suggestions are required." });
    }

    try {
        const prompt = `Based on the topic "${topic}", and using the following user suggestions:
        ${suggestions}
        
        Generate a refined blog post outline. The outline should include the provided '${suggestions}'to create an outline with a clear introduction, multiple detailed sections and subsections, and a conclusion. Each section should build logically, covering the key points necessary to give a thorough explanation. Structure the outline using Roman numerals (I, II, III, etc.) for main sections, capital letters (A, B, C, etc.) for subsections, and numbers (1, 2, 3, etc.) for supporting details. Ensure the outline is well-balanced and complete enough for a long-form blog post.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 5000,
            temperature: 0.7,
        });

        const newOutline = response.choices[0].message.content.trim();
        res.status(200).json({ outline: newOutline });
    } catch (error) {
        console.error("Error generating new outline:", error);
        res.status(500).json({ error: "An error occurred while generating the new outline." });
    }
});

app.post('/generate-draft', async (req, res) => {
    const { outline, topic } = req.body;

    if (!outline || !topic) {
        return res.status(400).json({ error: "Both outline and topic are required." });
    }

    try {
        const prompt = `Using the following outline, write a full, detailed blog post. Each section should be expanded with engaging content, including clear explanations, examples, and, where applicable, relevant stories or case studies. Ensure smooth transitions between sections and paragraphs, making the post easy to read and cohesive. The post should have a narrative style that maintains the reader’s interest. In addition, optimize the post for search by incorporating the topic '${topic}' and important semantic keywords associated with it. Ensure the post is structured logically, flowing from introduction to conclusion, and keep the tone professional but approachable. Outline: ${outline}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4", // Switch to GPT-4
            messages: [{ role: "user", content: prompt }],
            max_tokens: 5000, // Increase the token limit
            temperature: 0.7,
        });

        const draft = response.choices[0].message.content.trim();
        res.status(200).json({ draft });
    } catch (error) {
        console.error("Error generating draft:", error);
        res.status(500).json({ error: "An error occurred while generating the draft" });
    }
});

app.post('/regenerate-draft', async (req, res) => {
    const { outline, suggestions } = req.body;

    if (!outline || !suggestions) {
        return res.status(400).json({ error: "Both outline and suggestions are required." });
    }

    try {
        const prompt = `Using the following outline:
        ${outline}
        
        And these user suggestions:
        ${suggestions}
        
        Generate a refined blog post draft.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 5000, // Adjust based on desired length
            temperature: 0.7,
        });

        const newDraft = response.choices[0].message.content.trim();
        res.status(200).json({ draft: newDraft });
    } catch (error) {
        console.error("Error generating new draft:", error);
        res.status(500).json({ error: "An error occurred while generating the new draft." });
    }
});

app.post('/generate-image-prompts', async (req, res) => {
    const { draft } = req.body;

    if (!draft) {
        return res.status(400).json({ error: "Draft is required." });
    }

    try {
        // Create a prompt to generate 5 image ideas based on the draft
        const prompt = `Using the following blog post, generate 5 different creative image ideas that could be used as featured images or internal blog post images:
        ${draft}
        
        Each image prompt should be clear and specific, providing enough details for an artist or AI model to create the image.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 5000, // Enough space for 5 prompts
            temperature: 0.7,
        });

        const imagePrompts = response.choices[0].message.content.trim().split("\n").filter(Boolean);
        res.status(200).json({ prompts: imagePrompts });
    } catch (error) {
        console.error("Error generating image prompts:", error);
        res.status(500).json({ error: "An error occurred while generating the image prompts" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});