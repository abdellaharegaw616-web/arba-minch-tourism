import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Testimonials from '../components/Testimonials';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  // Arba Minch Landscape Images - Working URLs
  const landscapes = [
    {
      url: "https://images.pexels.com/photos/2661919/pexels-photo-2661919.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Arba Minch Panorama",
      subtitle: "The Land of Forty Springs",
      description: "Breathtaking view of twin lakes and surrounding highlands"
    },
    {
      url: "https://images.pexels.com/photos/1964515/pexels-photo-1964515.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Lake Chamo",
      subtitle: "Home to Crocodiles & Hippos",
      description: "Blue-green waters teeming with wildlife"
    },
    {
      url: "https://images.pexels.com/photos/3029802/pexels-photo-3029802.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Nech Sar National Park",
      subtitle: "Savanna Paradise",
      description: "Vast grasslands with zebras and gazelles"
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % landscapes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [landscapes.length]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse move effect
  const handleMouseMove = (e) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    }
  };

  // Services Data
  const services = [
    { icon: '✈️', title: 'Airport Pickup', desc: 'Meet & greet at Arba Minch Airport', price: '$25', color: 'from-blue-500 to-cyan-500' },
    { icon: '🏨', title: 'Hotel Booking', desc: 'Best price guaranteed', price: 'Free', color: 'from-purple-500 to-pink-500' },
    { icon: '🏞️', title: 'City Tours', desc: 'Explore all attractions', price: '$45/day', color: 'from-green-500 to-emerald-500' },
    { icon: '🚤', title: 'Boat Safari', desc: 'Lake Chamo crocodile viewing', price: '$35', color: 'from-teal-500 to-cyan-500' },
    { icon: '🗣️', title: 'Translation', desc: 'English-Amharic support', price: '$15/hr', color: 'from-orange-500 to-red-500' },
    { icon: '🏺', title: 'Cultural Tour', desc: 'Dorze village experience', price: '$40', color: 'from-amber-500 to-yellow-500' }
  ];

  // ✅ ATTRACTIONS WITH WORKING IMAGES
  const attractions = [
    {
      name: 'Lake Chamo',
      icon: '💧',
      description: 'Crocodiles & Hippos - Nile crocodile market',
      rating: 4.9,
      image: "https://images.pexels.com/photos/1964515/pexels-photo-1964515.jpeg?auto=compress&cs=tinysrgb&w=800",
      fullDescription: 'Lake Chamo is famous for its "Crocodile Market" where hundreds of massive Nile crocodiles bask on sandy shores. Boat tours offer close encounters with these ancient reptiles and hippo pods.',
      location: 'Lake Chamo, Nech Sar National Park',
      bestTime: 'October - March',
      price: '$35 per person'
    },
    {
      name: 'Nech Sar Park',
      icon: '🦒',
      description: 'Zebras & Gazelles - 273 bird species',
      rating: 4.8,
      image: "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=800",
      fullDescription: 'Nech Sar National Park spans 514 sq km of savanna grasslands between Lakes Abaya and Chamo. Home to Burchell\'s zebras, Grant\'s gazelles, Swayne\'s hartebeest, and over 273 bird species.',
      location: 'Nech Sar National Park',
      bestTime: 'November - February',
      price: '$20 entry fee'
    },
    {
      name: 'Forty Springs',
      icon: '💦',
      description: 'Natural Springs - Lush green oasis',
      rating: 4.9,
      image: "https://images.pexels.com/photos/4062575/pexels-photo-4062575.jpeg?auto=compress&cs=tinysrgb&w=800",
      fullDescription: 'The city\'s namesake - "Arba Minch" means forty springs in Amharic. These natural springs bubble up through the groundwater forest, creating a lush, green paradise year-round.',
      location: 'Nech Sar National Park',
      bestTime: 'Year-round',
      price: 'Free entry'
    },
    {
      name: 'Dorze Village',
      icon: '🏘️',
      description: 'Bamboo Huts - Traditional weaving',
      rating: 4.9,
      image: "https://images.pexels.com/photos/247476/pexels-photo-247476.jpeg?auto=compress&cs=tinysrgb&w=800",
      fullDescription: 'Visit the traditional Dorze village with unique elephant-shaped bamboo huts that can last up to 150 years. Experience their famous cotton weaving and traditional coffee ceremony.',
      location: 'Chencha Highlands (2,900m)',
      bestTime: 'October - March',
      price: '$15 per person'
    },
    {
      name: 'Bridge of God',
      icon: '⛰️',
      description: 'Panoramic View - Land bridge',
      rating: 4.7,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Nech_Sar_Bridge_of_God.jpg/1200px-Nech_Sar_Bridge_of_God.jpg",
      fullDescription: 'The Bridge of God (Tossa Usacha) is a narrow land bridge separating Lakes Abaya and Chamo. Despite being side by side, their water levels differ by 1.5 meters. Ancient terraced farming from 500 years ago is still visible.',
      location: 'Between Lakes Abaya and Chamo',
      bestTime: 'Sunrise & Sunset',
      price: 'Included in park fee'
    },
    {
      name: 'Lake Abaya',
      icon: '🌅',
      description: 'Sunset Views - Reddish-brown water',
      rating: 4.8,
      image: "https://images.pexels.com/photos/1181286/pexels-photo-1181286.jpeg?auto=compress&cs=tinysrgb&w=800",
      fullDescription: 'Ethiopia\'s second-largest lake with distinctive reddish-brown water due to high iron oxide sediment. Stunning sunsets and excellent birdwatching for flamingos, pelicans, and over 200 bird species.',
      location: 'Lake Abaya',
      bestTime: 'Sunset (4:00 PM - 6:00 PM)',
      price: 'Free viewing'
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section with Animated Landscape Background */}
      <div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative h-screen overflow-hidden"
      >
        {/* Animated Background Slides */}
        {landscapes.map((landscape, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${landscape.url})`,
                transform: `scale(${1 + scrollY * 0.0005}) translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
          </div>
        ))}

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                fontSize: `${Math.random() * 20 + 10}px` 
              }}
            >
              {['🌿', '🍃', '🌸', '🦋', '🐦', '☁️', '✨'][Math.floor(Math.random() * 7)]}
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center text-white z-10">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-fade-in-down">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
                Welcome to <span className="text-green-400">Arba Minch</span>
              </h1>
              <p className="text-xl md:text-2xl mb-4 max-w-2xl mx-auto drop-shadow-lg">
                The Land of Forty Springs - Ethiopia's Most Beautiful Paradise
              </p>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                {landscapes[currentSlide].description}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse-slow">
                  <span className="mr-2">🌊</span> 40+ Springs
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse-slow animation-delay-200">
                  <span className="mr-2">🦒</span> 2 National Parks
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse-slow animation-delay-400">
                  <span className="mr-2">🐊</span> 1000+ Crocodiles
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse-slow animation-delay-600">
                  <span className="mr-2">🏘️</span> 150-Year Houses
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up">
              <Link to="/booking" className="group relative px-8 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 overflow-hidden">
                <span className="relative z-10">Book Your Trip →</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-lg font-semibold hover:bg-white/30 transition-all transform hover:scale-105">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-8 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-all transform hover:scale-105">
                    Create Account
                  </Link>
                </>
              )}
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              {landscapes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 ${
                    currentSlide === index
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  } h-2 rounded-full`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message for Logged In Users */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 py-3 text-center">
          <p className="text-green-800 dark:text-green-300">
            Welcome back, {user?.name}! 🎉 Your personal guide is ready to assist you.
          </p>
        </div>
      )}

      {/* Services Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We offer complete tourism assistance to make your Arba Minch experience unforgettable
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group relative transform transition-all duration-500 hover:-translate-y-2">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${service.color} rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500`} />
              <div className="relative bg-white dark:bg-dark-100 rounded-2xl shadow-lg overflow-hidden">
                <div className={`bg-gradient-to-r ${service.color} p-6 text-white`}>
                  <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{service.desc}</p>
                  <p className="text-green-600 dark:text-green-400 font-bold">{service.price}</p>
                  <Link to="/booking" className="inline-block mt-4 text-green-600 dark:text-green-400 font-semibold group-hover:translate-x-2 transition-transform">
                    Book Now →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Attractions Section with WORKING IMAGES */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-200 dark:to-dark-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Top Attractions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the most beautiful places in Arba Minch
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attractions.map((attraction, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer transform transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.pexels.com/photos/2661919/pexels-photo-2661919.jpeg?auto=compress&cs=tinysrgb&w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl drop-shadow-lg">{attraction.icon}</span>
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">{attraction.name}</h3>
                    </div>
                    <p className="text-white/90 text-sm mb-2 drop-shadow">{attraction.description}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-400">★</span>
                      <span className="text-white text-sm">{attraction.rating}</span>
                      <span className="text-white/60 text-sm ml-2">/ 5</span>
                    </div>
                    
                    <div className="max-h-0 opacity-0 group-hover:max-h-48 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                      <p className="text-white/80 text-xs mb-2 leading-relaxed">
                        {attraction.fullDescription}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-green-600/80 text-white text-xs px-2 py-1 rounded-full">
                          📍 {attraction.location.split(',')[0]}
                        </span>
                        <span className="bg-orange-600/80 text-white text-xs px-2 py-1 rounded-full">
                          🕐 Best: {attraction.bestTime}
                        </span>
                        <span className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded-full">
                          💰 {attraction.price}
                        </span>
                      </div>
                      <Link to="/booking" className="inline-block bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition">
                        Book This Tour →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Local Guides Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Meet Your Local Guides
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We are 5 local friends who know every corner of Arba Minch
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { name: 'Team Leader', role: 'CEO & Operations', icon: '👨‍💼', description: '10+ years experience' },
            { name: 'Tour Specialist', role: 'Expert Guide', icon: '🗺️', description: 'Knows every trail' },
            { name: 'Translator', role: 'Language Expert', icon: '🗣️', description: 'Fluent in 3 languages' },
            { name: 'Logistics', role: 'Transport Manager', icon: '🚗', description: 'Safe & reliable' },
            { name: 'Support', role: 'Customer Care', icon: '💬', description: '24/7 assistance' }
          ].map((guide, index) => (
            <div key={index} className="group text-center transform transition-all duration-300 hover:-translate-y-2">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-4xl text-white shadow-lg group-hover:scale-110 transition-transform">
                {guide.icon}
              </div>
              <h3 className="font-bold text-lg">{guide.name}</h3>
              <p className="text-green-600 dark:text-green-400 text-sm">{guide.role}</p>
              <p className="text-gray-500 text-xs mt-1">{guide.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Visitors Say</h2>
            <p className="text-green-200 max-w-2xl mx-auto">Real experiences from real tourists</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', country: 'USA', text: 'The crocodile market on Lake Chamo was incredible! Our guide was knowledgeable and made the experience unforgettable.', rating: 5, image: 'https://randomuser.me/api/portraits/women/1.jpg' },
              { name: 'Thomas Müller', country: 'Germany', text: 'Nech Sar National Park is a hidden gem. We saw zebras, gazelles, and over 50 bird species. Highly recommend!', rating: 5, image: 'https://randomuser.me/api/portraits/men/2.jpg' },
              { name: 'Maria Garcia', country: 'Spain', text: 'The Dorze village cultural experience was amazing. The traditional coffee ceremony and weaving demonstration were highlights.', rating: 5, image: 'https://randomuser.me/api/portraits/women/3.jpg' }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-green-200">{testimonial.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get the latest updates on tours, events, and special offers
          </p>
          <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Translation Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white dark:bg-dark-100 rounded-lg shadow-xl p-3 flex items-center space-x-2 hover:scale-105 transition-transform">
          <span className="text-2xl">🌐</span>
          <select className="border rounded px-2 py-1 text-sm bg-transparent">
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
          </select>
          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
            Translate
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-15px) translateX(10px); }
          75% { transform: translateY(10px) translateX(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-float { animation: float infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
      `}</style>
      
      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default Home;
