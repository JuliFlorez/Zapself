'use client';

import React, { useState, useActionState } from 'react';
import { registerAction, loginByIdAction } from '@/app/actions';
import { Terminal, ShieldAlert, Sparkles, Key, UserPlus, LogIn } from 'lucide-react';

export default function RegisterForm() {
  const [mode, setMode] = useState<'register' | 'login_id'>('register');

  const [registerState, registerFormAction, isRegisterPending] = useActionState(registerAction, null);
  const [loginState, loginFormAction, isLoginPending] = useActionState(loginByIdAction, null);

  const currentState = mode === 'register' ? registerState : loginState;
  const isPending = mode === 'register' ? isRegisterPending : isLoginPending;

  return (
    <div className="w-full max-w-md space-y-8 z-10">
      <div className="text-center animate-float">
        <div className="inline-flex items-center justify-center p-3 bg-accent/10 border border-accent/20 rounded-3xl mb-4 glow-indigo overflow-hidden shadow-xl shadow-accent/10">
          <img src="/icon/android-chrome-512x512.png" alt="zapself logo" className="h-16 w-16 object-contain rounded-2xl" />
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

      <div className="glass-panel rounded-2xl p-8 glow-indigo border border-white/5 shadow-2xl space-y-6">
        {/* Mode Selector Tabs */}
        <div className="flex bg-bg-dark/60 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-accent text-white shadow-md shadow-accent/20'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Identity</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('login_id')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'login_id'
                ? 'bg-accent text-white shadow-md shadow-accent/20'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Restore by ID</span>
          </button>
        </div>

        {/* Error Alert */}
        {currentState?.error && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-3 animate-pulse-glow" id="form-error">
            <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <span className="text-sm text-red-200">{currentState.error}</span>
          </div>
        )}

        {/* Register Form Mode */}
        {mode === 'register' ? (
          <form action={registerFormAction} className="space-y-6" id="register-form">
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
        ) : (
          /* Login by ID Form Mode */
          <form action={loginFormAction} className="space-y-6" id="login-id-form">
            <div>
              <label htmlFor="userid-input" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-accent" /> Identity Secret ID
              </label>
              <input
                id="userid-input"
                name="userId"
                type="text"
                required
                placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-1234567890ab"
                className="block w-full px-4 py-3 bg-bg-dark/50 border border-white/10 rounded-xl text-white placeholder-gray-500 font-mono focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-xs"
                disabled={isPending}
              />
              <p className="mt-1.5 text-xs text-text-muted">
                Paste your active 36-character secret ID to restore your session if you logged out.
              </p>
            </div>

            <button
              id="login-id-submit-btn"
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/20 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{isPending ? 'Restoring Session...' : 'Restore Session'}</span>
            </button>
          </form>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-text-muted">
          By entering, you understand that your identity exists for exactly 24 hours, after which all record of your user profile is permanently wiped.
        </p>
      </div>
    </div>
  );
}
