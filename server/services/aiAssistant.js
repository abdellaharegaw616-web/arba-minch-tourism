const OpenAI = require('openai');

class AIAssistant {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateItinerary(userPreferences) {
    const prompt = `
      Create a personalized ${userPreferences.days}-day itinerary for Arba Minch, Ethiopia.
      
      Tourist Profile:
      - Interests: ${userPreferences.interests.join(', ')}
      - Budget: ${userPreferences.budget} USD per day
      - Travel Style: ${userPreferences.travelStyle}
      - Group Size: ${userPreferences.groupSize} people
      - Special Requirements: ${userPreferences.specialRequirements || 'None'}
      
      Available Attractions:
      - Lake Chamo (crocodiles, hippos, boat tours)
      - Nech Sar National Park (zebras, gazelles, bird watching)
      - Forty Springs (natural springs, hiking)
      - Dorze Village (cultural experience, weaving)
      - Bridge of God (panoramic views)
      - Crocodile Ranch (conservation center)
      
      Please provide:
      1. Daily breakdown with activities
      2. Recommended restaurants with local cuisine
      3. Estimated costs per day
      4. Cultural tips and etiquette
      5. Best time for photography
      
      Format as a beautiful HTML itinerary with emojis.
    `;
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    return response.choices[0].message.content;
  }

  async answerQuestion(question, context = {}) {
    const systemPrompt = `
      You are a knowledgeable local guide for Arba Minch, Ethiopia.
      
      Key Information:
      - City name means "Forty Springs" in Amharic
      - Located in Southern Ethiopia, Rift Valley
      - Elevation: 1,285 meters
      - Population: ~100,000
      
      Attractions:
      - Lake Chamo: Famous for Nile crocodiles (up to 6m), hippos, boat tours $35/person
      - Nech Sar Park: 514 sq km, zebras, gazelles, 273 bird species, entry $20
      - Forty Springs: Natural springs, free entry, best in morning
      - Dorze Village: Traditional huts, weaving, coffee ceremony, $15 entry
      
      Practical Info:
      - Best time: October-March (dry season)
      - Temperature: 20-30°C year-round
      - Language: English widely spoken in tourist areas
      - Currency: Ethiopian Birr (ETB), $1 ≈ 55 ETB
      - Transport: Bajaj (tuk-tuk) $1-2, taxis $5-10
      
      Answer questions helpfully, concisely, and with local expertise.
    `;
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.7
    });
    
    return response.choices[0].message.content;
  }

  async recommendActivities(preferences) {
    const prompt = `
      Recommend activities in Arba Minch based on:
      - Interests: ${preferences.interests}
      - Duration: ${preferences.duration} days
      - Physical Level: ${preferences.physicalLevel}
      
      Return as JSON with:
      - top_activities: array of activities
      - estimated_time: hours per activity
      - difficulty: easy/medium/hard
      - price_range: $$$
    `;
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  }

  async suggestAccommodation(budget, preferences) {
    const hotels = {
      luxury: [
        { name: "Haile Resort", price: 150, rating: 4.8, features: ["Pool", "Spa", "Restaurant"] },
        { name: "Paradise Lodge", price: 120, rating: 4.7, features: ["Lake View", "Restaurant"] }
      ],
      mid: [
        { name: "Swaynes Hotel", price: 60, rating: 4.5, features: ["Restaurant", "Bar"] },
        { name: "Emerald Resort", price: 50, rating: 4.3, features: ["Garden", "Restaurant"] }
      ],
      budget: [
        { name: "Arba Minch Hotel", price: 25, rating: 4.0, features: ["Basic", "Clean"] },
        { name: "Tourist Hotel", price: 20, rating: 3.8, features: ["Budget"] }
      ]
    };
    
    const category = budget >= 100 ? 'luxury' : budget >= 40 ? 'mid' : 'budget';
    return hotels[category];
  }
}

module.exports = new AIAssistant();
