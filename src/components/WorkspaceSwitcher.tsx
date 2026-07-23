import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Plus, Check, Shield } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { WorkspaceOrg, UserRole } from '../types';
import AddOrganizationModal from './AddOrganizationModal';

const ROLE_LABELS: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  lead_writer: { label: 'Lead Writer', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  reviewer: { label: 'Reviewer', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  finance: { label: 'Finance', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  viewer: { label: 'Viewer', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export default function WorkspaceSwitcher() {
  const { activeWorkspace, workspaces, userRole, switchWorkspace, createWorkspace } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleInfo = ROLE_LABELS[userRole || 'admin'] || ROLE_LABELS['admin'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-semibold shadow-sm"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold text-[10px] shrink-0">
          <Building2 className="w-3.5 h-3.5" />
        </div>
        <div className="text-left hidden sm:block max-w-[130px] truncate">
          <div className="font-bold text-slate-800 text-xs truncate leading-tight">
            {activeWorkspace?.name || 'Workspace'}
          </div>
          <div className="text-[9px] font-mono text-slate-400 font-medium uppercase tracking-wider">
            {roleInfo.label}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-[120] py-2 overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-100">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Active Organization Workspace
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto custom-scrollbar py-1">
            {workspaces.map((ws) => {
              const isSelected = activeWorkspace?.id === ws.id;
              const wsRole = ROLE_LABELS[ws.role || 'admin'];
              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    switchWorkspace(ws.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-emerald-50/70 text-emerald-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold truncate">{ws.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${wsRole.color}`}>
                        {wsRole.label}
                      </span>
                      {ws.state && <span className="text-[9px] text-slate-400 font-mono">{ws.state}</span>}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 px-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setShowAddModal(true);
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-xl flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-600" /> Add Organization Workspace
            </button>
          </div>
        </div>
      )}

      <AddOrganizationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(data) => {
          createWorkspace(data);
        }}
      />
    </div>
  );
}
