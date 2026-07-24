import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Badge, SectionLabel, Tile } from '../components/ui';
import { TOOLS, TOOL_TAGS, type ToolTag } from '../lib/toolbox';
import { GLOSSARY } from '../lib/hints';

/**
 * Free Toolbox — every real, free tool we found for grants & contracts.
 * No paid placements. "Built in" = Grant Genie already searches it for you.
 */
export default function Toolbox() {
  const [tag, setTag] = React.useState<ToolTag | 'all'>('all');

  const shown = tag === 'all' ? TOOLS : TOOLS.filter((t) => t.tag === tag);

  return (
    <div className="max-w-6xl mx-auto w-full">
      <PageHeader
        title="Free toolbox"
        subtitle="Real free tools — and real free human help — for grants and contracts."
        infoTitle={GLOSSARY.freeHelp.title}
        infoBody={GLOSSARY.freeHelp.body}
        hint="Everything on this page costs $0. If a website charges you just to apply or register, it’s not the real one."
      />

      {/* Scam warning — the single most useful thing beginners need to hear */}
      <div className="mt-4 rounded-2xl glass-emerald px-4 py-3 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-sm text-emerald-900 leading-relaxed">
          <strong>Applying is always free.</strong> Registering on SAM.gov is free. Applying on
          Grants.gov is free. Anyone charging you money just to apply or register is a scam.
        </p>
      </div>

      {/* Goal filter */}
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter tools by goal">
        <FilterChip active={tag === 'all'} onClick={() => setTag('all')} label="Show everything" />
        {(Object.keys(TOOL_TAGS) as ToolTag[]).map((k) => (
          <FilterChip
            key={k}
            active={tag === k}
            onClick={() => setTag(k)}
            label={TOOL_TAGS[k].label}
          />
        ))}
      </div>
      {tag !== 'all' && (
        <p className="mt-3 text-sm text-slate-600">{TOOL_TAGS[tag].blurb}</p>
      )}

      {/* Tool grid */}
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 list-none p-0">
        {shown.map((tool, i) => (
          <motion.li
            key={tool.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.4), type: 'spring', stiffness: 200, damping: 24 }}
          >
            <Tile className="p-5 h-full flex flex-col card-3d">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-slate-900 leading-snug">{tool.name}</h3>
                <Badge tone={tool.badge === 'Official .gov' ? 'emerald' : tool.badge === 'Open source' ? 'slate' : 'gold'}>
                  {tool.badge}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">{tool.what}</p>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed flex-1">{tool.why}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  Open site <ExternalLink className="w-3.5 h-3.5" />
                </a>
                {tool.builtIn && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    Built into Grant Genie
                  </span>
                )}
              </div>
            </Tile>
          </motion.li>
        ))}
      </ul>

      {/* Footnote */}
      <div className="mt-8 mb-4 rounded-2xl glass-panel px-5 py-4 flex items-start gap-3">
        <Wrench className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <SectionLabel>How we picked these</SectionLabel>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">
            Every tool here is genuinely free — official government sites, nonprofits, open-source
            projects, or honest free tiers. We don’t take money from anyone on this list.
            “Built into Grant Genie” means our Find page already searches that source for you
            automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string; key?: React.Key }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
        active
          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/25'
          : 'bg-white/80 text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
      }`}
    >
      {label}
    </button>
  );
}
