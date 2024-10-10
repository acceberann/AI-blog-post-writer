import React, { useState } from 'react';
import axios from 'axios';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import DOMPurify from 'dompurify'; // Import DOMPurify
import './App.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      position: 'left',
      type: 'text',
      text: "Welcome to the AI Blog Post Generator! Let's get started. What is the main keyword or topic for your blog post?",
      date: new Date(),
      className: 'initial-message-container',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [conversationState, setConversationState] = useState('ASK_KEYWORD');
  const [outline, setOutline] = useState('');
  const [brandVoiceProfile, setBrandVoiceProfile] = useState(null); // Track the brand voice profile

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        {
          position: 'right',
          type: 'text',
          text: inputValue,
          date: new Date(),
        },
      ]);

      handleConversationFlow(inputValue.trim());
      setInputValue('');
    }
  };

  const handleConversationFlow = async (userInput) => {
    switch (conversationState) {
      case 'ASK_KEYWORD':
        // Generate initial outline with LLM based on the keyword by making a request to the backend
        const initialOutline = await generateOutlineWithBackend(userInput);
        setOutline(initialOutline);

        // Display the entire outline as a single message
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            position: 'left',
            type: 'text',
            text: `Here's a draft outline for your blog post about "${userInput}":\n\n${initialOutline}`,
            date: new Date(),
          },
          {
            position: 'left',
            type: 'text',
            text: "Please review the outline and let me know if you'd like to make any changes or if it looks good to proceed.",
            date: new Date(),
          },
        ]);
        setConversationState('OUTLINE_REVIEW');
        break;

      case 'OUTLINE_REVIEW':
        if (userInput.toLowerCase().includes('looks good') || userInput.toLowerCase().includes('proceed')) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              position: 'left',
              type: 'text',
              text: "Great! Let's check your brand voice profile before we start drafting the blog post.",
              date: new Date(),
            },
          ]);
          checkOrCreateBrandVoiceProfile(); // Call function to handle brand voice profile check
        } else {
          // If the user requests changes, refine the outline using the LLM
          const refinedOutline = await refineOutlineWithLLM(outline, userInput);
          setOutline(refinedOutline);

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              position: 'left',
              type: 'text',
              text: `Here's the updated outline based on your feedback:\n\n${refinedOutline}`,
              date: new Date(),
            },
            {
              position: 'left',
              type: 'text',
              text: "Let me know if you're happy with this or if you need more adjustments.",
              date: new Date(),
            },
          ]);
        }
        break;

      case 'CREATE_BRAND_VOICE_PROFILE':
        await createBrandVoiceProfile(userInput);
        break;

      default:
        break;
    }
  };

  const createBrandVoiceProfile = async (userInput) => {
    try {
      const response = await axios.post('http://localhost:3000/create-brand-voice', { answer: userInput });
      if (response.data.question) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            position: 'left',
            type: 'text',
            text: response.data.question,
            date: new Date(),
          },
        ]);
      } else if (response.data.message) {
        setBrandVoiceProfile(true);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            position: 'left',
            type: 'text',
            text: response.data.message,
            date: new Date(),
          },
        ]);
        setConversationState('DRAFT_PHASE');
        generateBlogDraftWithLLM();
      }
    } catch (error) {
      console.error("Error creating brand voice profile:", error);
    }
  };

  const checkOrCreateBrandVoiceProfile = () => {
    if (brandVoiceProfile) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          position: 'left',
          type: 'text',
          text: "I see that we already have your brand voice profile on file. We'll use that to create your blog post draft.",
          date: new Date(),
        },
      ]);
      setConversationState('DRAFT_PHASE');
      generateBlogDraftWithLLM();
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          position: 'left',
          type: 'text',
          text: "It looks like we don't have a brand voice profile yet. Let's create one to ensure that your blog post aligns with your brand's voice.",
          date: new Date(),
        },
        {
          position: 'left',
          type: 'text',
          text: "First, what is the name of your brand?",
          date: new Date(),
        },
      ]);
      setConversationState('CREATE_BRAND_VOICE_PROFILE');
    }
  };

  // Function to generate the initial outline with LLM based on the keyword through the backend
  const generateOutlineWithBackend = async (keyword) => {
    try {
      const response = await axios.post('http://localhost:3000/generate-outline', { topic: keyword });
      let outline = response.data.outline;

      // Sanitize the content using DOMPurify
      outline = DOMPurify.sanitize(outline);

      return outline;
    } catch (error) {
      console.error("Error generating outline with backend:", error);
      return "There was an error generating the outline. Please try again.";
    }
  };

  // Function to refine the outline with LLM based on user feedback
  const refineOutlineWithLLM = async (currentOutline, userFeedback) => {
    return `${currentOutline}
 - Refined Section based on user input: ${userFeedback}`;
  };

  // Function to generate the blog draft with LLM
  const generateBlogDraftWithLLM = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        position: 'left',
        type: 'text',
        text: "Now that we have the outline and your brand voice profile, I'm drafting your blog post. Please hold on for a moment...",
        date: new Date(),
      },
    ]);
    // Call the LLM API to generate the draft here
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <MessageBox key={index} {...message} className={index === 0 ? 'initial-message-container' : ''} />
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;