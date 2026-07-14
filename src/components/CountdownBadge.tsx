'use client';

import { useEffect, useState } from 'react';
import { Ghost, Hourglass } from 'lucide-react';

interface CountdownProps {
  createdAt: number;
  keepContent: boolean;
}

export default function CountdownBadge({ createdAt, keepContent }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isGhost, setIsGhost] = useState<boolean>(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const expirationTime = createdAt + 24 * 60 * 60 * 1000;
      const difference = expirationTime - now;

      if (difference <= 0) {
        setIsGhost(true);
        setTimeLeft('');
        return;
      }

      setIsGhost(false);
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s left`);
      } else {
        setTimeLeft(`${seconds}s left`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  if (keepContent && (isGhost || Date.now() - createdAt >= 24 * 60 * 60 * 1000)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-950/40 border border-purple-500/30 text-purple-300 shadow-sm shadow-purple-500/10 animate-pulse-glow">
        <Ghost className="w-3.5 h-3.5 text-purple-400" />
        <span>[Ghost Message]</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
      keepContent
        ? 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-300'
        : 'bg-amber-950/40 border border-amber-500/30 text-amber-300'
    }`}>
      <Hourglass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
      <span>{timeLeft || 'calculating...'}</span>
      {keepContent && <span className="text-[10px] opacity-75 font-medium px-1 bg-indigo-500/20 rounded">(Immortal)</span>}
    </span>
  );
}
