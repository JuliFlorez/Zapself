import Link from 'next/link';
import CountdownBadge from './CountdownBadge';
import { MessageSquare, Calendar, User, UserX } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    username: string;
    content: string;
    createdAt: number;
    keepContent: boolean;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const isGhost = Date.now() - post.createdAt >= 24 * 60 * 60 * 1000;
  
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
        <p className="text-white text-base leading-relaxed break-words font-medium whitespace-pre-wrap">
          {post.content}
        </p>

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
