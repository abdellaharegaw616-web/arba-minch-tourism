// Services Data
export const services = [
  {
    id: 1,
    name: "✈️ Airport Pickup Service",
    description: "Meet & greet at Arba Minch Airport. Welcome drink, cold towel, and comfortable transfer to your hotel. Local SIM card provided.",
    price: 25,
    unit: "per person",
    duration: "1 hour",
    icon: "✈️",
    color: "from-blue-500 to-cyan-500",
    features: [
      "Meet & greet at airport",
      "Welcome drink and cold towel",
      "Comfortable AC vehicle",
      "Local SIM card provided",
      "24/7 flight tracking"
    ],
    popular: true
  },
  {
    id: 2,
    name: "🏨 Hotel Booking Service",
    description: "Best price guaranteed for hotels in Arba Minch. From luxury resorts to budget-friendly accommodations. Real-time availability.",
    price: 0,
    unit: "free service",
    duration: "24/7",
    icon: "🏨",
    color: "from-purple-500 to-pink-500",
    features: [
      "Best price guaranteed",
      "Free cancellation",
      "50+ hotels available",
      "Real-time availability",
      "24/7 support"
    ],
    popular: true
  },
  {
    id: 3,
    name: "🏞️ City Tour Package",
    description: "Full day tour exploring Arba Minch's top attractions. Includes Lake Chamo boat tour, Nech Sar National Park, and Forty Springs.",
    price: 45,
    unit: "per person",
    duration: "8 hours",
    icon: "🏞️",
    color: "from-green-500 to-emerald-500",
    features: [
      "Lake Chamo boat tour (crocodile viewing)",
      "Nech Sar National Park entry",
      "Forty Springs visit",
      "Local English-speaking guide",
      "Lunch included",
      "Hotel pickup & drop-off"
    ],
    popular: true
  },
  {
    id: 4,
    name: "🗣️ Translation Service",
    description: "Professional English-Amharic translation assistance. Available via chat, phone, or in-person. Cultural guidance included.",
    price: 15,
    unit: "per hour",
    duration: "Flexible",
    icon: "🗣️",
    color: "from-orange-500 to-red-500",
    features: [
      "English-Amharic translation",
      "Available 24/7",
      "Chat, phone, or in-person",
      "Cultural guidance",
      "Local dialect expert"
    ],
    popular: false
  },
  {
    id: 5,
    name: "🚤 Boat Safari - Lake Chamo",
    description: "2-hour boat tour on Lake Chamo. See Nile crocodiles, hippos, and exotic birds. Professional guide and life jackets included.",
    price: 35,
    unit: "per person",
    duration: "2 hours",
    icon: "🚤",
    color: "from-teal-500 to-cyan-500",
    features: [
      "Nile crocodile viewing",
      "Hippopotamus pods",
      "Bird watching",
      "Professional guide",
      "Life jackets included",
      "Binoculars provided"
    ],
    popular: true
  },
  {
    id: 6,
    name: "🏺 Dorze Cultural Experience",
    description: "Visit Dorze village, learn about traditional weaving, and experience authentic Ethiopian coffee ceremony. Includes lunch.",
    price: 40,
    unit: "per person",
    duration: "4 hours",
    icon: "🏺",
    color: "from-amber-500 to-yellow-500",
    features: [
      "Traditional Dorze village visit",
      "Elephant-shaped bamboo houses",
      "Cotton weaving demonstration",
      "Coffee ceremony",
      "Traditional lunch",
      "Scenic mountain views"
    ],
    popular: true
  }
];

export const getServiceById = (id) => services.find(s => s.id === id);
export const getTotalPrice = (selectedServices) => {
  return selectedServices.reduce((total, id) => {
    const service = getServiceById(id);
    return total + (service?.price || 0);
  }, 0);
};
