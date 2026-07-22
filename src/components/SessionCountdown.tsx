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
    <div className="flex items-center gap-2 sm:gap-4 bg-white/5 border border-white/10 rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs shadow-inner max-w-full">
      <Link
        href={`/user/${username}`}
        className="flex items-center gap-1.5 sm:gap-2 hover:opacity-85 transition-opacity group cursor-pointer shrink-0 min-w-0"
        title="View your posts"
      >
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
        <span className="font-bold text-white group-hover:text-accent group-hover:underline transition-colors truncate max-w-[80px] sm:max-w-[140px]">
          @{username}
        </span>
      </Link>
      
      <div className="flex items-center gap-1 sm:gap-1.5 text-text-muted border-l border-white/10 pl-2 sm:pl-4 shrink-0">
        <Clock className="w-3.5 h-3.5 text-ghost shrink-0" />
        <span className="whitespace-nowrap">
          <span className="hidden md:inline">Identity dies in: </span>
          <strong className="text-white font-mono">{timeLeft || '...'}</strong>
        </span>
      </div>

      <form action={logoutAction} className="border-l border-white/10 pl-2 sm:pl-4 shrink-0 flex items-center">
        <button
          type="submit"
          className="flex items-center gap-1 sm:gap-1.5 text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer focus:outline-none"
          title="Exit current session"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </form>
    </div>
  );
}
