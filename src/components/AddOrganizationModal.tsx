import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, X, CheckCircle2, Shield, Tag } from 'lucide-react';
import { EntityType, UserRole, WorkspaceOrg } from '../types';

interface AddOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (org: Omit<WorkspaceOrg, 'id'>) => void;
}

export default function AddOrganizationModal({
  isOpen,
  onClose,
  onAdd,
}: AddOrganizationModalProps) {
  const [name, setName] = useState('');
  const [ein, setEin] = useState('');
  const [mission, setMission] = useState('');
  const [state, setState] = useState('MD');
  const [role, setRole] = useState<UserRole>('admin');
  const [entityType, setEntityType] = useState<EntityType>('nonprofit');
  const [keywordsText, setKeywordsText] = useState('workforce, youth, education');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const keywords = keywordsText
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    onAdd({
      name: name.trim(),
      ein: ein.trim(),
      mission: mission.trim(),
      state: state.trim(),
      role,
      entityType,
      keywords,
    });

    // Reset form
    setName('');
    setEin('');
    setMission('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="glass-panel rounded-[2rem] w-full max-w-lg overflow-hidden flex flex-col"
        >
          <div className="glass-panel-dark text-white p-6 flex items-center justify-between rounded-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Add an organization</h3>
                <p className="text-xs text-slate-300">A separate space for another group or client you help</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Organization / Client Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chesapeake Bay Conservation League"
                className="field"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Entity Type
                </label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as EntityType)}
                  className="field"
                >
                  <option value="nonprofit">501(c)(3) Nonprofit</option>
                  <option value="company">For-Profit Business</option>
                  <option value="individual">Individual Researcher</option>
                  <option value="other">Government / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="field"
                >
                  <option value="admin">Admin (Full Control)</option>
                  <option value="lead_writer">Lead Grant Writer</option>
                  <option value="reviewer">Compliance Reviewer</option>
                  <option value="finance">Finance Director</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  EIN / Tax ID
                </label>
                <input
                  type="text"
                  value={ein}
                  onChange={(e) => setEin(e.target.value)}
                  placeholder="52-1234567"
                  className="field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  State / Territory
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="MD"
                  className="field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mission / Focus Statement
              </label>
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="Short description of what this organization does..."
                className="field h-24 resize-none custom-scrollbar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Focus Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
                placeholder="environment, education, youth"
                className="field"
              />
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add organization
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
