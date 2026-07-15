import { getCleanData } from '@/lib/db';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { ArrowLeft, Sparkles, EyeOff, ShieldCheck, Ghost } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  // Run the purge and get clean data
  const data = await getCleanData();

  // Find the post
  const post = data.posts.find((p) => p.id === id);

  if (!post) {
    // Beautiful, custom 404 page reading: "This memory has faded away."
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <Header />

        <main className="flex-1 flex flex-col justify-center items-center px-4 max-w-md mx-auto space-y-6 z-10">
          <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-full text-purple-400 animate-pulse">
            <Ghost className="w-12 h-12" />
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              This memory has faded away.
            </h1>
            <p className="text-xs text-text-muted leading-relaxed">
              The post you are trying to view has expired under the 24-hour rule or has been purged from our ephemeral timeline.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-5 py-3 bg-gradient-to-r from-accent to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-accent/15 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to active timeline</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Check if the author is still active in the experiment
  const isAuthorActive = data.users.some(
    (u) => u.username.toLowerCase() === post.username.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to feed</span>
          </Link>
        </div>

        {/* Thread Header */}
        <div className="border-b border-white/5 pb-2">
          <h1 className="text-xs font-black uppercase tracking-widest text-text-muted">
            Thought Thread
          </h1>
        </div>

        {/* The Main Post Card */}
        <PostCard post={post} isGhost={!isAuthorActive} />

        {/* Thread Info Banner */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent" /> Identity Status
          </h2>
          <div className="text-xs text-text-muted space-y-2">
            <p>
              Author:{' '}
              <strong className={isAuthorActive ? 'text-white' : 'text-purple-300'}>
                @{post.username}
              </strong>{' '}
              ({isAuthorActive ? 'Identity Active' : 'Identity Expired & Wiped'})
            </p>
            {post.keepContent ? (
              <div className="flex items-start gap-2 bg-purple-500/5 border border-purple-500/10 rounded-lg p-3 mt-1.5 text-purple-200">
                <EyeOff className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  This post is <strong>Immortalized</strong>. The author’s identity will be (or has been) erased from the user registry at the 24-hour mark, but the message remains forever anonymous.
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 mt-1.5 text-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  This post is <strong>Ephemeral</strong>. Both the post and the author’s identity will be completely wiped from the server 24 hours after creation.
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
