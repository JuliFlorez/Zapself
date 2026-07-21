import React from 'react';
import { Newspaper, Sparkles } from 'lucide-react';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  tagColor: string;
  isNew?: boolean;
}

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Emoji Reactions & 💩',
    description: 'React to posts with live accumulating emojis (including 💩!). Each user gets 1 single active reaction per post.',
    date: 'Just now',
    tag: 'Feature',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    isNew: true,
  },
  {
    id: '2',
    title: 'Secret ID & Session Restore',
    description: 'Copy your secret ID securely from your profile to restore your active 24h session anytime if logged out.',
    date: 'Just now',
    tag: 'Security',
    tagColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    isNew: true,
  },
  {
    id: '3',
    title: 'Desktop Trilateral Layout',
    description: 'Sidebars with Latest News on the left and the 50 most recent live activities on the right for desktop screens.',
    date: 'Today',
    tag: 'News',
    tagColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  {
    id: '4',
    title: '24-Hour Ephemeral Cycle',
    description: 'Identities and non-immortalized posts automatically expire and purge after 24 hours.',
    date: 'Today',
    tag: 'System',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
];

export default function LatestNews() {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-accent">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              Latest News
            </h2>
            <p className="text-xs text-text-muted">Platform updates</p>
          </div>
        </div>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
        </span>
      </div>

      {/* News List */}
      <div className="space-y-3.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
        {DEFAULT_NEWS.map((item) => (
          <div
            key={item.id}
            className="group relative p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-accent/30 rounded-xl transition-all duration-200 space-y-2.5 cursor-default"
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}>
                {item.tag}
              </span>
              <span className="text-xs text-text-muted font-medium">{item.date}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white group-hover:text-accent transition-colors flex items-center justify-between">
                <span>{item.title}</span>
                {item.isNew && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-black rounded uppercase tracking-wider">
                    NEW
                  </span>
                )}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-text-muted">
        <span className="flex items-center gap-1.5 font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" /> Zapself v1.3
        </span>
        <span className="text-xs text-white/40 font-medium">Desktop Only</span>
      </div>
    </div>
  );
}
