import { getCleanData, getCurrentUser } from '@/lib/db';
import Header from '@/components/Header';
import CreatePostForm from '@/components/CreatePostForm';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { ArrowRight, Sparkles, MessageSquareWarning } from 'lucide-react';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  // Executes DB purge/cleanup and retrieves updated lists
  const data = await getCleanData();
  const user = await getCurrentUser();

  // Read keepContent preference directly from cookies if user is active
  const cookieStore = await cookies();
  const keepContent = cookieStore.get('zapself_keepContent')?.value === 'true';

  // Sort posts by newest first
  const sortedPosts = [...data.posts].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      {/* Dynamic Navigation Header */}
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 space-y-8">
        <section aria-label="Introduce post form or login CTA">
          {user ? (
            <CreatePostForm keepContent={keepContent} username={user.username} />
          ) : (
            <div className="glass-panel rounded-2xl p-6 glow-indigo border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-sm font-bold text-white flex items-center justify-center md:justify-start gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent" /> Join the Experiment
                </h2>
                <p className="text-xs text-text-muted">
                  Create a temporary identity to post your ideas. You will expire in 24 hours.
                </p>
              </div>
              <Link
                href="/register"
                id="join-experiment-cta"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-accent to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-accent/15 cursor-pointer shrink-0"
              >
                <span>Register Identity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* Feed List */}
        <section className="space-y-4" aria-label="Chronological thoughts feed">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h1 className="text-xs font-black uppercase tracking-widest text-text-muted">
              Live Feed ({sortedPosts.length} post{sortedPosts.length === 1 ? '' : 's'})
            </h1>
            <span className="text-[10px] text-text-muted">Auto-purges active every page view</span>
          </div>

          {sortedPosts.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center border border-white/5 space-y-3">
              <div className="inline-flex p-3 bg-white/5 rounded-full text-text-muted">
                <MessageSquareWarning className="w-6 h-6" />
              </div>
              <p className="text-sm text-text-muted font-medium">
                The timeline is empty. The previous cycle has faded away.
              </p>
              {user && (
                <p className="text-xs text-accent">
                  Be the first to leave a footprint in this timeline.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
