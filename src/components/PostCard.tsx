'use client';

import { useState } from 'react';
import Link from 'next/link';
import CountdownBadge from './CountdownBadge';
import EmojiReactions from './EmojiReactions';
import { MessageSquare, Calendar, User, UserX, Image as ImageIcon, Eye, EyeOff, Download, Flame } from 'lucide-react';
import { downloadImageAction } from '@/app/actions';

interface PostCardProps {
  post: {
    id: string;
    username: string;
    content: string;
    createdAt: number;
    keepContent: boolean;
    imageUrl?: string;
    reactions?: Record<string, number>;
    views?: number;
    feedViews?: number;
    downloads?: number;
  };
  isGhost?: boolean;
}

export default function PostCard({ post, isGhost = false }: PostCardProps) {
  const [showImage, setShowImage] = useState(false);
  const [downloadCount, setDownloadCount] = useState(post.downloads || 0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.imageUrl || isDownloading) return;
    setIsDownloading(true);

    // Call server action to increment download count
    try {
      const res = await downloadImageAction(post.id);
      if (res.success && typeof res.downloads === 'number') {
        setDownloadCount(res.downloads);
      }
    } catch {
      // Ignore network error for count update
    }

    // Trigger browser file download
    try {
      const response = await fetch(post.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zapself-${post.id.slice(0, 8)}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback
      window.open(post.imageUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

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
            <div className="mt-3 overflow-hidden rounded-xl border border-white/5 bg-bg-dark/20 space-y-2">
              {showImage ? (
                <div className="relative group/img">
                  <img
                    src={post.imageUrl}
                    alt="Post attachment"
                    className="w-full h-auto max-h-[400px] object-cover rounded-lg border border-white/10"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md cursor-pointer border border-emerald-400/30 disabled:opacity-50"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isDownloading ? 'Downloading...' : `Download (${downloadCount})`}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImage(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white font-bold text-xs transition-all shadow-md cursor-pointer border border-white/10"
                    >
                      <EyeOff className="w-3.5 h-3.5 text-accent" />
                      <span>Hide</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 px-4 border border-dashed border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all space-y-3">
                  <ImageIcon className="w-8 h-8 text-text-muted animate-pulse" />
                  <p className="text-xs text-text-muted text-center">
                    This post contains an image attachment.
                  </p>
                  <div className="flex items-center gap-2.5 flex-wrap justify-center">
                    <button
                      type="button"
                      onClick={() => setShowImage(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-xs transition-all shadow-md cursor-pointer focus:outline-none"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md cursor-pointer focus:outline-none border border-emerald-400/30 disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isDownloading ? 'Downloading...' : `Download (${downloadCount})`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Emoji Reactions Section */}
          <EmojiReactions postId={post.id} initialReactions={post.reactions} />
        </div>

        {/* Card Footer with Counters */}
        <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-white/5 flex-wrap gap-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-text-muted font-medium">
              <Calendar className="w-3.5 h-3.5 text-ghost" />
              <span>{formattedDate}</span>
            </div>

            {/* General Feed Views Counter */}
            <div
              className="flex items-center gap-1 text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20 font-medium"
              title="Feed Timeline Impressions"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="font-bold">{post.feedViews || 0}</span>
              <span className="text-[10px] opacity-80">feed</span>
            </div>

            {/* Dedicated Post Detail Views Counter */}
            <div
              className="flex items-center gap-1 text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 font-medium"
              title="Thread Detail Views"
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="font-bold">{post.views || 0}</span>
              <span className="text-[10px] opacity-80">views</span>
            </div>

            {/* Download Counter for image posts */}
            {post.imageUrl && (
              <div
                className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-medium"
                title="Total Image Downloads"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="font-bold">{downloadCount}</span>
                <span className="text-[10px] opacity-80">downloads</span>
              </div>
            )}
          </div>

          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-accent font-bold transition-all border border-white/5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Thread</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
