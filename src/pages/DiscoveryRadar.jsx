import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Filter, Star, Zap, Activity, X, Heart } from 'lucide-react';
import './DiscoveryRadar.css';

const DiscoveryRadar = () => {
  const [activeTab, setActiveTab] = useState('All Matches');
  const [currentIndex, setCurrentIndex] = useState(0);

  const grants = [
    {
      id: 1,
      title: 'Lumina Foundation Catalyst Fund',
      funder: 'Lumina Foundation',
      amount: '$150,000',
      deadline: 'Nov 15, 2026',
      matchScore: 94,
      tags: ['Education', 'Tech'],
      status: 'High Probability',
      description: 'Funding for innovative tech solutions in education.'
    },
    {
      id: 2,
      title: 'Global Tech Endowment for Youth',
      funder: 'Global Tech Initiatives',
      amount: '$75,000',
      deadline: 'Dec 01, 2026',
      matchScore: 88,
      tags: ['Youth', 'STEM'],
      status: 'Strong Match',
      description: 'Empowering the next generation of engineers.'
    },
    {
      id: 3,
      title: 'Community Wellness Grant 2027',
      funder: 'Apex Health Partners',
      amount: '$50,000',
      deadline: 'Jan 10, 2027',
      matchScore: 72,
      tags: ['Health', 'Community'],
      status: 'Moderate Match',
      description: 'Local initiatives to improve public health.'
    }
  ];

  const handleSwipe = (direction) => {
    // In a real app, 'left' dismisses, 'right' saves to Vault/Oracle
    setCurrentIndex(prev => Math.min(prev + 1, grants.length - 1));
  };

  return (
    <div className="page-container">
      <Navbar title="Discovery Radar" />
      
      <div className="page-content animate-fade-in">
        <div className="radar-header">
          <div className="radar-title-section">
            <Activity className="text-gold glow-text" size={32} />
            <div>
              <h3 className="font-display text-2xl">Algorithmic Match Engine</h3>
              <p className="text-muted">Scanning global databases against your DNA profile.</p>
            </div>
          </div>
          
          <div className="radar-filters desktop-only">
            <button className="btn btn-outline">
              <Filter size={18} />
              <span>Advanced Filters</span>
            </button>
          </div>
        </div>

        <div className="tabs-container">
          {['All Matches', 'High Probability', 'Saved'].map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mobile Swipe Stack Layout */}
        <div className="swipe-stack-container mobile-only">
          {currentIndex < grants.length ? (
            <div className="swipe-card-wrapper">
              <GlassCard className="swipe-card">
                <div className="grant-card-header">
                  <div className="match-score-badge">
                    <Zap size={16} />
                    <span>{grants[currentIndex].matchScore}% Match</span>
                  </div>
                </div>
                <div className="grant-card-body text-center mt-8">
                  <h2 className="text-3xl font-display mb-2">{grants[currentIndex].title}</h2>
                  <p className="text-xl text-gold mb-8">{grants[currentIndex].funder}</p>
                  
                  <div className="flex justify-center gap-8 mb-8">
                    <div>
                      <p className="text-muted text-sm uppercase">Amount</p>
                      <p className="text-2xl font-bold">{grants[currentIndex].amount}</p>
                    </div>
                    <div>
                      <p className="text-muted text-sm uppercase">Deadline</p>
                      <p className="text-xl">{grants[currentIndex].deadline}</p>
                    </div>
                  </div>
                  
                  <p className="text-secondary">{grants[currentIndex].description}</p>
                </div>
              </GlassCard>
              
              <div className="swipe-actions">
                <button className="swipe-btn pass-btn" onClick={() => handleSwipe('left')}>
                  <X size={32} />
                </button>
                <button className="swipe-btn save-btn" onClick={() => handleSwipe('right')}>
                  <Heart size={32} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center mt-20 text-muted">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <h3>No more grants in radar.</h3>
            </div>
          )}
        </div>

        {/* Desktop Grid Layout */}
        <div className="grants-grid desktop-only">
          {grants.map(grant => (
            <GlassCard key={grant.id} className="grant-card interactive">
              <div className="grant-card-header">
                <div className="match-score-badge">
                  <Zap size={16} />
                  <span>{grant.matchScore}% Match</span>
                </div>
                <button className="icon-btn-small">
                  <Star size={18} className="text-muted hover:text-gold" />
                </button>
              </div>
              
              <div className="grant-card-body">
                <h4 className="grant-title font-display">{grant.title}</h4>
                <p className="grant-funder text-secondary">{grant.funder}</p>
                
                <div className="grant-details">
                  <div className="detail-item">
                    <span className="detail-label">Amount</span>
                    <span className="detail-value text-primary">{grant.amount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Deadline</span>
                    <span className="detail-value text-primary">{grant.deadline}</span>
                  </div>
                </div>

                <div className="grant-tags">
                  {grant.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="grant-card-footer mt-6">
                <button className="btn w-full btn-primary">
                  <span>Send to Oracle Writer</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryRadar;
