import React from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Shield, Lock, UploadCloud, FileText, CheckCircle, Clock, Key } from 'lucide-react';
import './DataVault.css';

const DataVault = () => {
  const documents = [
    { id: 1, name: 'IRS_501c3_Determination.pdf', size: '1.2 MB', type: 'Compliance', hash: 'e3b0c44298fc1c14', status: 'Verified', date: 'Oct 2023' },
    { id: 2, name: '2025_Annual_Impact_Report.pdf', size: '4.8 MB', type: 'Reporting', hash: '8f434346648f6b96', status: 'Verified', date: 'Jan 2026' },
    { id: 3, name: 'Q3_Financial_Audit_Signed.pdf', size: '3.1 MB', type: 'Financial', hash: 'a1d0c6e83f027327', status: 'Verified', date: 'Nov 2025' },
    { id: 4, name: 'Board_of_Directors_Roster_2026.docx', size: '0.5 MB', type: 'Governance', hash: 'Pending Sync', status: 'Unverified', date: 'Just now' }
  ];

  return (
    <div className="page-container">
      <Navbar title="Zero-Trust Data Vault" />
      
      <div className="page-content vault-layout animate-fade-in">
        
        <div className="vault-header-section">
          <div className="vault-title">
            <Shield className="text-gold glow-text" size={36} />
            <div>
              <h2 className="font-display text-3xl">Cryptographic Storage</h2>
              <p className="text-secondary">Enterprise-grade document isolation and zero-trust verification.</p>
            </div>
          </div>
          <div className="vault-status-badge">
            <Lock size={16} className="text-emerald" />
            <span className="text-emerald font-medium uppercase tracking-widest text-xs">End-to-End Encrypted</span>
          </div>
        </div>

        <div className="vault-grid">
          
          {/* Main Document Ledger */}
          <GlassCard className="vault-ledger">
            <div className="ledger-header flex justify-between items-center mb-6">
              <h3 className="font-display text-xl">Organizational Assets</h3>
              <div className="flex gap-2">
                <button className="btn btn-outline py-1 px-4 text-sm">Filter</button>
                <button className="btn btn-primary py-1 px-4 text-sm"><Key size={14} className="mr-2" /> Verify All</button>
              </div>
            </div>

            <div className="ledger-table-container">
              <table className="ledger-table w-full">
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>SHA-256 Hash</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(doc => (
                    <tr key={doc.id} className="ledger-row interactive">
                      <td>
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-gold" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <span className="text-xs text-muted">{doc.size} • {doc.date}</span>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-sm text-secondary tracking-widest">{doc.hash}</td>
                      <td><span className="vault-tag">{doc.type}</span></td>
                      <td>
                        {doc.status === 'Verified' ? (
                          <span className="flex items-center gap-1 text-emerald text-sm">
                            <CheckCircle size={14} /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gold text-sm">
                            <Clock size={14} /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Upload & Access Log */}
          <div className="vault-sidebar flex flex-col gap-6">
            
            <GlassCard className="upload-zone interactive border-dashed border-2 border-white/20 hover:border-gold transition-colors flex flex-col items-center justify-center p-8">
              <UploadCloud size={48} className="text-gold mb-4" />
              <h4 className="font-display text-lg mb-2">Secure Dropzone</h4>
              <p className="text-sm text-center text-muted mb-6">Drag and drop compliance documents here. They will be encrypted before storage.</p>
              <button className="btn btn-primary w-full">Select Files</button>
            </GlassCard>

            <GlassCard className="access-log flex-1">
              <h4 className="font-display text-lg mb-4">Oracle Decryption Log</h4>
              <div className="log-list flex flex-col gap-3">
                <div className="log-item">
                  <span className="log-time text-xs text-muted font-mono">10:42 AM</span>
                  <p className="text-sm">Oracle Writer accessed <span className="text-gold">2025_Annual_Impact_Report.pdf</span> for Lumina Foundation draft.</p>
                </div>
                <div className="log-item">
                  <span className="log-time text-xs text-muted font-mono">Yesterday</span>
                  <p className="text-sm">Oracle Writer accessed <span className="text-gold">Q3_Financial_Audit_Signed.pdf</span> for Global Tech draft.</p>
                </div>
              </div>
            </GlassCard>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DataVault;

