import React from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Target, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { label: 'Active Pipelines', value: '12', icon: Target, trend: '+2 this week', trendUp: true },
    { label: 'Grants Secured (YTD)', value: '$1.4M', icon: TrendingUp, trend: '+15% vs last year', trendUp: true },
    { label: 'Impending Deadlines', value: '3', icon: AlertCircle, trend: 'Next 7 days', trendUp: false },
    { label: 'Drafts in Oracle', value: '5', icon: Clock, trend: '2 pending review', trendUp: true }
  ];

  const recentActivity = [
    { title: 'Global Tech Foundation Grant', status: 'Drafting', date: '2 hours ago', score: 85 },
    { title: 'Community Health Initiative', status: 'Submitted', date: 'Yesterday', score: 92 },
    { title: 'Arts & Culture Endowments', status: 'Auditing', date: '2 days ago', score: 78 }
  ];

  return (
    <div className="page-container">
      <Navbar title="Command Center" />
      
      <div className="page-content animate-fade-in">
        <div className="dashboard-header">
          <div>
            <h3 className="greeting">Welcome back, <span className="text-gold">Director</span>.</h3>
            <p className="text-muted">Here is the current state of your grant pipelines.</p>
          </div>
          <button className="btn btn-primary">
            <span className="font-display">Initialize New Pipeline</span>
          </button>
        </div>

        <div className="stats-grid">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={idx} interactive={true} className="stat-card">
                <div className="stat-icon-wrapper">
                  <Icon size={24} className="text-gold" />
                </div>
                <div className="stat-details">
                  <span className="stat-label text-muted">{stat.label}</span>
                  <span className="stat-value font-display">{stat.value}</span>
                  <span className={`stat-trend ${stat.trendUp ? 'text-emerald' : 'text-gold'}`}>
                    {stat.trend}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="dashboard-grid">
          <GlassCard className="activity-panel">
            <div className="panel-header">
              <h4 className="font-display">Active Oracles (Recent Activity)</h4>
              <button className="btn-ghost">View All</button>
            </div>
            <div className="activity-list">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-info">
                    <h5 className="activity-title">{act.title}</h5>
                    <span className="activity-meta text-muted">{act.status} • {act.date}</span>
                  </div>
                  <div className="activity-score">
                    <div className="score-circle">
                      <span className="font-display">{act.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="insights-panel">
            <div className="panel-header">
              <h4 className="font-display">Genie Insights</h4>
            </div>
            <div className="insights-content">
              <div className="insight-card">
                <CheckCircle className="text-emerald" size={20} />
                <p><strong>High Match Found:</strong> The "Lumina Foundation" grant aligns 94% with your DNA profile. Deadline in 14 days.</p>
              </div>
              <div className="insight-card">
                <AlertCircle className="text-gold" size={20} />
                <p><strong>Audit Warning:</strong> The "Global Tech" draft is missing the 2024 financial audit in its attached Data Vault.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
