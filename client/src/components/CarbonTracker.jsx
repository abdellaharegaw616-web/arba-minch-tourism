import React, { useState, useEffect } from 'react';
import './CarbonTracker.css';

const CarbonTracker = ({ booking }) => {
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [offsetProjects, setOffsetProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [offsetAmount, setOffsetAmount] = useState(0);
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [loadingOffset, setLoadingOffset] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    calculateCarbon();
    loadOffsetProjects();
  }, [booking]);

  const calculateCarbon = () => {
    // Calculate based on flights, accommodation, activities
    const flight = (booking?.flightDistance || 500) * 0.15; // kg CO2 per km
    const accommodation = (booking?.nights || 3) * 15; // kg CO2 per night
    const activities = (booking?.activities?.length || 4) * 5; // kg CO2 per activity
    const transport = (booking?.transportType === 'car' ? 50 : 20); // Local transport
    const total = flight + accommodation + activities + transport;
    
    setCarbonFootprint(total);
    setTreesPlanted(Math.ceil(total / 21)); // Each tree absorbs 21kg CO2/year
  };

  const loadOffsetProjects = () => {
    const projects = [
      {
        id: 1,
        name: "Nech Sar Forest Restoration",
        location: "Nech Sar National Park",
        description: "Restoring native forest habitat for wildlife and biodiversity conservation",
        costPerTon: 5,
        carbonOffset: 100,
        image: "🌲",
        category: "reforestation",
        impact: "Wildlife habitat restoration",
        verified: true
      },
      {
        id: 2,
        name: "Lake Chamo Cleanup Initiative",
        location: "Lake Chamo",
        description: "Removing plastic waste and protecting aquatic ecosystems",
        costPerTon: 3,
        carbonOffset: 50,
        image: "🌊",
        category: "cleanup",
        impact: "Clean water and marine life protection",
        verified: true
      },
      {
        id: 3,
        name: "Dorze Village Solar Project",
        location: "Dorze Village",
        description: "Installing solar panels for clean energy and community development",
        costPerTon: 8,
        carbonOffset: 200,
        image: "☀️",
        category: "renewable",
        impact: "Clean energy access for communities",
        verified: true
      },
      {
        id: 4,
        name: "Arba Minch Tree Planting",
        location: "Arba Minch Region",
        description: "Community-led tree planting for carbon sequestration",
        costPerTon: 4,
        carbonOffset: 75,
        image: "🌳",
        category: "reforestation",
        impact: "Community reforestation efforts",
        verified: true
      },
      {
        id: 5,
        name: "Sustainable Agriculture Program",
        location: "Rural Communities",
        description: "Promoting sustainable farming practices and soil conservation",
        costPerTon: 6,
        carbonOffset: 120,
        image: "🌾",
        category: "agriculture",
        impact: "Sustainable food systems",
        verified: true
      },
      {
        id: 6,
        name: "Mango Park Conservation",
        location: "Mango National Park",
        description: "Protecting natural ecosystems and endangered species",
        costPerTon: 7,
        carbonOffset: 150,
        image: "🦁",
        category: "conservation",
        impact: "Biodiversity protection",
        verified: true
      }
    ];
    setOffsetProjects(projects);
  };

  const offsetCarbon = async (project) => {
    setLoadingOffset(true);
    try {
      const amount = carbonFootprint / 1000; // Convert to tons
      const cost = amount * project.costPerTon;
      
      setSelectedProject(project);
      setOffsetAmount(amount);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process payment (in real app, this would integrate with payment system)
      console.log('Carbon offset processed:', {
        projectId: project.id,
        amount: cost,
        carbonOffset: amount,
        treesEquivalent: treesPlanted
      });
      
      setShowCertificate(true);
    } catch (error) {
      alert('Failed to process carbon offset. Please try again.');
    } finally {
      setLoadingOffset(false);
    }
  };

  const emissionBreakdown = [
    {
      category: 'Flight',
      icon: '✈️',
      amount: (booking?.flightDistance || 500) * 0.15,
      color: '#3b82f6',
      description: 'Air travel emissions'
    },
    {
      category: 'Accommodation',
      icon: '🏨',
      amount: (booking?.nights || 3) * 15,
      color: '#10b981',
      description: 'Hotel stay emissions'
    },
    {
      category: 'Activities',
      icon: '🎯',
      amount: (booking?.activities?.length || 4) * 5,
      color: '#f59e0b',
      description: 'Tour activities emissions'
    },
    {
      category: 'Local Transport',
      icon: '🚗',
      amount: booking?.transportType === 'car' ? 50 : 20,
      color: '#8b5cf6',
      description: 'Ground transportation'
    }
  ];

  const ecoTips = [
    { icon: '💧', title: 'Use reusable water bottles', description: 'Reduce plastic waste' },
    { icon: '🌳', title: 'Support local businesses', description: 'Boost local economy' },
    { icon: '🌬️', title: 'Choose eco-lodges', description: 'Sustainable accommodation' },
    { icon: '🍃', title: 'Respect wildlife', description: 'Keep safe distance' },
    { icon: '♻️', title: 'Recycle waste', description: 'Proper waste management' },
    { icon: '🚶', title: 'Walk or bike', description: 'Reduce transport emissions' },
    { icon: '🌱', title: 'Plant trees', description: 'Support reforestation' },
    { icon: '💚', title: 'Choose local food', description: 'Reduce food miles' }
  ];

  const totalOffsetCost = (carbonFootprint / 1000) * 5; // Average $5 per ton

  return (
    <div className="carbon-tracker">
      {/* Header */}
      <div className="tracker-header">
        <div className="header-content">
          <div className="header-text">
            <h1>🍃 Carbon Footprint Tracker</h1>
            <p>Track and offset your travel impact on the environment</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tracker-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'breakdown' ? 'active' : ''}`}
          onClick={() => setActiveTab('breakdown')}
        >
          📈 Breakdown
        </button>
        <button 
          className={`tab-button ${activeTab === 'offset' ? 'active' : ''}`}
          onClick={() => setActiveTab('offset')}
        >
          🌿 Offset
        </button>
        <button 
          className={`tab-button ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          💡 Eco Tips
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          {/* Carbon Footprint Summary */}
          <div className="footprint-summary">
            <div className="summary-card">
              <div className="summary-icon">🌍</div>
              <div className="summary-value">{carbonFootprint.toFixed(0)} kg</div>
              <div className="summary-label">CO₂ Emissions</div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🌳</div>
              <div className="summary-value">{treesPlanted}</div>
              <div className="summary-label">Trees Needed</div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-value">${totalOffsetCost.toFixed(2)}</div>
              <div className="summary-label">Offset Cost</div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🌡️</div>
              <div className="summary-value">{(carbonFootprint / 1000).toFixed(2)} tons</div>
              <div className="summary-label">Carbon Tons</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button 
                onClick={() => setActiveTab('offset')}
                className="action-card primary"
              >
                <span className="action-icon">🌿</span>
                <span className="action-title">Offset Now</span>
                <span className="action-desc">Neutralize your impact</span>
              </button>
              <button 
                onClick={() => setActiveTab('breakdown')}
                className="action-card secondary"
              >
                <span className="action-icon">📊</span>
                <span className="action-title">View Details</span>
                <span className="action-desc">See breakdown</span>
              </button>
              <button 
                onClick={() => setActiveTab('tips')}
                className="action-card secondary"
              >
                <span className="action-icon">💡</span>
                <span className="action-title">Eco Tips</span>
                <span className="action-desc">Reduce impact</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breakdown Tab */}
      {activeTab === 'breakdown' && (
        <div className="tab-content">
          <div className="emission-breakdown">
            <h2>📊 Emission Breakdown</h2>
            <div className="breakdown-list">
              {emissionBreakdown.map((item, index) => (
                <div key={item.category} className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-icon">{item.icon}</span>
                    <span className="breakdown-category">{item.category}</span>
                    <span className="breakdown-amount">{item.amount.toFixed(0)} kg</span>
                  </div>
                  <div className="breakdown-description">{item.description}</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(item.amount / carbonFootprint) * 100}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="total-emissions">
              <div className="total-row">
                <span>Total Emissions:</span>
                <span className="total-value">{carbonFootprint.toFixed(0)} kg CO₂</span>
              </div>
              <div className="total-row">
                <span>Equivalent to:</span>
                <span>{(carbonFootprint / 21).toFixed(1)} trees needed for offset</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offset Tab */}
      {activeTab === 'offset' && (
        <div className="tab-content">
          <div className="offset-section">
            <h2>🌿 Offset Your Impact</h2>
            <div className="offset-info">
              <p>Choose a project to offset your carbon footprint and support environmental initiatives in Ethiopia.</p>
              <div className="offset-summary">
                <span>Your trip emits: <strong>{carbonFootprint.toFixed(0)} kg CO₂</strong></span>
                <span>Cost to offset: <strong>${totalOffsetCost.toFixed(2)}</strong></span>
              </div>
            </div>

            <div className="projects-grid">
              {offsetProjects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-image">{project.image}</div>
                  <div className="project-content">
                    <div className="project-header">
                      <h3>{project.name}</h3>
                      {project.verified && (
                        <span className="verified-badge">✅ Verified</span>
                      )}
                    </div>
                    <p className="project-location">📍 {project.location}</p>
                    <p className="project-description">{project.description}</p>
                    <div className="project-impact">
                      <span className="impact-label">Impact:</span>
                      <span className="impact-text">{project.impact}</span>
                    </div>
                    <div className="project-pricing">
                      <span className="price">${project.costPerTon}</span>
                      <span className="price-unit">per ton CO₂</span>
                    </div>
                    <button
                      onClick={() => offsetCarbon(project)}
                      disabled={loadingOffset}
                      className="offset-button"
                    >
                      {loadingOffset && selectedProject?.id === project.id 
                        ? '⏳ Processing...' 
                        : `Offset My Trip - $${totalOffsetCost.toFixed(2)}`
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === 'tips' && (
        <div className="tab-content">
          <div className="eco-tips">
            <h2>💡 Eco-Friendly Travel Tips</h2>
            <div className="tips-grid">
              {ecoTips.map((tip, index) => (
                <div key={index} className="tip-card">
                  <span className="tip-icon">{tip.icon}</span>
                  <h3>{tip.title}</h3>
                  <p>{tip.description}</p>
                </div>
              ))}
            </div>
            
            <div className="additional-resources">
              <h3>📚 Additional Resources</h3>
              <div className="resources-list">
                <a href="#" className="resource-link">🌍 Sustainable Travel Guide</a>
                <a href="#" className="resource-link">🌱 Carbon Calculator</a>
                <a href="#" className="resource-link">🦁 Wildlife Conservation</a>
                <a href="#" className="resource-link">🏞️ National Parks Info</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && selectedProject && (
        <div className="certificate-modal">
          <div className="certificate-content">
            <div className="certificate-header">
              <span className="certificate-icon">🏅</span>
              <h2>Green Traveler Certificate</h2>
            </div>
            <div className="certificate-body">
              <p>This certifies that</p>
              <h3>You</h3>
              <p>have successfully offset</p>
              <div className="certificate-amount">{offsetAmount.toFixed(1)} tons of CO₂</div>
              <p>by supporting</p>
              <h4>{selectedProject.name}</h4>
              <div className="certificate-details">
                <div className="detail-row">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span>Trees Equivalent:</span>
                  <span>{treesPlanted} trees</span>
                </div>
                <div className="detail-row">
                  <span>Project Location:</span>
                  <span>{selectedProject.location}</span>
                </div>
              </div>
            </div>
            <div className="certificate-actions">
              <button 
                onClick={() => window.print()}
                className="print-button"
              >
                🖨️ Print Certificate
              </button>
              <button 
                onClick={() => setShowCertificate(false)}
                className="close-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarbonTracker;
