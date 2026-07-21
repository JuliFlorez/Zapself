'use client';

import { useState } from 'react';
import Link from 'next/link';
import CountdownBadge from './CountdownBadge';
import EmojiReactions from './EmojiReactions';
import { MessageSquare, Calendar, User, UserX, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    username: string;
    content: string;
    createdAt: number;
    keepContent: boolean;
    imageUrl?: string;
    reactions?: Record<string, number>;
  };
  isGhost?: boolean;
}

export default function PostCard({ post, isGhost = false }: PostCardProps) {
  const [showImage, setShowImage] = useState(false);
  
  // Format creation date
  const formattedDate = new Date(post.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  }) + ' - ' + new Date(post.createdAt).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden border border-white/5 shadow-lg group">
      {/* Subtle indicator for immortalized / ghost posts */}
      {post.keepContent && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none rounded-tr-2xl"></div>
      )}

      <div className="flex flex-col gap-4">
        {/* Card Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isGhost ? 'bg-purple-950/40 text-purple-400' : 'bg-accent/10 text-accent'}`}>
              {isGhost ? <UserX className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <Link 
              href={`/user/${post.username}`}
              className={`font-bold hover:underline transition-colors text-sm ${
                isGhost ? 'text-purple-300 hover:text-purple-200' : 'text-white hover:text-accent'
              }`}
            >
              @{post.username}
            </Link>
          </div>

          <CountdownBadge createdAt={post.createdAt} keepContent={post.keepContent} />
        </div>

        {/* Card Body */}
        <div className="space-y-3">
          <p className="text-white text-base leading-relaxed break-words font-medium whitespace-pre-wrap">
            {post.content}
          </p>

          {post.imageUrl && (
            <div className="mt-3 overflow-hidden rounded-xl border border-white/5 bg-bg-dark/20">
              {showImage ? (
                <div className="relative group/img">
                  <img
                    src={post.imageUrl}
                    alt="Post attachment"
                    className="w-full h-auto max-h-[400px] object-cover rounded-lg border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowImage(false)}
                    className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white font-bold text-xs transition-all shadow-md focus:outline-none cursor-pointer border border-white/10"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-accent" />
                    <span>Hide Image</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 px-4 border border-dashed border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <ImageIcon className="w-8 h-8 text-text-muted mb-2 animate-pulse" />
                  <p className="text-xs text-text-muted mb-3 text-center">
                    This post contains an image. Click below to load it.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowImage(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-xs transition-all shadow-md cursor-pointer focus:outline-none"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show Image</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Emoji Reactions Section */}
          <EmojiReactions postId={post.id} initialReactions={post.reactions} />
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-ghost" />
            <span>{formattedDate}</span>
          </div>

          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white hover:text-accent font-bold transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Thread</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
