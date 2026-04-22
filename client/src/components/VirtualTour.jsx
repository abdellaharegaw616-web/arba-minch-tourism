import React, { useState, useEffect } from 'react';
import './VirtualTour.css';

const VirtualTour = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [info, setInfo] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scenes = [
    {
      id: 1,
      title: "Lake Chamo Panorama",
      description: "360° view of the famous crocodile lake",
      emoji: "🐊",
      color: "#3b82f6",
      hotspots: [
        { id: 1, position: { x: 20, y: 40 }, title: "Crocodile Viewing Point", info: "See Nile crocodiles basking in the sun! Best viewing time is 10-11 AM." },
        { id: 2, position: { x: 60, y: 30 }, title: "Hippo Pod", info: "Family of hippos swimming nearby. They're most active at dawn and dusk." },
        { id: 3, position: { x: 40, y: 60 }, title: "Boat Dock", info: "Start your boat safari here. Tours available daily from 8 AM to 5 PM." }
      ]
    },
    {
      id: 2,
      title: "Nech Sar National Park",
      description: "Savanna landscape with wildlife",
      emoji: "🦓",
      color: "#10b981",
      hotspots: [
        { id: 1, position: { x: 30, y: 35 }, title: "Zebra Grazing Area", info: "Plains zebras feeding on grass. Best photo opportunities in morning light." },
        { id: 2, position: { x: 70, y: 45 }, title: "Gazelle Herd", info: "Grant's gazelles grazing. They're very shy, approach quietly." },
        { id: 3, position: { x: 50, y: 25 }, title: "Bird Watching Tower", info: "Over 273 bird species. Bring binoculars for best viewing." }
      ]
    },
    {
      id: 3,
      title: "Forty Springs",
      description: "Natural springs and forest trail",
      emoji: "⛲",
      color: "#06b6d4",
      hotspots: [
        { id: 1, position: { x: 25, y: 50 }, title: "Main Spring", info: "The largest of the forty springs. Water temperature is 22°C year-round." },
        { id: 2, position: { x: 55, y: 35 }, title: "Hiking Trail", info: "5km loop trail. Takes about 2 hours to complete. Moderate difficulty." },
        { id: 3, position: { x: 75, y: 55 }, title: "Picnic Area", info: "Shaded area perfect for lunch. Tables and benches available." }
      ]
    },
    {
      id: 4,
      title: "Dorze Village",
      description: "Traditional bamboo house community",
      emoji: "🏚️",
      color: "#f59e0b",
      hotspots: [
        { id: 1, position: { x: 35, y: 45 }, title: "Weaving Workshop", info: "Traditional Dorze weaving. Cotton scarves and baskets for sale." },
        { id: 2, position: { x: 60, y: 30 }, title: "Bamboo House", info: "Unique elephant-shaped bamboo houses. Each house lasts 20-30 years." },
        { id: 3, position: { x: 45, y: 60 }, title: "Coffee Ceremony", info: "Traditional Ethiopian coffee ceremony. Daily at 3 PM." }
      ]
    }
  ];

  useEffect(() => {
    if (autoRotate && !isDragging) {
      const interval = setInterval(() => {
        setRotation(prev => prev + 0.5);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [autoRotate, isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setAutoRotate(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      setRotation(prev => prev + deltaX * 0.5);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setAutoRotate(false);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const deltaX = e.touches[0].clientX - startX;
      setRotation(prev => prev + deltaX * 0.5);
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const currentSceneData = scenes[currentScene];

  return (
    <div className={`virtual-tour ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="tour-header">
        <h2>🌍 Virtual Tour - Arba Minch</h2>
        <div className="controls">
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className={`control-btn ${autoRotate ? 'active' : ''}`}
          >
            {autoRotate ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button onClick={toggleFullscreen} className="control-btn">
            {isFullscreen ? '🗗️ Exit' : '🗖️ Fullscreen'}
          </button>
        </div>
      </div>

      <div 
        className="panorama-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="panorama-view"
          style={{
            transform: `rotateY(${rotation}deg)`,
            backgroundColor: currentSceneData.color
          }}
        >
          <div className="panorama-content">
            <div className="scene-emoji">{currentSceneData.emoji}</div>
            <div className="scene-pattern">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="pattern-element"
                  style={{
                    transform: `rotateY(${i * 30}deg) translateZ(200px)`
                  }}
                >
                  {currentSceneData.emoji}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotspots */}
        {currentSceneData.hotspots.map(hotspot => (
          <div
            key={hotspot.id}
            className="hotspot"
            style={{
              left: `${hotspot.position.x}%`,
              top: `${hotspot.position.y}%`
            }}
            onClick={() => setInfo(hotspot)}
          >
            <div className="hotspot-pulse"></div>
            <div className="hotspot-icon">📍</div>
          </div>
        ))}
      </div>

      {/* Scene Selector */}
      <div className="scene-selector">
        {scenes.map((scene, index) => (
          <button
            key={scene.id}
            onClick={() => setCurrentScene(index)}
            className={`scene-btn ${index === currentScene ? 'active' : ''}`}
          >
            <span className="scene-emoji-small">{scene.emoji}</span>
            <span className="scene-name">{scene.title}</span>
          </button>
        ))}
      </div>

      {/* Info Panel */}
      <div className="info-panel">
        <h3>{currentSceneData.title}</h3>
        <p>{currentSceneData.description}</p>
        <div className="scene-actions">
          <button className="action-btn primary">📸 Take Photo</button>
          <button className="action-btn secondary">🎥 Start Video</button>
          <button className="action-btn tertiary">📍 Get Directions</button>
        </div>
      </div>

      {/* Info Popup */}
      {info && (
        <div className="info-popup" onClick={() => setInfo(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>{info.title}</h3>
            <p>{info.info}</p>
            <button onClick={() => setInfo(null)} className="close-btn">
              ✖️ Close
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="instructions">
        <p>🖱️ Drag to rotate • 📍 Click hotspots for info • 🎮 Use controls below</p>
      </div>
    </div>
  );
};

export default VirtualTour;
