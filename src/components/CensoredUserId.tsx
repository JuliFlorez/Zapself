'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Key } from 'lucide-react';

interface CensoredUserIdProps {
  userId: string;
}

const copyToClipboard = async (text: string): Promise<boolean> => {
  // 1. Try Modern Clipboard API
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard API failed, attempting fallback execCommand:', err);
  }

  // 2. Fallback using temporary textarea element (works in HTTP, iframe, and legacy browsers)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback execCommand failed:', err);
    return false;
  }
};

export default function CensoredUserId({ userId }: CensoredUserIdProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const maskedId = '••••••••-••••-••••-••••-••••••••••••';

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userId) return;

    const success = await copyToClipboard(userId);
    if (success) {
      setIsRevealed(true); // Automatically reveal so user sees what was copied
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-accent" /> Identity Secret ID
        </span>
        <span className="text-[10px] text-text-muted">Use to restore session</span>
      </div>

      <div className="flex items-center gap-2">
        <div
          onClick={() => setIsRevealed(!isRevealed)}
          className="flex-1 px-3 py-2 bg-bg-dark/80 border border-white/10 rounded-lg text-xs font-mono text-white flex items-center justify-between cursor-pointer hover:border-accent/40 transition-colors select-none group"
          title="Click to toggle visibility"
        >
          <span className={isRevealed ? 'text-accent font-semibold tracking-tight break-all' : 'text-text-muted tracking-widest'}>
            {isRevealed ? userId : maskedId}
          </span>
          <button
            type="button"
            className="text-text-muted group-hover:text-white transition-colors p-1 shrink-0 ml-2"
            aria-label={isRevealed ? 'Hide ID' : 'Reveal ID'}
          >
            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border shrink-0 ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 hover:border-accent/40'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy ID</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
