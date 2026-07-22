'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { registerUser, createPost, getCurrentUser, getUserById, addReactionToPost, togglePostReaction, incrementPostDownloads, incrementPostViews, incrementFeedViews } from '@/lib/db';

export interface RegisterResult {
  error?: string;
}

export async function registerAction(prevState: RegisterResult | null, formData: FormData): Promise<RegisterResult> {
  const username = formData.get('username') as string;
  const keepContent = formData.get('keepContent') === 'true' || formData.get('keepContent') === 'on';

  if (!username) {
    return { error: 'Username is required.' };
  }

  const res = await registerUser(username);
  if (!res.success || !res.user) {
    return { error: res.error || 'Failed to register.' };
  }

  const cookieStore = await cookies();
  
  // Set cookies for session (24 hours expiry)
  cookieStore.set('zapself_userId', res.user.id, {
    maxAge: 24 * 60 * 60,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });
  
  cookieStore.set('zapself_username', res.user.username, {
    maxAge: 24 * 60 * 60,
    path: '/',
  });

  cookieStore.set('zapself_keepContent', keepContent ? 'true' : 'false', {
    maxAge: 24 * 60 * 60,
    path: '/',
  });

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function createPostAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You are not logged in or your session has expired.' };
  }

  const content = formData.get('content') as string;
  if (!content || !content.trim()) {
    return { error: 'Post content cannot be empty.' };
  }

  const imageUrl = formData.get('imageUrl') as string || undefined;

  // Validate server-side payload size for images (Base64 encoding for 2.5MB is approx 3.5M characters)
  if (imageUrl && imageUrl.length > 4 * 1024 * 1024) {
    return { error: '⚠️ La imagen adjunta supera el tamaño máximo permitido (2.5 MB).' };
  }

  const cookieStore = await cookies();
  const keepContentCookie = cookieStore.get('zapself_keepContent')?.value === 'true';

  const post = await createPost(user.username, content, keepContentCookie, imageUrl);
  if (!post) {
    return { error: 'Failed to create post.' };
  }

  revalidatePath('/');
  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('zapself_userId');
  cookieStore.delete('zapself_username');
  cookieStore.delete('zapself_keepContent');
  revalidatePath('/', 'layout');
  redirect('/register');
}

export async function loginByIdAction(prevState: RegisterResult | null, formData: FormData): Promise<RegisterResult> {
  const userId = (formData.get('userId') as string)?.trim();
  if (!userId) {
    return { error: 'Identity Secret ID is required.' };
  }

  const user = await getUserById(userId);
  if (!user) {
    return { error: 'No active session found with this ID or identity has expired (24h).' };
  }

  const cookieStore = await cookies();
  cookieStore.set('zapself_userId', user.id, {
    maxAge: 24 * 60 * 60,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });
  
  cookieStore.set('zapself_username', user.username, {
    maxAge: 24 * 60 * 60,
    path: '/',
  });

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function reactToPostAction(postId: string, emoji: string) {
  if (!postId || !emoji) return { error: 'Invalid parameters.' };
  const updatedReactions = await addReactionToPost(postId, emoji);
  if (!updatedReactions) return { error: 'Failed to react.' };
  revalidatePath('/');
  return { success: true, reactions: updatedReactions };
}

export async function togglePostReactionAction(
  postId: string,
  newEmoji: string | null,
  previousEmoji: string | null
) {
  if (!postId) return { error: 'Invalid parameters.' };
  const updatedReactions = await togglePostReaction(postId, newEmoji, previousEmoji);
  if (!updatedReactions) return { error: 'Failed to update reaction.' };
  revalidatePath('/');
  return { success: true, reactions: updatedReactions };
}

export async function downloadImageAction(postId: string) {
  if (!postId) return { error: 'Invalid post ID' };
  const downloads = await incrementPostDownloads(postId);
  revalidatePath('/');
  revalidatePath(`/post/${postId}`);
  return { success: true, downloads };
}

export async function recordPostViewAction(postId: string) {
  if (!postId) return { success: false };
  const cookieStore = await cookies();
  const viewedCookieKey = `zapself_viewed_post_${postId}`;
  const alreadyViewed = cookieStore.get(viewedCookieKey)?.value === 'true';

  if (!alreadyViewed) {
    const updatedViews = await incrementPostViews(postId);
    cookieStore.set(viewedCookieKey, 'true', {
      maxAge: 24 * 60 * 60,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
    revalidatePath(`/post/${postId}`);
    revalidatePath('/');
    return { success: true, views: updatedViews, incremented: true };
  }
  return { success: true, incremented: false };
}

export async function recordFeedViewsAction(postIds: string[]) {
  if (!postIds || postIds.length === 0) return { success: false };
  const cookieStore = await cookies();
  const viewedFeedCookieStr = cookieStore.get('zapself_feed_views')?.value || '';
  let viewedFeedIds = new Set<string>();
  try {
    if (viewedFeedCookieStr) {
      viewedFeedIds = new Set(JSON.parse(viewedFeedCookieStr));
    }
  } catch {
    // fallback
  }

  const unviewedPostIds = postIds.filter((id) => !viewedFeedIds.has(id));

  if (unviewedPostIds.length > 0) {
    await incrementFeedViews(unviewedPostIds);
    unviewedPostIds.forEach((id) => viewedFeedIds.add(id));
    const updatedArray = Array.from(viewedFeedIds).slice(-100);
    cookieStore.set('zapself_feed_views', JSON.stringify(updatedArray), {
      maxAge: 24 * 60 * 60,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
    revalidatePath('/');
    return { success: true, unviewedPostIds, incremented: true };
  }
  return { success: true, incremented: false };
}
