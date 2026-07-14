'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { registerUser, createPost, getCurrentUser } from '@/lib/db';

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

  const cookieStore = await cookies();
  const keepContentCookie = cookieStore.get('zapself_keepContent')?.value === 'true';

  const post = await createPost(user.username, content, keepContentCookie);
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
  redirect('/register');
}
