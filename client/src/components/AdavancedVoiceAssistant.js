import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Typography, List, Tag, Alert, Space, Tabs } from 'antd';
import { AudioOutlined, AudioMutedOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import '../resources/VoiceAssistant.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const AdvancedVoiceAssistant = ({ onExpenseAdd, categories = [] }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [processingStatus, setProcessingStatus] = useState('idle'); // idle, processing, success, error
  const recognitionRef = useRef(null);
  const defaultCategories = ['Food', 'Transportation', 'Entertainment', 'Housing', 'Utilities', 'salary', 'freelance', 'food', 'entertainment', 'investment', 'travel', 'education', 'medical', 'tax', 'Other'];
  const allCategories = [...new Set([...defaultCategories, ...categories])];

  // Speech synthesis for voice feedback
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setFeedback('Speech recognition is not supported in your browser.');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setFeedback('Listening...');
      setIsListening(true);
      setProcessingStatus('idle');
    };

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      setTranscript(currentTranscript);
      
      // Only process final results
      if (event.results[0].isFinal) {
        processVoiceCommand(currentTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setFeedback(`Error occurred: ${event.error}`);
      setIsListening(false);
      setProcessingStatus('error');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (processingStatus !== 'success' && processingStatus !== 'error') {
        setFeedback('Listening stopped.');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Process the voice command to extract transaction details
  const processVoiceCommand = (command) => {
    setProcessingStatus('processing');
    setFeedback('Processing: ' + command);
    console.log('Processing voice command:', command);
    
    // Handle help command
    if (/help|what can I say/i.test(command)) {
      const helpText = "You can say phrases like 'Add expense of 25 dollars for groceries', 'Spent 50 on dinner', 'Record income of 1000 dollars from salary', or 'Record 30 dollars for gas in transportation'";
      setFeedback(helpText);
      speak(helpText);
      setProcessingStatus('idle');
      return;
    }
    
    // Common patterns for transaction descriptions
    const patterns = [
      // Pattern 1: "Add/create/new/record expense/income of X dollars for Y in Z"
      /(?:add|create|new|record|log)?\s+(?:an?\s+)?(?:expense|income|transaction|payment|bill|earning|salary)?\s+(?:of|for|on)?\s+(\d+(?:\.\d+)?)\s+(?:dollars|rupees|rs\.?|inr|\$)?\s+(?:for|on|from)?\s+(.?)(?:\s+(?:in|under|category|from|as)\s+(.?))?$/i,
      
      // Pattern 2: "Spent/earned X on/from Y in Z"
      /(?:i\s+)?(?:spent|paid|used|earned|received|got)\s+(\d+(?:\.\d+)?)\s+(?:dollars|rupees|rs\.?|inr|\$)?\s+(?:for|on|from)\s+(.?)(?:\s+(?:in|under|category|from|as)\s+(.?))?$/i,
      
      // Pattern 3: Simple "X dollars for/from Y"
      /(\d+(?:\.\d+)?)\s+(?:dollars|rupees|rs\.?|inr|\$)?\s+(?:for|on|from)\s+(.?)(?:\s+(?:in|under|category|from|as)\s+(.?))?$/i,
    ];
    
    // Income detection patterns
    const incomePatterns = [
      /income|earning|salary|received|got|from salary|from freelance|from investment/i
    ];
    
    let matchFound = false;
    let transactionData = null;
    
    for (const pattern of patterns) {
      const match = command.match(pattern);
      console.log('Trying pattern:', pattern, 'Result:', match);
      if (match) {
        matchFound = true;
        const amount = parseFloat(match[1]);
        const title = match[2].trim();
        
        // Try to find the closest matching category
        let category = "Other";
        if (match[3]) {
          const userCategory = match[3].trim().toLowerCase();
          category = findClosestCategory(userCategory, allCategories) || "Other";
        }
        
        // Determine transaction type (income or expense)
        let type = "expense";  // Default to expense
        for (const incomePattern of incomePatterns) {
          if (incomePattern.test(command) || incomePattern.test(title) || incomePattern.test(category)) {
            type = "income";
            break;
          }
        }
        
        // Special case for common income categories
        if (category.toLowerCase() === "salary" || 
            category.toLowerCase() === "freelance" || 
            category.toLowerCase() === "investment") {
          type = "income";
        }
        
        if (!isNaN(amount) && title) {
          transactionData = {
            title,
            amount,
            category,
            type,
            date: new Date().toISOString().slice(0, 10) // Today's date in YYYY-MM-DD format
          };
          console.log('Extracted transaction data:', transactionData);
          break;
        }
      }
    }
    
    // If no pattern matched, try simpler fallback parsing
    if (!matchFound) {
      // Try to extract just a number and a following word
      const simpleMatch = command.match(/(\d+(?:\.\d+)?)\s+(?:dollars|rupees|rs\.?|inr|\$)?\s+(?:for|on|from)?\s+(.*)/i);
      if (simpleMatch) {
        const amount = parseFloat(simpleMatch[1]);
        const title = simpleMatch[2].trim();
        
        // Determine transaction type (income or expense)
        let type = "expense";  // Default to expense
        for (const incomePattern of incomePatterns) {
          if (incomePattern.test(command) || incomePattern.test(title)) {
            type = "income";
            break;
          }
        }
        
        if (!isNaN(amount) && title) {
          transactionData = {
            title,
            amount,
            category: "Other",
            type,
            date: new Date().toISOString().slice(0, 10)
          };
          console.log('Used fallback parsing, extracted:', transactionData);
          matchFound = true;
        }
      }
    }
    
    if (matchFound && transactionData) {
      try {
        onExpenseAdd(transactionData);
        const transactionType = transactionData.type === "income" ? "income" : "expense";
        const successMessage = `Added ${transactionType}: ${transactionData.title} for ${transactionData.amount} in ${transactionData.category}`;
        setFeedback(successMessage);
        speak(successMessage);
        setProcessingStatus('success');
      } catch (error) {
        console.error('Error in onExpenseAdd callback:', error);
        const errorMessage = 'There was an error adding your transaction. Please try again.';
        setFeedback(errorMessage);
        speak(errorMessage);
        setProcessingStatus('error');
      }
    } else {
      const errorMessage = 'I could not understand the transaction command. Try saying something like "Add expense of 50 dollars for groceries" or "Record income of 1000 dollars from salary"';
      setFeedback(errorMessage);
      speak(errorMessage);
      setProcessingStatus('error');
    }
  };

  // Find the closest matching category using string similarity
  const findClosestCategory = (input, categories) => {
    input = input.toLowerCase();
    let closestMatch = null;
    let highestSimilarity = 0;
    
    for (const category of categories) {
      const similarity = stringSimilarity(input, category.toLowerCase());
      if (similarity > highestSimilarity && similarity > 0.6) { // Threshold for matching
        highestSimilarity = similarity;
        closestMatch = category;
      }
    }
    
    return closestMatch;
  };
  
  // Simple string similarity function (Levenshtein distance-based)
  const stringSimilarity = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    
    // Quick exact match check
    if (str1 === str2) return 1;
    if (len1 === 0 || len2 === 0) return 0;
    
    // Check if one is contained in the other
    if (str1.includes(str2) || str2.includes(str1)) {
      return 0.8;
    }
    
    // Check for common starting substring
    let commonPrefix = 0;
    const minLength = Math.min(len1, len2);
    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) {
        commonPrefix++;
      } else {
        break;
      }
    }
    
    return commonPrefix / Math.max(len1, len2);
  };

  const startListening = () => {
    setTranscript('');
    setFeedback('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setFeedback('Error starting voice recognition. Please try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  };

  // Get status for Alert type
  const getAlertType = () => {
    switch (processingStatus) {
      case 'processing': return 'info';
      case 'success': return 'success';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  return (
    <Card 
      title={<Title level={4}><AudioOutlined /> Voice Assistant</Title>}
      className="voice-assistant-card"
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Button 
            type="primary" 
            icon={<AudioOutlined />} 
            onClick={startListening}
            disabled={isListening}
          >
            Start Voice Input
          </Button>
          
          {isListening && (
            <Button 
              danger
              icon={<AudioMutedOutlined />}
              onClick={stopListening}
            >
              Stop
            </Button>
          )}
        </Space>
        
        {/* Voice visualizer */}
        <div className={`voice-visualizer ${isListening ? 'active' : ''}`}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bar"></div>
          ))}
        </div>
        
        <Card 
          size="small" 
          title="You said:" 
          style={{ marginTop: 16 }}
          className="transcript-card"
        >
          <Text>{transcript || "(Start speaking after clicking the button)"}</Text>
        </Card>
        
        {feedback && (
          <Alert
            message={feedback}
            type={getAlertType()}
            showIcon
          />
        )}
        
        <Tabs defaultActiveKey="1">
          <TabPane tab="Expense Examples" key="1">
            <List
              size="small"
              bordered
              dataSource={[
                "Add expense of 25 dollars for groceries",
                "Spent 50 on dinner",
                "Record 30 dollars for gas in transportation",
                "100 dollars for rent in housing"
              ]}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </TabPane>
          <TabPane tab="Income Examples" key="2">
            <List
              size="small"
              bordered
              dataSource={[
                "Add income of 1000 dollars from salary",
                "Received 500 for freelance work",
                "Record 200 dollars from investment",
                "Got 300 dollars as bonus"
              ]}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </TabPane>
          <TabPane tab="Categories" key="3">
            <div>
              <Text strong>Available categories: </Text>
              <div style={{ margin: '10px 0' }}>
                {allCategories.map(category => (
                  <Tag color="blue" key={category} style={{ margin: 4 }}>{category}</Tag>
                ))}
              </div>
            </div>
          </TabPane>
        </Tabs>
        
        <Paragraph>
          <Text strong>Tip:</Text> Say "help" or "what can I say" for assistance
        </Paragraph>
      </Space>
    </Card>
  );
};

export default AdvancedVoiceAssistant;