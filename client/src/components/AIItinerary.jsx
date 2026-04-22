import React, { useState } from 'react';
import axios from 'axios';

const AIItinerary = () => {
  const [preferences, setPreferences] = useState({
    days: 3,
    interests: ['nature', 'culture'],
    budget: 50,
    travelStyle: 'balanced',
    groupSize: 2
  });
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const interests = [
    { id: 'nature', label: '🌿 Nature', icon: '🌿' },
    { id: 'wildlife', label: '🦒 Wildlife', icon: '🦒' },
    { id: 'culture', label: '🏺 Culture', icon: '🏺' },
    { id: 'adventure', label: '🚣 Adventure', icon: '🚣' },
    { id: 'photography', label: '📸 Photography', icon: '📸' },
    { id: 'food', label: '🍽️ Food', icon: '🍽️' }
  ];

  const generateItinerary = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/ai/itinerary', preferences);
      setItinerary(response.data.itinerary);
      setStep(2);
    } catch (error) {
      console.error('Error generating itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">✨</span>
          <h1 className="text-3xl font-bold">AI Travel Assistant</h1>
        </div>
        <p className="text-green-100">Get a personalized itinerary powered by AI</p>
      </div>

      {step === 1 && (
        <div className="bg-white dark:bg-dark-100 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Tell us about your trip</h2>
          
          <div className="space-y-6">
            {/* Days */}
            <div>
              <label className="block font-semibold mb-2 flex items-center gap-2">
                <span className="text-xl">📅</span> How many days?
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={preferences.days}
                onChange={(e) => setPreferences({...preferences, days: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>1 day</span>
                <span className="font-bold text-green-600">{preferences.days} days</span>
                <span>10 days</span>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block font-semibold mb-3">What interests you?</label>
              <div className="flex flex-wrap gap-3">
                {interests.map(interest => (
                  <button
                    key={interest.id}
                    onClick={() => {
                      if (preferences.interests.includes(interest.id)) {
                        setPreferences({
                          ...preferences,
                          interests: preferences.interests.filter(i => i !== interest.id)
                        });
                      } else {
                        setPreferences({
                          ...preferences,
                          interests: [...preferences.interests, interest.id]
                        });
                      }
                    }}
                    className={`px-4 py-2 rounded-full transition ${
                      preferences.interests.includes(interest.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100'
                    }`}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block font-semibold mb-2 flex items-center gap-2">
                <span className="text-xl">💵</span> Daily Budget (USD)
              </label>
              <div className="flex gap-4">
                {[
                  { type: 'budget', amount: 30, label: 'Budget' },
                  { type: 'moderate', amount: 70, label: 'Moderate' },
                  { type: 'luxury', amount: 150, label: 'Luxury' }
                ].map(type => (
                  <button
                    key={type.type}
                    onClick={() => setPreferences({
                      ...preferences,
                      budget: type.amount
                    })}
                    className={`flex-1 py-2 rounded-lg transition ${
                      preferences.budget === type.amount
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block font-semibold mb-2">Travel Style</label>
              <select
                value={preferences.travelStyle}
                onChange={(e) => setPreferences({...preferences, travelStyle: e.target.value})}
                className="w-full p-3 border rounded-lg dark:bg-dark-100 dark:border-gray-600"
              >
                <option value="relaxed">Relaxed - Slow pace, plenty of rest</option>
                <option value="balanced">Balanced - Mix of activities and relaxation</option>
                <option value="adventurous">Adventurous - Full days, active exploration</option>
              </select>
            </div>

            {/* Group Size */}
            <div>
              <label className="block font-semibold mb-2 flex items-center gap-2">
                <span className="text-xl">👥</span> Group Size
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={preferences.groupSize}
                onChange={(e) => setPreferences({...preferences, groupSize: parseInt(e.target.value)})}
                className="w-full p-3 border rounded-lg dark:bg-dark-100 dark:border-gray-600"
              />
            </div>

            <button
              onClick={generateItinerary}
              disabled={loading || preferences.interests.length === 0}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block animate-spin">⏳</span>
              ) : 'Generate My Itinerary →'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && itinerary && (
        <div className="bg-white dark:bg-dark-100 rounded-2xl shadow-xl overflow-hidden">
          <div dangerouslySetInnerHTML={{ __html: itinerary }} />
          <div className="p-6 border-t flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              ← Back
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              📄 Print Itinerary
            </button>
            <button
              onClick={() => window.location.href = '/booking'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Book This Trip →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIItinerary;
