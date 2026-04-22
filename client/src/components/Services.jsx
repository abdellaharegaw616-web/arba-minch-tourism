import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const handleMouseMove = (e) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    }
  };

  const services = [
    {
      id: 1,
      icon: '✈️',
      name: 'Airport Pickup Service',
      description: 'Meet & greet at Arba Minch Airport. Welcome drink, cold towel, and comfortable transfer to your hotel.',
      price: 25,
      unit: 'per person',
      duration: '1 hour',
      features: ['Meet & greet at airport', 'Welcome drink and cold towel', 'Comfortable AC vehicle', 'Local SIM card provided'],
      gradient: 'from-blue-500 to-cyan-500',
      popular: true
    },
    {
      id: 2,
      icon: '🏨',
      name: 'Hotel Booking Service',
      description: 'Best price guaranteed for hotels in Arba Minch. From luxury resorts to budget-friendly accommodations.',
      price: 0,
      unit: 'free service',
      duration: '24/7',
      features: ['Best price guaranteed', 'Free cancellation', '50+ hotels available', '24/7 support'],
      gradient: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 3,
      icon: '🏞️',
      name: 'City Tour Package',
      description: 'Full day tour exploring Arba Minch\'s top attractions. Includes Lake Chamo boat tour and Nech Sar Park.',
      price: 45,
      unit: 'per person',
      duration: '8 hours',
      features: ['Lake Chamo boat tour', 'Nech Sar Park entry', 'Forty Springs visit', 'Local English-speaking guide', 'Lunch included'],
      gradient: 'from-green-500 to-emerald-500',
      popular: true
    },
    {
      id: 4,
      icon: '🚤',
      name: 'Boat Safari - Lake Chamo',
      description: '2-hour boat tour on Lake Chamo. See Nile crocodiles, hippos, and exotic birds with professional guide.',
      price: 35,
      unit: 'per person',
      duration: '2 hours',
      features: ['Nile crocodile viewing', 'Hippopotamus pods', 'Bird watching', 'Professional guide', 'Life jackets included'],
      gradient: 'from-teal-500 to-cyan-500',
      popular: true
    },
    {
      id: 5,
      icon: '🗣️',
      name: 'Translation Service',
      description: 'Professional English-Amharic translation assistance. Available via chat, phone, or in-person.',
      price: 15,
      unit: 'per hour',
      duration: 'Flexible',
      features: ['English-Amharic translation', 'Available 24/7', 'Chat, phone, or in-person', 'Cultural guidance', 'Local dialect expert'],
      gradient: 'from-orange-500 to-red-500',
      popular: false
    },
    {
      id: 6,
      icon: '🏺',
      name: 'Dorze Cultural Experience',
      description: 'Visit Dorze village, learn about traditional weaving, and experience authentic Ethiopian coffee ceremony.',
      price: 40,
      unit: 'per person',
      duration: '4 hours',
      features: ['Traditional Dorze village visit', 'Elephant-shaped bamboo houses', 'Cotton weaving demonstration', 'Coffee ceremony', 'Traditional lunch'],
      gradient: 'from-amber-500 to-yellow-500',
      popular: true
    }
  ];

  const backgrounds = [
    'from-slate-900 via-blue-900 to-indigo-900',
    'from-gray-900 via-purple-900 to-pink-900',
    'from-zinc-900 via-green-900 to-emerald-900',
    'from-stone-900 via-amber-900 to-orange-900'
  ];

  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className={`min-h-screen bg-gradient-to-br ${backgrounds[currentBg]} transition-all duration-1000 relative overflow-hidden`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${Math.random() * 60 + 10}px`,
              height: `${Math.random() * 60 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 15 + 8}s` 
            }}
          />
        ))}
      </div>

      {/* Parallax Effect */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2661919/pexels-photo-2661919.jpeg')] bg-cover bg-center" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-16 pb-8 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in-down drop-shadow-lg">
            Our Services
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Discover Arba Minch with our professional tourism services tailored to make your visit unforgettable
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative transform transition-all duration-500 hover:-translate-y-4 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${service.gradient} rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500`} />
              
              {/* Card Content */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-white/20">
                {/* Header Gradient */}
                <div className={`bg-gradient-to-r ${service.gradient} p-6 text-white`}>
                  <div className="text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                    {service.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                    {service.features.length > 4 && (
                      <div className="text-sm text-gray-500 mt-1">
                        +{service.features.length - 4} more benefits
                      </div>
                    )}
                  </div>
                </div>

                {/* Button */}
                <Link
                  to="/booking"
                  state={{ preselectedService: service.id }}
                  className="block text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Book Now →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="mt-16 bg-gradient-to-r from-green-700 to-emerald-700 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">👥</div>
              <p className="font-semibold">5 Local Guides</p>
              <p className="text-sm text-green-100">Expert local knowledge</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💬</div>
              <p className="font-semibold">24/7 Support</p>
              <p className="text-sm text-green-100">Always here to help</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <p className="font-semibold">Safe & Secure</p>
              <p className="text-sm text-green-100">Professional service</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <p className="font-semibold">Best Price</p>
              <p className="text-sm text-green-100">Money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
