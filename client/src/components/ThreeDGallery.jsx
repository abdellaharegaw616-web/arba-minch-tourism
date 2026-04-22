import React, { useState, useEffect } from 'react';
import './ThreeDGallery.css';

const ThreeDGallery = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const attractions = [
    {
      id: 1,
      name: "Lake Chamo",
      description: "Famous for Nile crocodiles and hippos",
      emoji: "🐊",
      color: "#3b82f6",
      images: ["🐊", "🦛", "⛵", "🌅"]
    },
    {
      id: 2,
      name: "Nech Sar National Park",
      description: "Home to zebras and gazelles",
      emoji: "🦓",
      color: "#10b981",
      images: ["🦓", "🦌", "🦒", "🦜"]
    },
    {
      id: 3,
      name: "Forty Springs",
      description: "Natural springs and hiking trails",
      emoji: "⛲",
      color: "#06b6d4",
      images: ["⛲", "🥾", "🌿", "💧"]
    },
    {
      id: 4,
      name: "Dorze Village",
      description: "Traditional bamboo houses and weaving",
      emoji: "🏚️",
      color: "#f59e0b",
      images: ["🏚️", "🧺", "☕", "🎭"]
    },
    {
      id: 5,
      name: "Bridge of God",
      description: "Natural land bridge between lakes",
      emoji: "🌉",
      color: "#8b5cf6",
      images: ["🌉", "🗻", "🌊", "🏔️"]
    },
    {
      id: 6,
      name: "Crocodile Ranch",
      description: "Conservation center and education",
      emoji: "🐊",
      color: "#ef4444",
      images: ["🐊", "📚", "🔬", "🌍"]
    }
  ];

  useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % attractions.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRotate, attractions.length]);

  const handleImageClick = (index) => {
    setCurrentImage(index);
    setAutoRotate(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`three-d-gallery ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="gallery-header">
        <h2>🌍 3D Arba Minch Gallery</h2>
        <div className="controls">
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className={`control-btn ${autoRotate ? 'active' : ''}`}
          >
            {autoRotate ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button onClick={toggleFullscreen} className="control-btn">
            {isFullscreen ? '🗗️ Exit Fullscreen' : '🗖️ Fullscreen'}
          </button>
        </div>
      </div>

      <div className="carousel-container">
        <div className="carousel-3d">
          {attractions.map((attraction, index) => {
            const angle = (index - currentImage) * (360 / attractions.length);
            const isActive = index === currentImage;
            
            return (
              <div
                key={attraction.id}
                className={`carousel-item ${isActive ? 'active' : ''}`}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(300px)`,
                  opacity: Math.abs(angle) > 90 ? 0.3 : 1,
                }}
                onClick={() => handleImageClick(index)}
              >
                <div 
                  className="attraction-card"
                  style={{ backgroundColor: attraction.color }}
                >
                  <div className="card-emoji">{attraction.emoji}</div>
                  <div className="card-content">
                    <h3>{attraction.name}</h3>
                    <p>{attraction.description}</p>
                    <div className="image-gallery">
                      {attraction.images.map((img, imgIndex) => (
                        <span key={imgIndex} className="mini-image">{img}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="thumbnail-strip">
        {attractions.map((attraction, index) => (
          <button
            key={attraction.id}
            onClick={() => handleImageClick(index)}
            className={`thumbnail ${index === currentImage ? 'active' : ''}`}
          >
            <span>{attraction.emoji}</span>
            <span className="thumbnail-label">{attraction.name}</span>
          </button>
        ))}
      </div>

      <div className="info-panel">
        <h3>{attractions[currentImage].name}</h3>
        <p>{attractions[currentImage].description}</p>
        <div className="action-buttons">
          <button className="btn-primary">📸 View Photos</button>
          <button className="btn-secondary">🎥 Watch Video</button>
          <button className="btn-tertiary">📍 Visit Location</button>
        </div>
      </div>
    </div>
  );
};

export default ThreeDGallery;
