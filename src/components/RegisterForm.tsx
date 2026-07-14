'use client';

import { useActionState } from 'react';
import { registerAction } from '@/app/actions';
import { Terminal, ShieldAlert, Sparkles } from 'lucide-react';

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="w-full max-w-md space-y-8 z-10">
      <div className="text-center animate-float">
        <div className="inline-flex items-center justify-center p-3 bg-accent/10 border border-accent/20 rounded-2xl mb-4 glow-indigo">
          <Terminal className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400">
          zapself
        </h1>
        <p className="mt-3 text-sm text-text-muted">
          An ephemeral social experiment.
          <span className="block mt-1 font-semibold text-ghost">
            Identities expire. Footprints remain.
          </span>
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-8 glow-indigo border border-white/5 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" /> Create Local Identity
        </h2>

        <form action={formAction} className="space-y-6" id="register-form">
          {state?.error && (
            <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-3 animate-pulse-glow" id="register-error">
              <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <span className="text-sm text-red-200">{state.error}</span>
            </div>
          )}

          <div>
            <label htmlFor="username-input" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
              Ephemeral Username
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-accent font-semibold text-sm">@</span>
              </div>
              <input
                id="username-input"
                name="username"
                type="text"
                required
                placeholder="username"
                className="block w-full pl-8 pr-4 py-3 bg-bg-dark/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
                disabled={isPending}
              />
            </div>
            <p className="mt-1.5 text-xs text-text-muted">
              3-15 chars (letters, numbers, underscore). Free in 24 hours.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center h-5 mt-1">
              <input
                id="keep-content-checkbox"
                name="keepContent"
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 text-accent focus:ring-accent bg-bg-dark/50 cursor-pointer"
                disabled={isPending}
              />
            </div>
            <label htmlFor="keep-content-checkbox" className="text-xs text-text-muted leading-relaxed cursor-pointer select-none">
              Immortalize my posts (My posts will stay in the feed forever anonymously, even though my user account is destroyed after 24 hours)
            </label>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/20 cursor-pointer"
          >
            {isPending ? 'Entering Experiment...' : 'Enter Experiment'}
          </button>
        </form>
      </div>

      <div className="text-center">
        <p className="text-xs text-text-muted">
          By entering, you understand that your identity exists for exactly 24 hours, after which all record of your user profile is permanently wiped.
        </p>
      </div>
    </div>
  );
}
