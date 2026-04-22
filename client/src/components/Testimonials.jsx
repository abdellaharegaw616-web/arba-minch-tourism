import React, { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    country: 'USA',
    rating: 5,
    text: 'The Lake Chamo boat tour was absolutely incredible! Seeing crocodiles and hippos up close was a once-in-a-lifetime experience. Highly recommend Arba Minch Tours!',
    tour: 'Lake Chamo Boat Tour',
    date: '2024-03-15'
  },
  {
    id: 2,
    name: 'Michael Chen',
    country: 'China',
    rating: 5,
    text: 'Nech Sar National Park exceeded all my expectations. The diversity of wildlife and the stunning landscapes made this the highlight of my Ethiopia trip.',
    tour: 'Nech Sar Safari',
    date: '2024-02-20'
  },
  {
    id: 3,
    name: 'Emma Williams',
    country: 'UK',
    rating: 5,
    text: 'The Dorze village tour gave us such insight into Ethiopian culture. The traditional bamboo houses are fascinating, and the locals were so welcoming.',
    tour: 'Dorze Village Tour',
    date: '2024-01-10'
  },
  {
    id: 4,
    name: 'Ahmed Hassan',
    country: 'Egypt',
    rating: 4,
    text: 'Great service and beautiful locations. The Bridge of God viewpoint offers breathtaking panoramic views of both lakes. Worth every penny!',
    tour: 'Bridge of God Tour',
    date: '2024-04-05'
  },
  {
    id: 5,
    name: 'Lisa Mueller',
    country: 'Germany',
    rating: 5,
    text: 'Professional guides, comfortable transportation, and unforgettable memories. Arba Minch is truly Ethiopia\'s hidden gem!',
    tour: 'Full Day Package',
    date: '2024-03-28'
  },
  {
    id: 6,
    name: 'Raj Patel',
    country: 'India',
    rating: 5,
    text: 'The bird watching at Lake Abaya was spectacular. Our guide knew every species and their calls. A must for nature enthusiasts!',
    tour: 'Bird Watching Tour',
    date: '2024-02-14'
  }
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ⭐
        </span>
      ))}
    </div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            ⭐ What Our Tourists Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real experiences from travelers who explored Arba Minch with us
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-3xl">
                  👤
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <StarRating rating={testimonials[activeIndex].rating} />
                <p className="text-lg text-gray-700 dark:text-gray-300 italic my-4">
                  "{testimonials[activeIndex].text}"
                </p>
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-4">
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      🌍 {testimonials[activeIndex].country}
                    </p>
                  </div>
                  <span className="hidden md:inline text-gray-300">|</span>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    🎯 {testimonials[activeIndex].tour}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-3 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === activeIndex
                  ? 'bg-green-600 w-8'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
            <div className="text-4xl mb-2">😊</div>
            <div className="text-3xl font-bold text-green-600">500+</div>
            <div className="text-gray-600 dark:text-gray-400">Happy Tourists</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-green-600">4.9</div>
            <div className="text-gray-600 dark:text-gray-400">Average Rating</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
            <div className="text-4xl mb-2">🗺️</div>
            <div className="text-3xl font-bold text-green-600">25+</div>
            <div className="text-gray-600 dark:text-gray-400">Tour Packages</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
            <div className="text-4xl mb-2">🌐</div>
            <div className="text-3xl font-bold text-green-600">40+</div>
            <div className="text-gray-600 dark:text-gray-400">Countries</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
