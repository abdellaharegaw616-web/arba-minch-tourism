import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const Translator = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [translateTo, setTranslateTo] = useState('am');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      if (user) {
        newSocket.emit('user-join', user.id);
      }
    });

    newSocket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('receive-message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => newSocket.close();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageData = {
      from: user?.id,
      fromName: user?.name,
      to: 'guide',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    socket.emit('send-message', messageData);
    setMessages(prev => [...prev, { ...messageData, isOwn: true }]);
    setInputMessage('');
  };

  // eslint-disable-next-line no-unused-vars
  const translateText = async (text, targetLang) => {
    // Simple translation simulation - currently unused but available for future implementation
    const translations = {
      'How much is the boat tour?': 'የጀልባ ጉብኝት ምን ያህል ነው?',
      'Where can I find a good hotel?': 'ጥሩ ሆቴል የት አገኛለሁ?',
      'Take me to the airport': 'ወደ አውሮፕላን ማረፊያ ውሰደኝ',
      'I need a guide': 'መሪ ይፈልጋል',
      'Thank you': 'አመሰግናለሁ'
    };
    return translations[text] || `${text} (translated to ${targetLang})`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 to-emerald-800 text-white p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">Live Chat & Translation</h1>
                <p className="text-sm text-green-200">24/7 Support Available</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm">{isConnected ? 'Connected' : 'Connecting...'}</span>
              </div>
            </div>
          </div>

          {/* Online Users */}
          <div className="bg-gray-50 border-b p-2 text-sm text-gray-600">
            <span>👥 Online: {onlineUsers.length} people</span>
          </div>

          {/* Translation Controls */}
          <div className="bg-gray-100 p-3 flex justify-end space-x-2">
            <select value={translateTo} onChange={(e) => setTranslateTo(e.target.value)} className="border rounded px-3 py-1 text-sm">
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
            </select>
            <span className="text-xs text-gray-500 self-center">Auto-translate enabled</span>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            <div className="text-center text-gray-400 text-sm mb-4">
              Welcome to Arba Minch Tourist Assistance! 🇪🇹
              <br />
              Our team will respond within minutes.
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md rounded-lg p-3 ${msg.from === user?.id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.from !== user?.id && (
                    <p className="text-xs font-bold mb-1 text-green-700">{msg.fromName}</p>
                  )}
                  <p>{msg.message}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message... (English or Amharic)"
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                Send
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              💡 Tip: Our team speaks English and Amharic. Type in any language!
            </p>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-xl shadow p-4">
          <h3 className="font-bold mb-2">📋 Quick Help</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button className="text-left p-2 hover:bg-gray-50 rounded" onClick={() => setInputMessage("How much is boat tour?")}>
              🚤 Boat tour price?
            </button>
            <button className="text-left p-2 hover:bg-gray-50 rounded" onClick={() => setInputMessage("Where can I find a good hotel?")}>
              🏨 Hotel recommendation?
            </button>
            <button className="text-left p-2 hover:bg-gray-50 rounded" onClick={() => setInputMessage("Take me to the airport")}>
              ✈️ Airport pickup?
            </button>
            <button className="text-left p-2 hover:bg-gray-50 rounded" onClick={() => setInputMessage("I need a guide")}>
              👨‍💼 Need a guide?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;
