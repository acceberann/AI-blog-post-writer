const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

let openai;
try {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
} catch (error) {
    console.error("Error configuring OpenAI API:", error);
}

// Generate outline endpoint
router.post('/generate-outline', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: "Topic is required." });
    }

    try {
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

module.exports = router;
