/**
 * Grant Genie UI primitives — the one shared vocabulary for every view.
 * Pairs with the class system in src/index.css (.btn-*, .bento-tile, .glass-*).
 */
import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

/* ── Button ─────────────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'dark' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      {...rest}
    />
  );
}

/* ── Tile: the bento card ───────────────────────────────────────── */

export function Tile({
  className = '',
  as: Tag = 'div',
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & { as?: 'div' | 'section' | 'article' | 'li' }) {
  return (
    <Tag className={`bento-tile ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/* ── Badge ──────────────────────────────────────────────────────── */

export function Badge({
  tone = 'emerald',
  className = '',
  children,
}: {
  tone?: 'emerald' | 'gold' | 'slate';
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={`badge-${tone} ${className}`}>{children}</span>;
}

/* ── Section label — small heading above a group ────────────────── */

export function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500 ${className}`}>
      {children}
    </p>
  );
}

/* ── StatTile — a number with a plain-English label ─────────────── */

export function StatTile({
  value,
  label,
  hint,
  tone = 'emerald',
  icon,
  className = '',
}: {
  value: React.ReactNode;
  label: string;
  hint?: string;
  tone?: 'emerald' | 'gold' | 'slate' | 'dark';
  icon?: React.ReactNode;
  className?: string;
}) {
  const tones: Record<string, string> = {
    emerald: 'glass-emerald text-emerald-900',
    gold: 'glass-gold text-amber-900',
    slate: 'glass-panel text-slate-900',
    dark: 'glass-panel-dark text-white',
  };
  return (
    <div className={`rounded-3xl p-5 card-3d ${tones[tone]} ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-3xl font-bold leading-none">{value}</p>
        {icon && <span className="opacity-70 [&>svg]:w-5 [&>svg]:h-5">{icon}</span>}
      </div>
      <p className="mt-2 text-sm font-bold">{label}</p>
      {hint && <p className="mt-0.5 text-xs opacity-70 leading-snug">{hint}</p>}
    </div>
  );
}

/* ── Field — labelled input wrapper ─────────────────────────────── */

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className = '',
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`block ${className}`}>
      <span className="block text-sm font-bold text-slate-800 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500 mt-1.5 leading-snug">{hint}</span>}
    </label>
  );
}

/* ── ProgressBar ────────────────────────────────────────────────── */

export function ProgressBar({
  value,
  max = 100,
  label,
  className = '',
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={className}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div className="h-2.5 rounded-full bg-slate-200/70 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
      </div>
    </div>
  );
}

/* ── EmptyState ─────────────────────────────────────────────────── */

export function EmptyState({
  image,
  title,
  body,
  action,
  className = '',
}: {
  image?: string;
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
      {image && (
        <img src={image} alt="" className="h-28 w-auto object-contain depth-shadow gg-float mb-4" />
      )}
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-1.5 max-w-sm leading-relaxed">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ── Modal — one dialog for the whole app ───────────────────────── */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
  footer?: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className={`relative w-full ${wide ? 'max-w-4xl' : 'max-w-lg'} max-h-[88vh] flex flex-col rounded-[2rem] glass-panel noise-overlay overflow-hidden`}
          >
            <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-200/60">
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-slate-200/60 bg-white/40">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── Tilt3D — pointer-tracked 3D card ───────────────────────────── */

export function Tilt3D({
  children,
  className = '',
  maxTilt = 7,
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  disabled?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [transform, setTransform] = React.useState('');

  const onMove = (e: React.PointerEvent) => {
    if (reduce || disabled || e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTransform(
      `perspective(900px) rotateY(${(px * maxTilt).toFixed(2)}deg) rotateX(${(-py * maxTilt).toFixed(2)}deg) translateZ(6px)`
    );
  };
  const onLeave = () => setTransform('');

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{
        transform: transform || 'perspective(900px)',
        transition: transform ? 'transform 0.08s ease-out' : 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
