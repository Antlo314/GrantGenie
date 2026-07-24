import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Building,
  FileText,
  Upload,
  ExternalLink,
  CheckCircle2,
  FolderOpen,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import PageHeader from '../components/PageHeader';
import { Button, StatTile, EmptyState, SectionLabel } from '../components/ui';
import { PAGE_HINTS } from '../lib/hints';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function DataVault() {
  const { organization, user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!organization) return;
    const fetchDocs = async () => {
      const q = query(
        collection(db, 'vault_documents'),
        where('orgId', '==', organization.id)
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a: any, b: any) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      setDocuments(docs);
    };
    fetchDocs();
  }, [organization]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !organization) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `vault/${organization.id}/${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      const newDoc = {
        name: file.name,
        size: file.size,
        url: downloadURL,
        uploadDate: new Date().toISOString(),
        orgId: organization.id,
        uploaderId: user?.uid
      };

      const docRef = await addDoc(collection(db, 'vault_documents'), newDoc);
      setDocuments([{ id: docRef.id, ...newDoc }, ...documents]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const focusAreas: string[] = organization?.focusAreas || [];
  const totalBytes = documents.reduce((acc, doc) => acc + (Number(doc.size) || 0), 0);
  const totalMb = (totalBytes / 1024 / 1024).toFixed(1);
  const h = PAGE_HINTS.vault;

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title={h.title}
        subtitle={h.subtitle}
        hint={h.hint}
        infoTitle="What goes here?"
        infoBody="Anything you’ll reuse across applications — your mission statement, budgets, past proposals. Drafts go faster when this page is filled in."
        actions={
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading…' : 'Upload a file'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">
        <div className="md:col-span-2 space-y-4 lg:space-y-6">
          {/* ── Your organization ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bento-tile p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
              <Building className="w-56 h-56 text-emerald-900" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-700">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">Your organization</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Used to pre-fill searches and drafts. Edit it anytime in Settings.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <SectionLabel className="mb-1.5">Organization name</SectionLabel>
                  <p className="font-bold text-lg text-slate-900">{organization?.name || 'Not set yet'}</p>
                </div>
                <div>
                  <SectionLabel className="mb-1.5">EIN (tax ID)</SectionLabel>
                  <p className="font-mono text-lg font-bold text-emerald-700">{organization?.ein || '—'}</p>
                </div>
                <div className="sm:col-span-2">
                  <SectionLabel className="mb-2">What you focus on</SectionLabel>
                  {focusAreas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {focusAreas.map((area) => (
                        <span
                          key={area}
                          className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 leading-snug">
                      Nothing yet — pick your industries in Settings.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200/60 bg-white/60 p-5">
                <SectionLabel className="mb-2">Your mission</SectionLabel>
                {organization?.mission ? (
                  <p className="text-base text-slate-700 leading-relaxed italic">
                    “{organization.mission}”
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 leading-snug">
                    Add a short mission in Settings — drafts will sound more like you.
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Your documents ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bento-tile p-6 md:p-8"
          >
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">Your documents</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Files you upload stay in your workspace.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500">
                <span className="font-mono text-slate-900">{documents.length}</span>{' '}
                {documents.length === 1 ? 'file' : 'files'}
              </span>
            </div>

            {documents.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {documents.map((doc) => (
                  <DocItem
                    key={doc.id}
                    title={doc.name}
                    size={`${(doc.size / 1024 / 1024).toFixed(2)} MB`}
                    date={new Date(doc.uploadDate).toLocaleDateString()}
                    url={doc.url}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                image="/genie-thinking.png"
                title="No files yet"
                body="Upload your mission statement, a budget, or a past application — you’ll reuse them when drafting."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4" /> Upload a file
                  </Button>
                }
              />
            )}
          </motion.div>
        </div>

        {/* ── Right column — real, useful info only ── */}
        <div className="space-y-4 lg:space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-emerald rounded-[2rem] p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 tracking-tight">Why keep files here?</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Keep your mission statement, budgets, and past applications here so drafts go faster.
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                'Your mission statement',
                'A recent budget or annual report',
                'A past application you were proud of',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="grid grid-cols-2 md:grid-cols-1 gap-4"
          >
            <StatTile
              value={documents.length}
              label={documents.length === 1 ? 'File uploaded' : 'Files uploaded'}
              hint="Counted from your workspace"
              tone="slate"
              icon={<FileText />}
            />
            <StatTile
              value={totalMb}
              label="MB stored"
              hint="Across all your uploads"
              tone="emerald"
              icon={<FolderOpen />}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function DocItem({
  title,
  size,
  date,
  url,
}: {
  key?: React.Key;
  title: string;
  size: string;
  date: string;
  url: string;
}) {
  return (
    <div className="group flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/60 bg-white/60 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-11 h-11 flex-shrink-0 bg-white rounded-xl border border-slate-200/70 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shadow-sm">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">{title}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span className="font-mono">{size}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" aria-hidden="true" />
            <span>Uploaded {date}</span>
          </div>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${title} in a new tab`}
        title="Open in a new tab"
        className="btn btn-secondary btn-sm !px-2.5 shrink-0"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
