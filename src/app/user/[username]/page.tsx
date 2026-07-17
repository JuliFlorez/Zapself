import type { Metadata } from 'next';
import { getCleanData, getServerTime } from '@/lib/db';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { User, UserX, Ghost, Calendar, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username).toLowerCase();
  const data = await getCleanData();

  const activeUser = data.users.find(
    (u) => u.username.toLowerCase() === decodedUsername
  );

  const title = `@${decodedUsername}'s Identity | zapself`;
  
  let description = `View @${decodedUsername}'s profile and thoughts timeline on zapself.`;
  if (activeUser) {
    description = `@${decodedUsername} is an active participant in the zapself 24-hour ephemeral experiment. Check out their live timeline.`;
  } else {
    const userPosts = data.posts.filter((p) => p.username.toLowerCase() === decodedUsername);
    if (userPosts.length > 0) {
      description = `@${decodedUsername}'s session has expired and their identity was wiped, but their immortalized footprints remain here.`;
    } else {
      description = `No trace of the identity @${decodedUsername} was found on the zapself experiment timeline.`;
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/user/${decodedUsername}`,
    },
    openGraph: {
      title,
      description,
      url: `/user/${decodedUsername}`,
      type: 'profile',
      username: decodedUsername,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username).toLowerCase();

  // Run the purge and get clean data
  const data = await getCleanData();

  // Find the user if currently active
  const activeUser = data.users.find(
    (u) => u.username.toLowerCase() === decodedUsername
  );

  // Find all posts written by this user
  const userPosts = data.posts
    .filter((p) => p.username.toLowerCase() === decodedUsername)
    .sort((a, b) => b.createdAt - a.createdAt);

  const totalPostsCount = userPosts.length;

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 space-y-8">
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

        {/* Profile Card */}
        <section aria-label="Identity info">
          {activeUser ? (
            /* Active User Profile */
            <div className="glass-panel rounded-2xl p-6 glow-indigo border border-white/5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-2xl text-accent shadow-sm shadow-accent/5">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">@{activeUser.username}</h1>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      <span>Registered identity</span>
                    </div>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-pulse-glow">
                  Active Experiment Participant
                </div>
              </div>

              <div className="text-xs text-text-muted border-t border-white/5 pt-4 flex flex-wrap justify-between gap-4">
                <div>
                  Identity Created:{' '}
                  <strong className="text-white">
                    {new Date(activeUser.createdAt).toLocaleTimeString()}
                  </strong>
                </div>
                <div>
                  Time Remaining:{' '}
                  <strong className="text-accent">
                    {Math.max(
                      0,
                      Math.ceil(
                        (activeUser.createdAt + 24 * 60 * 60 * 1000 - getServerTime()) /
                          (1000 * 60 * 60)
                      )
                    )}
                    h left
                  </strong>
                </div>
              </div>
            </div>
          ) : userPosts.length > 0 ? (
            /* Expired User Profile with Surviving Posts */
            <div className="glass-panel rounded-2xl p-6 glow-purple border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-950/40 border border-purple-500/20 rounded-2xl text-purple-400">
                  <UserX className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-purple-300">@{decodedUsername}</h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 mt-1">
                    <Ghost className="w-3 h-3" /> Wiped Identity
                  </span>
                </div>
              </div>

              <div className="p-4 bg-purple-500/5 border border-purple-500/15 rounded-xl text-center">
                <p className="text-sm font-semibold italic text-purple-200">
                  &quot;This user has ceased to exist in the experiment, but their footprints remain.&quot;
                </p>
              </div>
            </div>
          ) : (
            /* Entity Never Existed / Completely Faded */
            <div className="glass-panel rounded-2xl p-8 text-center border border-white/5 space-y-4">
              <div className="inline-flex p-3 bg-white/5 rounded-full text-text-muted">
                <Ghost className="w-6 h-6" />
              </div>
              <h1 className="text-lg font-bold text-white">Ghost Entity</h1>
              <p className="text-sm text-text-muted max-w-sm mx-auto">
                No trace of the identity <strong className="text-accent">@{decodedUsername}</strong> was found. They may have never existed, or all their thoughts have faded away.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-colors"
                >
                  <span>Return to Feed</span>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* User's Posts list */}
        {totalPostsCount > 0 && (
          <section className="space-y-4" aria-label="Entity thoughts timeline">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-text-muted">
                Thoughts Timeline ({totalPostsCount} post{totalPostsCount === 1 ? '' : 's'})
              </h2>
              {activeUser ? (
                <span className="text-[10px] text-text-muted">Active identity publications</span>
              ) : (
                <span className="text-[10px] text-purple-400 font-bold flex items-center gap-1">
                  <Ghost className="w-3 h-3" /> Ghost posts survived the purge
                </span>
              )}
            </div>

            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} isGhost={!activeUser} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
