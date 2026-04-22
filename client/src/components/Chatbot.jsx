import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant for Arba Minch Tourism. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('price') || msg.includes('cost')) {
      return "💰 Our services:\n• Airport Pickup: $25\n• City Tour: $45/day\n• Boat Safari: $35\n• Translation: $15/hour\n• Hotel Booking: Free service!";
    }
    if (msg.includes('attraction') || msg.includes('see')) {
      return "🏞️ Top attractions in Arba Minch:\n1. Lake Chamo (crocodiles & hippos)\n2. Nech Sar National Park\n3. Forty Springs\n4. Dorze Village\n5. Bridge of God";
    }
    if (msg.includes('hotel')) {
      return "🏨 We can book hotels in Arba Minch:\n• Luxury: Paradise Lodge, Haile Resort\n• Mid-range: Swaynes Hotel\n• Budget: Arba Minch Hotel\nWould you like me to help you book?";
    }
    if (msg.includes('translate') || msg.includes('language')) {
      return "🗣️ We offer 24/7 English-Amharic translation service. Our live chat has built-in translation. How can I help you communicate?";
    }
    if (msg.includes('airport') || msg.includes('pickup')) {
      return "✈️ Yes! We offer airport pickup service. Just provide your flight details and we'll be there with a welcome sign. Price: $25 per person.";
    }
    if (msg.includes('best time')) {
      return "📅 The best time to visit Arba Minch is October to March (dry season). Weather is pleasant for boat tours and wildlife viewing.";
    }
    
    return "I'm here to help! You can ask me about:\n• Service prices 💰\n• Attractions 🏞️\n• Hotels 🏨\n• Translation 🗣️\n• Airport pickup ✈️\n• Best time to visit 📅\n\nOr you can chat with our human guides 24/7!";
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      const response = getBotResponse(input);
      setMessages(prev => [...prev, { text: response, isBot: true }]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition z-50"
      >
        <MessageCircle size={24} />
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 to-emerald-800 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold">AI Assistant 🤖</h3>
              <p className="text-xs text-green-200">Online - Ask me anything!</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1">
              <X size={20} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.isBot 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-green-600 text-white'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSend}
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
