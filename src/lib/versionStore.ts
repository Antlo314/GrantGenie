import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

export interface ProposalVersion {
  id?: string;
  draft: string;
  stage: string;
  savedBy: string;
  savedByName: string;
  savedAt: string;
  wordCount: number;
  changeNote?: string;
}

export interface AuditEntry {
  id?: string;
  action: AuditAction;
  actor: string;
  actorName: string;
  timestamp: string;
  details?: string;
}

export type AuditAction =
  | 'draft_saved'
  | 'draft_restored'
  | 'stage_changed'
  | 'exported_word'
  | 'exported_pdf'
  | 'preflight_run'
  | 'grant_bookmarked'
  | 'ai_generated'
  | 'ai_transformed';

const ACTION_LABELS: Record<AuditAction, string> = {
  draft_saved: 'Saved draft',
  draft_restored: 'Restored previous version',
  stage_changed: 'Changed stage',
  exported_word: 'Exported to Word',
  exported_pdf: 'Exported to PDF',
  preflight_run: 'Ran pre-flight check',
  grant_bookmarked: 'Bookmarked grant',
  ai_generated: 'Generated proposal with AI',
  ai_transformed: 'AI text transform',
};

export function getActionLabel(action: AuditAction): string {
  return ACTION_LABELS[action] || action;
}

/** Save a version snapshot to the versions sub-collection */
export async function saveVersion(
  pipelineId: string,
  version: Omit<ProposalVersion, 'id'>
): Promise<string> {
  try {
    const versionsRef = collection(db, 'pipeline_grants', pipelineId, 'versions');
    const docRef = await addDoc(versionsRef, version);
    return docRef.id;
  } catch (err) {
    console.error('Error saving version:', err);
    throw err;
  }
}

/** Load all versions for a pipeline grant, newest first */
export async function loadVersions(
  pipelineId: string,
  maxVersions = 50
): Promise<ProposalVersion[]> {
  try {
    const versionsRef = collection(db, 'pipeline_grants', pipelineId, 'versions');
    const q = query(versionsRef, orderBy('savedAt', 'desc'), limit(maxVersions));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProposalVersion));
  } catch (err) {
    console.error('Error loading versions:', err);
    return [];
  }
}

/** Log an audit entry to the activity sub-collection */
export async function logAudit(
  pipelineId: string,
  entry: Omit<AuditEntry, 'id'>
): Promise<void> {
  try {
    const activityRef = collection(db, 'pipeline_grants', pipelineId, 'activity');
    await addDoc(activityRef, entry);
  } catch (err) {
    console.error('Error logging audit entry:', err);
  }
}

/** Load audit trail for a pipeline grant, newest first */
export async function loadAuditTrail(
  pipelineId: string,
  maxEntries = 100
): Promise<AuditEntry[]> {
  try {
    const activityRef = collection(db, 'pipeline_grants', pipelineId, 'activity');
    const q = query(activityRef, orderBy('timestamp', 'desc'), limit(maxEntries));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AuditEntry));
  } catch (err) {
    console.error('Error loading audit trail:', err);
    return [];
  }
}

/** Compute a simple diff summary between two texts */
export function diffSummary(oldText: string, newText: string): string {
  const oldWords = oldText.trim().split(/\s+/).length;
  const newWords = newText.trim().split(/\s+/).length;
  const delta = newWords - oldWords;
  if (delta === 0) return 'No word count change';
  return delta > 0 ? `+${delta} words` : `${delta} words`;
}
