import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import './LiveTracking.css';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '20px'
};

const center = {
  lat: 6.0333,
  lng: 37.55
};

const LiveTracking = ({ tourId = 'tour-001', guideId = 'guide-001' }) => {
  const [guideLocation, setGuideLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [emergency, setEmergency] = useState(false);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'
  });

  // Simulate guide location updates
  useEffect(() => {
    const guideLocations = [
      { lat: 6.0333, lng: 37.55 }, // Lake Chamo area
      { lat: 6.0340, lng: 37.5510 }, // Near boat dock
      { lat: 6.0350, lng: 37.5520 }, // Crocodile viewing point
      { lat: 6.0360, lng: 37.5530 }, // Hippo pod area
      { lat: 6.0370, lng: 37.5540 }, // Nech Sar entrance
    ];

    let index = 0;
    const interval = setInterval(() => {
      setGuideLocation(guideLocations[index]);
      
      // Simulate ETA calculation
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.lat, userLocation.lng,
          guideLocations[index].lat, guideLocations[index].lng
        );
        setEta(Math.round(distance * 2)); // Rough ETA in minutes
      }
      
      index = (index + 1) % guideLocations.length;
    }, 8000);

    return () => clearInterval(interval);
  }, [userLocation]);

  // Get user location
  useEffect(() => {
    if (sharingLocation && 'geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          
          // Add to tracking history
          setTrackingHistory(prev => [...prev.slice(-20), {
            ...newLocation,
            timestamp: new Date()
          }]);
          
          // Send to server (simulated)
          console.log('Location updated:', newLocation);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to Arba Minch center
          setUserLocation({ lat: 6.0333, lng: 37.55 });
        },
        { 
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [sharingLocation]);

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const triggerEmergency = async () => {
    setEmergency(true);
    
    // Send emergency alert (simulated)
    try {
      console.log('Emergency alert sent:', {
        userId: 'current-user',
        location: userLocation,
        tourId,
        message: 'SOS! Emergency assistance needed immediately',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
    }
    
    // Play alert sound (simulated with beep)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // SOS frequency
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 SOS Alert Sent!', {
        body: 'Emergency services have been notified. Stay safe!',
        icon: '🚨'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('🚨 SOS Alert Sent!', {
            body: 'Emergency services have been notified. Stay safe!',
            icon: '🚨'
          });
        }
      });
    }
  };

  const requestLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location permission denied:', error);
          // Use default Arba Minch location
          setUserLocation({ lat: 6.0333, lng: 37.55 });
        }
      );
    }
  };

  // Custom marker icons
  const userIcon = {
    url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
        <text x="20" y="25" text-anchor="middle" fill="white" font-size="20">👤</text>
      </svg>
    `),
    scaledSize: { width: 40, height: 40 }
  };

  const guideIcon = {
    url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#10b981" stroke="#059669" stroke-width="2"/>
        <text x="20" y="25" text-anchor="middle" fill="white" font-size="20">🧭</text>
      </svg>
    `),
    scaledSize: { width: 40, height: 40 }
  };

  if (!isLoaded) {
    return (
      <div className="live-tracking">
        <div className="loading-map">
          <div className="loading-spinner">🗺️ Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="live-tracking">
      <div className="tracking-header">
        <h2>📍 Live Location Tracking</h2>
        <div className="tracking-status">
          <span className={`status-dot ${sharingLocation ? 'active' : ''}`}></span>
          {sharingLocation ? 'Tracking Active' : 'Tracking Inactive'}
        </div>
      </div>

      {/* Google Map */}
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || center}
          zoom={15}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ],
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            fullscreenControl: true
          }}
        >
          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={userIcon}
              onClick={() => setSelectedMarker({ type: 'user', position: userLocation })}
            />
          )}
          
          {/* Guide Location Marker */}
          {guideLocation && (
            <Marker
              position={guideLocation}
              icon={guideIcon}
              onClick={() => setSelectedMarker({ type: 'guide', position: guideLocation })}
            />
          )}
          
          {/* Route Line */}
          {userLocation && guideLocation && (
            <Polyline
              path={[userLocation, guideLocation]}
              options={{
                strokeColor: '#10b981',
                strokeOpacity: 1.0,
                strokeWeight: 3,
                geodesic: true
              }}
            />
          )}
          
          {/* Info Windows */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="map-info-window">
                <h4>{selectedMarker.type === 'user' ? 'Your Location' : 'Guide Location'}</h4>
                <p>Lat: {selectedMarker.position.lat.toFixed(6)}</p>
                <p>Lng: {selectedMarker.position.lng.toFixed(6)}</p>
                {selectedMarker.type === 'guide' && eta && (
                  <p><strong>ETA: {eta} minutes</strong></p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Safety Panel */}
      <div className="safety-panel">
        <h3>🛡️ Safety Features</h3>
        
        <button
          onClick={triggerEmergency}
          className="sos-button"
        >
          🆘 SOS EMERGENCY
        </button>
        
        {!sharingLocation ? (
          <button
            onClick={requestLocationPermission}
            className="location-button"
          >
            📍 Enable Location Tracking
          </button>
        ) : (
          <button
            onClick={() => setSharingLocation(!sharingLocation)}
            className={`location-button ${sharingLocation ? 'active' : ''}`}
          >
            📍 {sharingLocation ? 'Stop Sharing' : 'Resume Sharing'}
          </button>
        )}
        
        {eta && (
          <div className="eta-info">
            🚗 Guide ETA: <strong>{eta} minutes</strong>
          </div>
        )}
        
        <div className="emergency-contacts">
          <div className="contact-item">
            📞 Emergency: <strong>+251-911-111-111</strong>
          </div>
          <div className="contact-item">
            🏥 Nearest Hospital: <strong>5 min away</strong>
          </div>
          <div className="contact-item">
            🚁 Tourist Police: <strong>+251-911-222-222</strong>
          </div>
        </div>
      </div>

      {/* Tracking History */}
      {trackingHistory.length > 0 && (
        <div className="tracking-history">
          <h4>📍 Recent Locations</h4>
          <div className="history-list">
            {trackingHistory.slice(-5).reverse().map((location, index) => (
              <div key={index} className="history-item">
                <span className="history-time">
                  {location.timestamp.toLocaleTimeString()}
                </span>
                <span className="history-coords">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Alert Modal */}
      {emergency && (
        <div className="emergency-modal">
          <div className="emergency-content">
            <div className="emergency-icon">🚨</div>
            <h2>EMERGENCY ALERT SENT!</h2>
            <p>Your location has been shared with our emergency response team. Help is on the way.</p>
            <div className="emergency-details">
              <div><strong>Location:</strong> {userLocation?.lat.toFixed(4)}, {userLocation?.lng.toFixed(4)}</div>
              <div><strong>Time:</strong> {new Date().toLocaleTimeString()}</div>
              <div><strong>Tour ID:</strong> {tourId}</div>
            </div>
            <button
              onClick={() => setEmergency(false)}
              className="emergency-ok"
            >
              OK, I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;
