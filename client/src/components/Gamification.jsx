import React, { useState, useEffect } from 'react';
import './Gamification.css';

const Gamification = () => {
  const [userStats, setUserStats] = useState({
    points: 1250,
    level: 3,
    xp: 450,
    nextLevelXp: 1000,
    badges: [],
    streak: 15,
    bookings: 3,
    reviews: 3,
    referrals: 2
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loadingRewards, setLoadingRewards] = useState(false);

  const badges = [
    { id: 1, name: 'First Step', icon: '👣', requirement: 'First booking', earned: true, xp: 50, description: 'Complete your first booking' },
    { id: 2, name: 'Explorer', icon: '🗺️', requirement: '5 bookings', earned: false, xp: 200, progress: 3, description: 'Book 5 tours' },
    { id: 3, name: 'Culture Enthusiast', icon: '🏺', requirement: 'Visit Dorze Village', earned: true, xp: 100, description: 'Experience local culture' },
    { id: 4, name: 'Wildlife Photographer', icon: '📸', requirement: 'Crocodile spotting', earned: false, xp: 150, progress: 1, description: 'Spot wildlife on tour' },
    { id: 5, name: 'Local Expert', icon: '🎓', requirement: '10+ bookings', earned: false, xp: 500, progress: 3, description: 'Become a regular visitor' },
    { id: 6, name: 'Ambassador', icon: '🌟', requirement: 'Refer 5 friends', earned: false, xp: 300, progress: 2, description: 'Share with friends' },
    { id: 7, name: 'Early Bird', icon: '🐦', requirement: 'Book 30 days in advance', earned: true, xp: 75, description: 'Plan ahead' },
    { id: 8, name: 'Social Butterfly', icon: '🦋', requirement: 'Share 10 photos', earned: false, xp: 100, progress: 4, description: 'Share your experiences' },
    { id: 9, name: 'Review Master', icon: '⭐', requirement: '10 reviews', earned: false, xp: 150, progress: 3, description: 'Write helpful reviews' },
    { id: 10, name: 'Eco Warrior', icon: '🌱', requirement: 'Carbon offset', earned: false, xp: 200, description: 'Support sustainability' },
    { id: 11, name: 'Night Owl', icon: '🦉', requirement: 'Evening tour', earned: false, xp: 80, description: 'Experience sunset tours' },
    { id: 12, name: 'Adventure Seeker', icon: '🚣', requirement: 'Water activities', earned: false, xp: 120, progress: 1, description: 'Try water sports' }
  ];

  const rewards = [
    { id: 1, points: 500, reward: '$10 Discount', icon: '💰', description: 'Off your next booking', category: 'discount' },
    { id: 2, points: 1000, reward: 'Free Boat Tour', icon: '🚤', description: 'Lake Chamo safari', category: 'experience' },
    { id: 3, points: 2000, reward: 'Free Hotel Night', icon: '🏨', description: 'Standard room', category: 'accommodation' },
    { id: 4, points: 5000, reward: 'VIP Experience', icon: '👑', description: 'Personal guide + lunch', category: 'premium' },
    { id: 5, points: 750, reward: 'Photo Package', icon: '📷', description: 'Professional photoshoot', category: 'experience' },
    { id: 6, points: 1500, reward: 'Cultural Workshop', icon: '🎨', description: 'Traditional craft lesson', category: 'experience' },
    { id: 7, points: 3000, reward: 'Airport Transfer', icon: '🚗', description: 'VIP pickup service', category: 'transport' },
    { id: 8, points: 10000, reward: 'Lifetime Gold', icon: '🏆', description: 'Permanent VIP status', category: 'premium' }
  ];

  const achievements = [
    { name: 'Booking Streak', value: userStats.streak, target: 30, icon: '🔥', color: '#ef4444' },
    { name: 'Total Points', value: userStats.points, target: 5000, icon: '⭐', color: '#eab308' },
    { name: 'Badges Earned', value: badges.filter(b => b.earned).length, target: 12, icon: '🏆', color: '#10b981' },
    { name: 'Reviews Written', value: userStats.reviews, target: 10, icon: '📝', color: '#3b82f6' },
    { name: 'Friends Referred', value: userStats.referrals, target: 5, icon: '👥', color: '#8b5cf6' }
  ];

  const dailyChallenges = [
    { id: 1, title: 'Explorer Daily', description: 'Book any tour today', points: 100, icon: '🗺️', difficulty: 'easy' },
    { id: 2, title: 'Social Share', description: 'Share a photo from your visit', points: 50, icon: '📸', difficulty: 'easy' },
    { id: 3, title: 'Review Writer', description: 'Write a detailed review', points: 75, icon: '⭐', difficulty: 'medium' },
    { id: 4, title: 'Friend Referral', description: 'Invite a friend to join', points: 150, icon: '👥', difficulty: 'medium' },
    { id: 5, title: 'Wildlife Spotter', description: 'Spot 3 different animals', points: 200, icon: '🦁', difficulty: 'hard' }
  ];

  useEffect(() => {
    // Set random daily challenge
    const randomChallenge = dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];
    setDailyChallenge(randomChallenge);
  }, []);

  const levelProgress = (userStats.xp / userStats.nextLevelXp) * 100;
  const earnedBadges = badges.filter(badge => badge.earned);
  const availableRewards = rewards.filter(reward => userStats.points >= reward.points);

  const redeemReward = async (reward) => {
    setLoadingRewards(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUserStats(prev => ({
        ...prev,
        points: prev.points - reward.points
      }));

      alert(`Successfully redeemed: ${reward.reward}!`);
    } catch (error) {
      alert('Failed to redeem reward. Please try again.');
    } finally {
      setLoadingRewards(false);
    }
  };

  const acceptChallenge = () => {
    alert('Challenge accepted! Complete it to earn bonus points.');
  };

  const shareAchievement = (badge) => {
    alert(`Share your "${badge.name}" badge on social media!`);
  };

  return (
    <div className="gamification">
      {/* Header */}
      <div className="loyalty-header">
        <div className="header-content">
          <div className="header-text">
            <h1>🏆 Loyalty Rewards</h1>
            <p>Earn points, unlock badges, and get exclusive benefits!</p>
          </div>
          <div className="points-display">
            <div className="points-value">{userStats.points.toLocaleString()}</div>
            <div className="points-label">Total Points</div>
          </div>
        </div>
        
        {/* Level Progress */}
        <div className="level-progress">
          <div className="level-info">
            <span className="level-text">Level {userStats.level}</span>
            <span className="xp-text">{userStats.xp} / {userStats.nextLevelXp} XP</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="navigation-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          🏆 Badges
        </button>
        <button 
          className={`tab-button ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          🎁 Rewards
        </button>
        <button 
          className={`tab-button ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          ⚡ Challenges
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          {/* Achievements Grid */}
          <div className="achievements-section">
            <h2>Your Achievements</h2>
            <div className="achievements-grid">
              {achievements.map(achievement => (
                <div key={achievement.name} className="achievement-card">
                  <div className="achievement-icon" style={{ color: achievement.color }}>
                    {achievement.icon}
                  </div>
                  <div className="achievement-info">
                    <div className="achievement-value">{achievement.value}</div>
                    <div className="achievement-target">/ {achievement.target}</div>
                  </div>
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-progress">
                    <div 
                      className="achievement-bar"
                      style={{ 
                        width: `${Math.min((achievement.value / achievement.target) * 100, 100)}%`,
                        backgroundColor: achievement.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Badges */}
          <div className="recent-badges">
            <h2>Recent Badges</h2>
            <div className="badges-showcase">
              {earnedBadges.slice(-4).map(badge => (
                <div key={badge.id} className="badge-showcase">
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-name">{badge.name}</div>
                  <div className="badge-xp">+{badge.xp} XP</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="tab-content">
          <div className="badges-section">
            <h2>Badges Collection</h2>
            <div className="badges-grid">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}
                >
                  <div className="badge-header">
                    <div className="badge-icon-large">{badge.icon}</div>
                    {badge.earned && (
                      <button 
                        className="share-button"
                        onClick={() => shareAchievement(badge)}
                      >
                        📤
                      </button>
                    )}
                  </div>
                  <div className="badge-info">
                    <h3>{badge.name}</h3>
                    <p>{badge.description}</p>
                    <div className="badge-requirement">{badge.requirement}</div>
                    {badge.earned ? (
                      <div className="badge-xp-earned">+{badge.xp} XP Earned</div>
                    ) : (
                      <div className="badge-progress">
                        <div className="progress-text">Progress: {badge.progress || 0}/5</div>
                        <div className="progress-bar-small">
                          <div 
                            className="progress-fill-small"
                            style={{ width: `${((badge.progress || 0) / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="tab-content">
          <div className="rewards-section">
            <h2>Rewards Store</h2>
            <div className="rewards-grid">
              {rewards.map(reward => (
                <div
                  key={reward.id}
                  className={`reward-card ${userStats.points >= reward.points ? 'available' : 'locked'}`}
                >
                  <div className="reward-icon">{reward.icon}</div>
                  <h3>{reward.reward}</h3>
                  <p>{reward.description}</p>
                  <div className="reward-category">{reward.category}</div>
                  <div className="reward-points">{reward.points.toLocaleString()} points</div>
                  <button
                    onClick={() => redeemReward(reward)}
                    disabled={userStats.points < reward.points || loadingRewards}
                    className={`redeem-button ${userStats.points >= reward.points ? 'can-redeem' : 'cannot-redeem'}`}
                  >
                    {loadingRewards ? '⏳ Processing...' : 'Redeem'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="tab-content">
          {/* Daily Challenge */}
          {dailyChallenge && (
            <div className="daily-challenge">
              <div className="challenge-header">
                <h2>⚡ Daily Challenge</h2>
                <div className="challenge-difficulty">{dailyChallenge.difficulty}</div>
              </div>
              <div className="challenge-content">
                <div className="challenge-icon">{dailyChallenge.icon}</div>
                <div className="challenge-info">
                  <h3>{dailyChallenge.title}</h3>
                  <p>{dailyChallenge.description}</p>
                  <div className="challenge-points">+{dailyChallenge.points} points</div>
                </div>
                <button 
                  onClick={acceptChallenge}
                  className="accept-button"
                >
                  Accept Challenge
                </button>
              </div>
            </div>
          )}

          {/* All Challenges */}
          <div className="all-challenges">
            <h2>Available Challenges</h2>
            <div className="challenges-list">
              {dailyChallenges.map(challenge => (
                <div key={challenge.id} className="challenge-item">
                  <div className="challenge-icon-small">{challenge.icon}</div>
                  <div className="challenge-details">
                    <h4>{challenge.title}</h4>
                    <p>{challenge.description}</p>
                    <div className="challenge-meta">
                      <span className="challenge-points-small">+{challenge.points} points</span>
                      <span className={`difficulty-badge ${challenge.difficulty}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gamification;
