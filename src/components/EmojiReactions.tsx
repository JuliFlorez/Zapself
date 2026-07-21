'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { togglePostReactionAction } from '@/app/actions';
import { SmilePlus } from 'lucide-react';

interface EmojiReactionsProps {
  postId: string;
  initialReactions?: Record<string, number>;
}

const QUICK_EMOJIS = ['👍', '❤️', '🔥', '💩', '🚀', '💡', '😂', '👻', '⚡'];

export default function EmojiReactions({ postId, initialReactions = {} }: EmojiReactionsProps) {
  const [reactions, setReactions] = useState<Record<string, number>>(initialReactions);
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [animatingEmoji, setAnimatingEmoji] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const storageKey = `zapself_reaction_${postId}`;

  // Load user's reaction for this post on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setMyReaction(saved);
      }
    } catch {
      // localStorage may be disabled
    }
  }, [storageKey]);

  const handleReact = (clickedEmoji: string) => {
    let nextEmoji: string | null = null;
    let previousEmoji: string | null = myReaction;

    if (myReaction === clickedEmoji) {
      // User is toggling OFF their reaction
      nextEmoji = null;
    } else {
      // User is setting or switching to a new reaction
      nextEmoji = clickedEmoji;
    }

    // 1. Optimistic UI update
    setReactions((prev) => {
      const updated = { ...prev };
      if (previousEmoji && updated[previousEmoji]) {
        updated[previousEmoji] = Math.max(0, updated[previousEmoji] - 1);
        if (updated[previousEmoji] === 0) {
          delete updated[previousEmoji];
        }
      }
      if (nextEmoji) {
        updated[nextEmoji] = (updated[nextEmoji] || 0) + 1;
      }
      return updated;
    });

    setMyReaction(nextEmoji);

    // Persist user selection in localStorage
    try {
      if (nextEmoji) {
        localStorage.setItem(storageKey, nextEmoji);
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // ignore
    }

    setAnimatingEmoji(clickedEmoji);
    setTimeout(() => setAnimatingEmoji(null), 400);
    setShowPicker(false);

    // 2. Server Action update
    startTransition(async () => {
      const res = await togglePostReactionAction(postId, nextEmoji, previousEmoji);
      if (res.success && res.reactions) {
        setReactions(res.reactions);
      }
    });
  };

  // List of active emojis to show (including user's own choice even if 0)
  const activeReactions = Object.entries(reactions).filter(([, count]) => count > 0);

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {/* Existing Active Reaction Pills */}
      {activeReactions.map(([emoji, count]) => {
        const isMySelected = myReaction === emoji;
        const isBouncing = animatingEmoji === emoji;

        return (
          <button
            key={emoji}
            type="button"
            onClick={() => handleReact(emoji)}
            disabled={isPending && animatingEmoji === emoji}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none border ${
              isMySelected
                ? 'bg-accent/25 text-white border-accent shadow-md shadow-accent/25 ring-1 ring-accent/50'
                : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10 hover:border-accent/40'
            } ${isBouncing ? 'scale-125' : 'hover:scale-105'}`}
            title={isMySelected ? `Remove your ${emoji} reaction` : `React with ${emoji}`}
          >
            <span className="text-sm">{emoji}</span>
            <span className={`font-mono text-[11px] font-bold ${isMySelected ? 'text-accent' : 'text-text-muted'}`}>
              {count}
            </span>
          </button>
        );
      })}

      {/* Add Emoji Picker Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            myReaction
              ? 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20'
              : 'bg-white/[0.03] text-text-muted hover:text-white border-white/5 hover:border-white/20'
          }`}
          title="Choose reaction emoji"
        >
          <SmilePlus className="w-3.5 h-3.5 text-accent" />
          <span className="text-[11px]">{myReaction ? 'Change' : 'React'}</span>
        </button>

        {/* Emoji Quick Picker Popup */}
        {showPicker && (
          <div className="absolute left-0 bottom-full mb-2 p-2 bg-[#151f32] border border-white/15 rounded-2xl shadow-2xl flex items-center gap-1 z-30 animate-in fade-in zoom-in-95 duration-150">
            {QUICK_EMOJIS.map((emoji) => {
              const isSelected = myReaction === emoji;
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleReact(emoji)}
                  className={`p-1.5 rounded-xl text-lg hover:scale-125 transition-transform cursor-pointer ${
                    isSelected ? 'bg-accent/30 border border-accent' : 'hover:bg-white/10'
                  }`}
                  title={isSelected ? `Remove ${emoji}` : `React with ${emoji}`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
