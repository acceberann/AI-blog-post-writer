import React, { useState } from 'react';
import axios from 'axios';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import DOMPurify from 'dompurify';
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
