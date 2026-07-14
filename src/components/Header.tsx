import Link from 'next/link';
import { getCurrentUser } from '@/lib/db';
import SessionCountdown from './SessionCountdown';
import { Terminal, Key } from 'lucide-react';

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/80 backdrop-blur-md border-b border-white/5 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-accent/10 border border-accent/20 rounded-xl group-hover:border-accent/40 transition-colors shadow-sm shadow-accent/5">
            <Terminal className="h-5 w-5 text-accent" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white group-hover:text-accent transition-colors">
            zapself
          </span>
        </Link>

        {/* User Profile / Countdown / Actions */}
        <div className="flex items-center">
          {user ? (
            <SessionCountdown username={user.username} createdAt={user.createdAt} />
          ) : (
            <Link
              href="/register"
              className="flex items-center gap-1.5 px-4 py-2 border border-accent/20 rounded-xl text-xs font-bold text-accent bg-accent/5 hover:bg-accent/10 hover:border-accent/40 transition-all focus:outline-none"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Register Identity</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
