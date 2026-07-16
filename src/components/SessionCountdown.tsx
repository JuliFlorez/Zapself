'use client';

import { useEffect, useState } from 'react';
import { LogOut, Clock } from 'lucide-react';
import { logoutAction } from '@/app/actions';
import Link from 'next/link';

interface SessionCountdownProps {
  username: string;
  createdAt: number;
}

export default function SessionCountdown({ username, createdAt }: SessionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const expirationTime = createdAt + 24 * 60 * 60 * 1000;
      const difference = expirationTime - now;

      if (difference <= 0) {
        setTimeLeft('Expired');
        window.location.reload();
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h ${minutes}m left`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs shadow-inner">
      <Link
        href={`/user/${username}`}
        className="flex items-center gap-2 hover:opacity-85 transition-opacity group cursor-pointer"
        title="View your posts"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="font-bold text-white group-hover:text-accent group-hover:underline transition-colors">
          @{username}
        </span>
      </Link>
      
      <div className="flex items-center gap-1.5 text-text-muted border-l border-white/10 pl-4">
        <Clock className="w-3.5 h-3.5 text-ghost" />
        <span>Identity dies in: <strong className="text-white font-mono">{timeLeft || 'calculating...'}</strong></span>
      </div>

      <form action={logoutAction} className="border-l border-white/10 pl-4">
        <button
          type="submit"
          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer focus:outline-none"
          title="Exit current session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
      </form>
    </div>
  );
}
