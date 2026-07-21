import React from 'react';
import { User, Post } from '@/lib/db';
import { Activity, UserPlus, MessageSquareText, Clock, FileText, UserCheck } from 'lucide-react';

interface ActivityCardProps {
  users: User[];
  posts: Post[];
}

interface CombinedActivity {
  id: string;
  type: 'post' | 'user';
  username: string;
  createdAt: number;
  content?: string;
  imageUrl?: string;
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const seconds = Math.floor(diffMs / 1000);

  if (seconds < 60) return `${Math.max(1, seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function ActivityCard({ users, posts }: ActivityCardProps) {
  // Sort posts & users by newest first
  const sortedPosts = [...posts].sort((a, b) => b.createdAt - a.createdAt);
  const sortedUsers = [...users].sort((a, b) => b.createdAt - a.createdAt);

  const latestPost = sortedPosts[0] || null;
  const latestUser = sortedUsers[0] || null;

  // Build combined activities list
  const allActivities: CombinedActivity[] = [];

  for (const post of posts) {
    allActivities.push({
      id: `post-${post.id}`,
      type: 'post',
      username: post.username,
      createdAt: post.createdAt,
      content: post.content,
      imageUrl: post.imageUrl,
    });
  }

  for (const user of users) {
    allActivities.push({
      id: `user-${user.id}`,
      type: 'user',
      username: user.username,
      createdAt: user.createdAt,
    });
  }

  // Sort combined list by newest first and keep up to 50 activities
  const recentActivities = allActivities
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 50);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 shadow-xl space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-accent/10 border border-accent/20 rounded-xl text-accent">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Latest 50 Activities
            </h2>
            <p className="text-xs text-text-muted">Real-time log</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent">
          {recentActivities.length} / 50
        </span>
      </div>

      {/* Highlights Section: Latest Post & Latest User */}
      <div className="grid grid-cols-1 gap-3">
        {/* Latest Post Highlight */}
        <div className="p-3.5 bg-gradient-to-r from-accent/10 to-indigo-950/40 border border-accent/20 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <MessageSquareText className="w-3.5 h-3.5" /> Latest Post
            </span>
            {latestPost && (
              <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(latestPost.createdAt)}
              </span>
            )}
          </div>

          {latestPost ? (
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1">
                <span>@{latestPost.username}</span>
              </div>
              <p className="text-xs text-gray-300 line-clamp-2 italic mt-1 leading-relaxed">
                "{latestPost.content}"
              </p>
            </div>
          ) : (
            <p className="text-xs text-text-muted italic">No posts yet</p>
          )}
        </div>

        {/* Latest User Highlight */}
        <div className="p-3.5 bg-gradient-to-r from-purple-500/10 to-purple-950/40 border border-purple-500/20 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-ghost flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Latest Registered User
            </span>
            {latestUser && (
              <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(latestUser.createdAt)}
              </span>
            )}
          </div>

          {latestUser ? (
            <div className="flex items-center justify-between pt-0.5">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xs text-purple-300 font-black">
                  {latestUser.username.charAt(0).toUpperCase()}
                </div>
                <span>@{latestUser.username}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                Active
              </span>
            </div>
          ) : (
            <p className="text-xs text-text-muted italic">No recent users</p>
          )}
        </div>
      </div>

      {/* Activity Timeline List (Up to 50 items) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center justify-between pt-1 border-t border-white/5">
          <span>Recent History</span>
          <span className="text-xs text-white/40 font-normal">Auto-purged</span>
        </h3>

        {recentActivities.length === 0 ? (
          <div className="text-center py-6 text-xs text-text-muted">
            No activity recorded in the last 24 hours.
          </div>
        ) : (
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-2.5 p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl text-xs transition-colors"
              >
                {/* Icon */}
                <div
                  className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    act.type === 'post'
                      ? 'bg-accent/10 border border-accent/20 text-accent'
                      : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                  }`}
                >
                  {act.type === 'post' ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-white truncate text-xs">
                      @{act.username}
                    </span>
                    <span className="text-xs text-text-muted shrink-0">
                      {formatTimeAgo(act.createdAt)}
                    </span>
                  </div>

                  {act.type === 'post' ? (
                    <p className="text-xs text-text-muted truncate mt-0.5">
                      Posted: "{act.content}"
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-400/90 font-medium mt-0.5">
                      New user registered
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
