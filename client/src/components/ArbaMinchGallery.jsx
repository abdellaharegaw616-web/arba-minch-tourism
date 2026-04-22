import React, { useState, useEffect, useRef } from 'react';

const ArbaMinchGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const galleryRef = useRef(null);


  // 20 High-Quality Images with Working URLs
  const images = [
    {
      id: 1,
      url: "https://images.pexels.com/photos/2661919/pexels-photo-2661919.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Arba Minch Panorama",
      description: "Stunning aerial view of Arba Minch city and surrounding landscape.",
      category: "landscape",
      location: "Arba Minch City",
      rank: 1
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/1964515/pexels-photo-1964515.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Lake Chamo",
      description: "Beautiful blue-green lake famous for crocodiles and hippos.",
      category: "lake",
      location: "Lake Chamo",
      rank: 2
    },
    {
      id: 3,
      url: "https://images.pexels.com/photos/3029802/pexels-photo-3029802.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Nile Crocodile",
      description: "Massive Nile crocodiles basking on the shores of Lake Chamo.",
      category: "wildlife",
      location: "Lake Chamo",
      rank: 3
    },
    {
      id: 4,
      url: "https://images.pexels.com/photos/247476/pexels-photo-247476.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Traditional Village",
      description: "Traditional Ethiopian village with local architecture.",
      category: "culture",
      location: "Dorze Village",
      rank: 4
    },
    {
      id: 5,
      url: "https://images.pexels.com/photos/3422961/pexels-photo-3422961.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Plains Zebras",
      description: "Beautiful zebras grazing in their natural habitat.",
      category: "wildlife",
      location: "Nech Sar National Park",
      rank: 5
    },
    {
      id: 6,
      url: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Hippos in Water",
      description: "Hippopotamus pods in the waters of Lake Chamo.",
      category: "wildlife",
      location: "Lake Chamo",
      rank: 6
    },
    {
      id: 7,
      url: "https://images.pexels.com/photos/4062575/pexels-photo-4062575.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Natural Springs",
      description: "Beautiful natural springs - the forty springs of Arba Minch.",
      category: "springs",
      location: "Arba Minch Springs",
      rank: 7
    },
    {
      id: 8,
      url: "https://images.pexels.com/photos/3844917/pexels-photo-3844917.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Local Market",
      description: "Vibrant local market with fresh produce and traditional crafts.",
      category: "culture",
      location: "Arba Minch Market",
      rank: 8
    },
    {
      id: 9,
      url: "https://images.pexels.com/photos/1674667/pexels-photo-1674667.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Coffee Ceremony",
      description: "Traditional Ethiopian coffee ceremony experience.",
      category: "culture",
      location: "Dorze Village",
      rank: 9
    },
    {
      id: 10,
      url: "https://images.pexels.com/photos/1181286/pexels-photo-1181286.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "African Sunset",
      description: "Breathtaking sunset over the African savanna.",
      category: "landscape",
      location: "Lake Abaya",
      rank: 10
    },
    {
      id: 11,
      url: "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Savanna Landscape",
      description: "Beautiful grasslands of Nech Sar National Park.",
      category: "park",
      location: "Nech Sar National Park",
      rank: 11
    },
    {
      id: 12,
      url: "https://images.pexels.com/photos/12299773/pexels-photo-12299773.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "African Birds",
      description: "Colorful bird species found in the national park.",
      category: "wildlife",
      location: "Nech Sar Park",
      rank: 12
    },
    {
      id: 13,
      url: "https://images.pexels.com/photos/2769525/pexels-photo-2769525.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Mountain View",
      description: "Scenic mountain views surrounding Arba Minch.",
      category: "landscape",
      location: "Chencha Highlands",
      rank: 13
    },
    {
      id: 14,
      url: "https://images.pexels.com/photos/2537045/pexels-photo-2537045.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "African Wildlife",
      description: "Diverse wildlife in their natural habitat.",
      category: "wildlife",
      location: "Nech Sar National Park",
      rank: 14
    },
    {
      id: 15,
      url: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "River View",
      description: "Beautiful river flowing through the valley.",
      category: "river",
      location: "Kulfo River",
      rank: 15
    },
    {
      id: 16,
      url: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Local Hotel",
      description: "Comfortable accommodation with stunning views.",
      category: "hotel",
      location: "Arba Minch",
      rank: 16
    },
    {
      id: 17,
      url: "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Hotel Resort",
      description: "Luxury resort with pool and amenities.",
      category: "hotel",
      location: "Arba Minch",
      rank: 17
    },
    {
      id: 18,
      url: "https://images.pexels.com/photos/2690930/pexels-photo-2690930.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Hiking Trail",
      description: "Beautiful hiking trails in the highlands.",
      category: "landscape",
      location: "Chencha Highlands",
      rank: 18
    },
    {
      id: 19,
      url: "https://images.pexels.com/photos/1265772/pexels-photo-1265772.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Local People",
      description: "Friendly locals welcoming visitors.",
      category: "culture",
      location: "Dorze Village",
      rank: 19
    },
    {
      id: 20,
      url: "https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Traditional Crafts",
      description: "Beautiful traditional crafts and artwork.",
      category: "culture",
      location: "Arba Minch Market",
      rank: 20
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🌍', gradient: 'from-blue-500 to-purple-500' },
    { id: 'park', name: 'National Parks', icon: '🏞️', gradient: 'from-green-500 to-emerald-500' },
    { id: 'lake', name: 'Lakes', icon: '💧', gradient: 'from-blue-400 to-cyan-400' },
    { id: 'wildlife', name: 'Wildlife', icon: '🦒', gradient: 'from-yellow-500 to-orange-500' },
    { id: 'culture', name: 'Culture', icon: '🏘️', gradient: 'from-purple-500 to-pink-500' },
    { id: 'springs', name: 'Springs', icon: '💦', gradient: 'from-teal-400 to-green-400' },
    { id: 'geological', name: 'Geological', icon: '⛰️', gradient: 'from-stone-500 to-stone-700' },
    { id: 'river', name: 'Rivers', icon: '🏞️', gradient: 'from-blue-500 to-sky-500' },
    { id: 'landscape', name: 'Landscapes', icon: '🌄', gradient: 'from-amber-500 to-orange-500' },
    { id: 'hotel', name: 'Hotels', icon: '🏨', gradient: 'from-rose-500 to-pink-500' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? [...images].sort((a, b) => (a.rank || 99) - (b.rank || 99))
    : images.filter(img => img.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      park: 'bg-green-600',
      lake: 'bg-blue-600',
      wildlife: 'bg-yellow-600',
      culture: 'bg-purple-600',
      springs: 'bg-teal-600',
      geological: 'bg-orange-600',
      river: 'bg-cyan-600',
      landscape: 'bg-indigo-600',
      hotel: 'bg-pink-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  // Animated floating wildlife elements
  const wildlifeElements = [
    // Fish - Swimming in water
    { id: 1, type: 'fish', icon: '🐟', style: 'water', x: 5, y: 70, speed: 8, size: 28 },
    { id: 2, type: 'fish', icon: '🐠', style: 'water', x: 15, y: 75, speed: 6, size: 24 },
    { id: 3, type: 'fish', icon: '🐡', style: 'water', x: 25, y: 68, speed: 7, size: 26 },
    { id: 4, type: 'fish', icon: '🐋', style: 'water', x: 85, y: 80, speed: 5, size: 32 },
    { id: 5, type: 'fish', icon: '🐬', style: 'water', x: 75, y: 72, speed: 9, size: 30 },
    // Birds - Flying in sky
    { id: 6, type: 'bird', icon: '🦅', style: 'sky', x: 20, y: 15, speed: 12, size: 32 },
    { id: 7, type: 'bird', icon: '🦩', style: 'sky', x: 45, y: 25, speed: 10, size: 28 },
    { id: 8, type: 'bird', icon: '🐦', style: 'sky', x: 70, y: 18, speed: 14, size: 22 },
    { id: 9, type: 'bird', icon: '🦜', style: 'sky', x: 88, y: 12, speed: 11, size: 26 },
    { id: 10, type: 'bird', icon: '🕊️', style: 'sky', x: 55, y: 8, speed: 13, size: 24 },
    // Butterflies - Fluttering around
    { id: 11, type: 'butterfly', icon: '🦋', style: 'air', x: 35, y: 40, speed: 15, size: 20 },
    { id: 12, type: 'butterfly', icon: '🦋', style: 'air', x: 50, y: 55, speed: 18, size: 22 },
    { id: 13, type: 'butterfly', icon: '🐝', style: 'air', x: 65, y: 45, speed: 12, size: 18 },
    { id: 14, type: 'butterfly', icon: '🐞', style: 'air', x: 80, y: 35, speed: 10, size: 16 },
    // Hippos - In water
    { id: 15, type: 'hippo', icon: '🦛', style: 'water', x: 10, y: 85, speed: 3, size: 40 },
    { id: 16, type: 'hippo', icon: '🦛', style: 'water', x: 92, y: 88, speed: 4, size: 38 },
    // Crocodile
    { id: 17, type: 'crocodile', icon: '🐊', style: 'water', x: 60, y: 82, speed: 2, size: 36 },
    // Dragonfly
    { id: 18, type: 'dragonfly', icon: '🐉', style: 'air', x: 40, y: 30, speed: 20, size: 24 },
    // Frog
    { id: 19, type: 'frog', icon: '🐸', style: 'land', x: 22, y: 60, speed: 5, size: 28 },
    // Monkey
    { id: 20, type: 'monkey', icon: '🐒', style: 'tree', x: 85, y: 50, speed: 6, size: 32 }
  ];

  // Background animated gradients array
  const backgrounds = [
    'from-blue-900 via-cyan-800 to-teal-900',
    'from-green-900 via-emerald-800 to-teal-900',
    'from-purple-900 via-pink-800 to-rose-900',
    'from-amber-900 via-orange-800 to-red-900',
    'from-indigo-900 via-purple-800 to-pink-900'
  ];

  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div 
      ref={galleryRef}
      className={`min-h-screen bg-gradient-to-br ${backgrounds[currentBg]} transition-all duration-1000 relative overflow-hidden`}
    >
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full h-48" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <path fill="rgba(255,255,255,0.1)" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Floating Wildlife Animations */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {wildlifeElements.map((animal) => (
          <div
            key={animal.id}
            className="absolute animate-float-wildlife"
            style={{
              left: `${animal.x}%`,
              top: `${animal.y}%`,
              animationDuration: `${animal.speed}s`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${animal.size}px`,
              filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.3))',
              transform: `scaleX(${Math.random() > 0.5 ? 1 : -1})` 
            }}
          >
            {animal.icon}
          </div>
        ))}
      </div>

      {/* Floating Bubbles (Water Effect) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(40)].map((_, i) => (
          <div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-white/20 animate-float-bubble"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 10}s` 
            }}
          />
        ))}
      </div>

      {/* Floating Leaves */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(25)].map((_, i) => (
          <div
            key={`leaf-${i}`}
            className="absolute animate-float-leaf"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${Math.random() * 20 + 15}px` 
            }}
          >
            {['🍃', '🌿', '🍂', '🌾', '🍁'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-30">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-fade-in-down">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              Arba Minch Gallery
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl mx-auto">
              Discover the Beauty of Ethiopia's "Land of Forty Springs"
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse-slow">📸 20+ High-Quality Images</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse-slow animation-delay-200">🏞️ 10 Categories</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse-slow animation-delay-400">⭐ Top Rated Attractions</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse-slow animation-delay-600">🐟 Wildlife Animation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-30">
        {/* Category Filters with 3D Hover */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group relative px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 text-sm md:text-base overflow-hidden ${
                selectedCategory === cat.id 
                  ? 'text-white shadow-lg' 
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
              style={selectedCategory === cat.id ? {
                background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                backgroundImage: `linear-gradient(135deg, ${cat.gradient.split(' ')[0]}, ${cat.gradient.split(' ')[2]})` 
              } : {}}
            >
              <span className="relative z-10 flex items-center gap-1">
                <span className="text-lg animate-bounce-slow">{cat.icon}</span>
                {cat.name}
              </span>
              {selectedCategory === cat.id && (
                <div className="absolute inset-0 animate-pulse bg-white/20 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Stats Bar with Animation */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-4 mb-8 transform hover:scale-105 transition-all duration-300 animate-slide-up">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <p className="text-white font-medium">
              📸 Showing <span className="font-bold text-yellow-300">{filteredImages.length}</span> natural wonders
            </p>
            <p className="text-sm text-white/80">
              ✨ Top 20 attractions • Click for details • High-resolution images • Floating wildlife 🐟🦅🦋
            </p>
          </div>
        </div>

        {/* Image Grid with Staggered Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((img, index) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="group relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-3xl animate-fade-in-up card-3d"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.pexels.com/photos/2661919/pexels-photo-2661919.jpeg?auto=compress&cs=tinysrgb&w=800";
                  }}
                />
                {/* Animated Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {/* Hover Content with Slide Up */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">{img.title}</h3>
                  <p className="text-white/80 text-sm mb-2">{img.location}</p>
                  <div className="flex gap-2">
                    <span className="bg-green-500 text-xs px-2 py-1 rounded-full">View Details</span>
                    <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">{img.category}</span>
                  </div>
                </div>
              </div>
              
              {/* Rank Badge with Pulse Animation */}
              {img.rank && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg transform transition-all duration-300 group-hover:scale-110 animate-pulse-slow">
                  #{img.rank} Top
                </div>
              )}
              
              {/* Category Badge with Glow */}
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold text-white ${getCategoryColor(img.category)} shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                {img.category}
              </div>
              
              {/* Card Footer */}
              <div className="p-3 bg-white/10 backdrop-blur-md border-t border-white/20">
                <h3 className="font-semibold text-white truncate">{img.title}</h3>
                <p className="text-xs text-white/70 mt-1 flex items-center">
                  <span className="mr-1 animate-pulse">📍</span> {img.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal with Zoom Animation */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 z-10 transition transform hover:scale-110 hover:rotate-90"
            >
              ✕
            </button>
            
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[60vh] object-contain bg-black"
            />
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{selectedImage.title}</h2>
              <p className="text-green-600 dark:text-green-400 mb-3">📍 {selectedImage.location}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedImage.description}</p>
              
              <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105"
                >
                  Close
                </button>
                <button
                  onClick={() => window.open(selectedImage.url, '_blank')}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition transform hover:scale-105"
                >
                  View Full Size
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-30 bg-black/50 backdrop-blur-md text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/70 text-sm">
            📸 Images: Pexels | Ethiopian Tourism Organization | 🐟 Floating Wildlife Animation
          </p>
          <p className="text-white/50 text-xs mt-2">
            Discover the "Land of Forty Springs" - A paradise in the Ethiopian Rift Valley
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float-wildlife {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(5deg);
          }
          50% {
            transform: translateY(-10px) translateX(-5px) rotate(-3deg);
          }
          75% {
            transform: translateY(-15px) translateX(5px) rotate(2deg);
          }
        }
        
        @keyframes float-bubble {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(20px) scale(0);
            opacity: 0;
          }
        }
        
        @keyframes float-leaf {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.4;
          }
          100% {
            transform: translateY(-60px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        
        .animate-float-wildlife {
          animation: float-wildlife infinite ease-in-out;
        }
        
        .animate-float-bubble {
          animation: float-bubble infinite ease-in-out;
        }
        
        .animate-float-leaf {
          animation: float-leaf infinite ease-in-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .card-3d {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card-3d:hover {
          transform: translateY(-10px) rotateX(5deg);
          box-shadow: 0 25px 40px -12px rgba(0,0,0,0.3);
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};

export default ArbaMinchGallery;
