import React from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Layers, Plus, Target, Users, Calendar, ArrowRight } from 'lucide-react';
import './ProgramManager.css';

const ProgramManager = () => {
  const programs = [
    {
      id: 1,
      name: 'Tech-Forward Youth',
      status: 'Active',
      budget: '$250,000',
      funded: '$150,000',
      grants: 3,
      deadline: 'Dec 2026',
      description: 'Deploying interactive learning terminals to Title I schools.',
    },
    {
      id: 2,
      name: 'Community Wellness Clinics',
      status: 'Drafting',
      budget: '$500,000',
      funded: '$0',
      grants: 5,
      deadline: 'Mar 2027',
      description: 'Establishing free preventative care pop-ups in rural areas.',
    },
    {
      id: 3,
      name: 'Arts & Culture Endowment',
      status: 'Planning',
      budget: '$100,000',
      funded: '$25,000',
      grants: 1,
      deadline: 'Ongoing',
      description: 'Supporting local artists through micro-grants.',
    }
  ];

  return (
    <div className="page-container">
      <Navbar title="Program Manager" />
      
      <div className="page-content program-layout animate-fade-in">
        <div className="program-header">
          <div className="vault-title">
            <Layers className="text-gold glow-text" size={36} />
            <div>
              <h2 className="font-display text-3xl">Unlimited Active Programs</h2>
              <p className="text-secondary">Organize grants, track budgets, and manage infinite initiatives with zero arbitrary caps.</p>
            </div>
          </div>
          
          <button className="btn btn-primary">
            <Plus size={18} /> New Program
          </button>
        </div>

        <div className="program-grid mt-8">
          {programs.map(program => {
            const percentage = (parseInt(program.funded.replace(/\D/g,'')) / parseInt(program.budget.replace(/\D/g,''))) * 100 || 0;
            
            return (
              <GlassCard key={program.id} className="program-card interactive">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-xl">{program.name}</h3>
                  <span className={`status-badge ${program.status.toLowerCase()}`}>{program.status}</span>
                </div>
                
                <p className="text-sm text-secondary mb-6">{program.description}</p>
                
                <div className="budget-tracker mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted">Funding Goal</span>
                    <span className="font-medium">{program.funded} / {program.budget}</span>
                  </div>
                  <div className="bento-progress-bar bg-white/10">
                    <div className="bento-progress-fill bg-gold" style={{width: `${percentage}%`}}></div>
                  </div>
                </div>

                <div className="program-stats grid grid-cols-2 gap-4 mb-6">
                  <div className="stat-box">
                    <Target size={16} className="text-muted mb-1" />
                    <span className="text-lg font-display">{program.grants}</span>
                    <span className="text-xs text-secondary uppercase tracking-widest">Grants</span>
                  </div>
                  <div className="stat-box">
                    <Calendar size={16} className="text-muted mb-1" />
                    <span className="text-lg font-display text-emerald">{program.deadline}</span>
                    <span className="text-xs text-secondary uppercase tracking-widest">Deadline</span>
                  </div>
                </div>

                <button className="btn btn-outline w-full justify-center">
                  Open Dashboard <ArrowRight size={16} className="ml-2" />
                </button>
              </GlassCard>
            );
          })}

          {/* Add New Program Ghost Card */}
          <GlassCard className="program-card add-new-card interactive flex flex-col items-center justify-center border-dashed border-2 border-white/20 hover:border-gold cursor-pointer min-h-[350px]">
            <div className="rounded-full bg-white/5 p-4 mb-4">
              <Plus size={32} className="text-gold" />
            </div>
            <h3 className="font-display text-xl mb-2">Create Initiative</h3>
            <p className="text-sm text-center text-muted px-4">Create unlimited programs. We don't charge you extra for making an impact.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProgramManager;
