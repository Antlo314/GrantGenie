import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Filter, Star, Zap, Activity } from 'lucide-react';
import './DiscoveryRadar.css';

const DiscoveryRadar = () => {
  const [activeTab, setActiveTab] = useState('All Matches');

  const grants = [
    {
      id: 1,
      title: 'Lumina Foundation Catalyst Fund',
      funder: 'Lumina Foundation',
      amount: '$150,000',
      deadline: 'Nov 15, 2026',
      matchScore: 94,
      tags: ['Education', 'Tech'],
      status: 'High Probability'
    },
    {
      id: 2,
      title: 'Global Tech Endowment for Youth',
      funder: 'Global Tech Initiatives',
      amount: '$75,000',
      deadline: 'Dec 01, 2026',
      matchScore: 88,
      tags: ['Youth', 'STEM'],
      status: 'Strong Match'
    },
    {
      id: 3,
      title: 'Community Wellness Grant 2027',
      funder: 'Apex Health Partners',
      amount: '$50,000',
      deadline: 'Jan 10, 2027',
      matchScore: 72,
      tags: ['Health', 'Community'],
      status: 'Moderate Match'
    }
  ];

  return (
    <div className="page-container">
      <Navbar title="Discovery Radar" />
      
      <div className="page-content animate-fade-in">
        <div className="radar-header">
          <div className="radar-title-section">
            <Activity className="text-gold" size={28} />
            <div>
              <h3 className="font-display">Algorithmic Match Engine</h3>
              <p className="text-muted">Scanning global databases against your Organizational DNA...</p>
            </div>
          </div>
          
          <div className="radar-filters">
            <button className="btn btn-outline">
              <Filter size={18} />
              <span>Advanced Filters</span>
            </button>
          </div>
        </div>

        <div className="tabs-container">
          {['All Matches', 'High Probability (>90%)', 'Saved Oracles', 'Hidden'].map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grants-grid">
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

              <div className="grant-card-footer">
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
