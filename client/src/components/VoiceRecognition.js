import React, { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import axios from 'axios';

const VoiceRecognition = ({ onTransactionAdded }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        processCommand(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        message.error('Error recognizing speech. Please try again.');
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      message.error('Speech recognition is not supported in your browser');
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      setTranscript('');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const processCommand = async (command) => {
    try {
      // Pattern for "Spend X on Y" or similar expense commands
      const expensePattern = /(?:spend|add expense of|record|spent)?\s*(?:[\$])?(\d+(?:\.\d+)?)\s*(?:dollars|on|for)?\s*(.+)/i;
      const match = command.match(expensePattern);
      
      if (match) {
        const amount = parseFloat(match[1]);
        const category = match[2].trim().toLowerCase();
        
        if (!isNaN(amount) && category) {
          await addTransaction(amount, category);
          message.success(`Added expense: $${amount} for ${category}`);
        } else {
          message.warning('Could not understand command format');
        }
      } else {
        message.warning('Could not recognize expense command');
      }
    } catch (error) {
      console.error('Error processing command:', error);
      message.error('Failed to process command');
    }
  };

  const addTransaction = async (amount, category) => {
    try {
      // Create transaction object
      const transaction = {
        amount: -amount, // Negative for expenses
        category,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        type: 'expense',
        reference: category.substring(0, 5) + Math.floor(Math.random() * 1000)
      };
      
      // Get user token from localStorage
      const token = JSON.parse(localStorage.getItem('ExpenseTracker')).token;
      
      // Send to backend
      const response = await axios.post('/api/transactions/add-transaction', transaction, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Call callback to refresh transaction list in parent component
      if (onTransactionAdded) {
        onTransactionAdded(response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  return (
    <div className="voice-recognition">
      <div className="voice-controls">
        <Button 
          type="primary" 
          onClick={isListening ? stopListening : startListening}
          danger={isListening}
        >
          {isListening ? 'Stop Listening' : 'Start Voice Command'}
        </Button>
      </div>
      
      {isListening && (
        <div className="listening-indicator">
          Listening...
        </div>
      )}
      
      {transcript && (
        <div className="transcript">
          <strong>You said:</strong> {transcript}
        </div>
      )}
      
      <div className="examples">
        <h4>Example commands:</h4>
        <ul>
          <li>Spend $50 on groceries</li>
          <li>Add expense of 25 dollars for groceries</li>
          <li>Record 30 dollars for gas in transportation</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceRecognition;