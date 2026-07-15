import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

export interface User {
  id: string;
  username: string;
  createdAt: number; // timestamp ms
}

export interface Post {
  id: string;
  username: string;
  content: string;
  createdAt: number; // timestamp ms
  keepContent: boolean;
}

export interface DatabaseSchema {
  users: User[];
  posts: Post[];
}

const DB_PATH = path.join(process.cwd(), 'db.json');

// Sequential lock to prevent write collisions
let lockPromise: Promise<void> = Promise.resolve();

async function runLocked<T>(fn: () => Promise<T>): Promise<T> {
  const currentLock = lockPromise;
  let resolveLock: () => void = () => {};
  lockPromise = new Promise<void>((resolve) => {
    resolveLock = resolve;
  });
  await currentLock;
  try {
    return await fn();
  } finally {
    resolveLock();
  }
}

/**
 * 1. Reads the db.json file.
 * 2. Gets the current timestamp (Date.now()).
 * 3. User Purge: Permanently filter out and delete any user older than 24 hours.
 * 4. Conditional Post Purge: Filter out and delete posts older than 24 hours ONLY if keepContent is false.
 * 5. Synchronization: Writes the cleaned arrays back to db.json and returns the updated data.
 */
export async function getCleanData(): Promise<DatabaseSchema> {
  return runLocked(async () => {
    try {
      let dataStr: string;
      try {
        dataStr = await fs.readFile(DB_PATH, 'utf-8');
      } catch {
        // If file doesn't exist or is empty, write default structure
        const initial: DatabaseSchema = { users: [], posts: [] };
        await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
        return initial;
      }

      let data: DatabaseSchema;
      try {
        data = JSON.parse(dataStr);
      } catch {
        data = { users: [], posts: [] };
      }

      const now = Date.now();
      const cutoff = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      // Purge users older than 24 hours
      const activeUsers = (data.users || []).filter(
        (u) => now - u.createdAt < cutoff
      );

      // Purge posts older than 24 hours if keepContent is false
      const activePosts = (data.posts || []).filter((p) => {
        const age = now - p.createdAt;
        if (age >= cutoff && !p.keepContent) {
          return false;
        }
        return true;
      });

      const cleanedData: DatabaseSchema = {
        users: activeUsers,
        posts: activePosts,
      };

      await fs.writeFile(DB_PATH, JSON.stringify(cleanedData, null, 2), 'utf-8');
      return cleanedData;
    } catch (error) {
      console.error('Error cleaning database:', error);
      return { users: [], posts: [] };
    }
  });
}

/**
 * Helper to register a new user.
 * Cleans the DB first. Verifies username is free.
 */
export async function registerUser(username: string): Promise<{ success: boolean; error?: string; user?: User }> {
  // Normalize username
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername) {
    return { success: false, error: 'Username cannot be empty.' };
  }
  if (!/^[a-zA-Z0-9_]{3,15}$/.test(cleanUsername)) {
    return { success: false, error: 'Username must be between 3 and 15 alphanumeric characters or underscores.' };
  }

  // Get cleaned data
  const data = await getCleanData();

  // Check if username is already taken by an active user
  const taken = data.users.some(u => u.username.toLowerCase() === cleanUsername);
  if (taken) {
    return { success: false, error: 'Username is already taken by an active session.' };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    username: cleanUsername,
    createdAt: Date.now(),
  };

  // Save new user
  await runLocked(async () => {
    try {
      const dataStr = await fs.readFile(DB_PATH, 'utf-8');
      const currentData: DatabaseSchema = JSON.parse(dataStr);
      currentData.users.push(newUser);
      await fs.writeFile(DB_PATH, JSON.stringify(currentData, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to append user:', err);
    }
  });

  return { success: true, user: newUser };
}

/**
 * Helper to create a post.
 * Cleans the DB first.
 */
export async function createPost(username: string, content: string, keepContent: boolean): Promise<Post | null> {
  const cleanContent = content.trim();
  if (!cleanContent) return null;

  // Clean data first
  await getCleanData();

  const newPost: Post = {
    id: crypto.randomUUID(),
    username,
    content: cleanContent,
    createdAt: Date.now(),
    keepContent,
  };

  await runLocked(async () => {
    try {
      const dataStr = await fs.readFile(DB_PATH, 'utf-8');
      const currentData: DatabaseSchema = JSON.parse(dataStr);
      currentData.posts.push(newPost);
      await fs.writeFile(DB_PATH, JSON.stringify(currentData, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to append post:', err);
    }
  });

  return newPost;
}

/**
 * Gets the current active user based on cookies.
 * Cleans the DB first.
 */
export async function getCurrentUser(): Promise<User | null> {
  const data = await getCleanData();
  const cookieStore = await cookies();
  const userId = cookieStore.get('zapself_userId')?.value;
  if (!userId) return null;
  return data.users.find((u) => u.id === userId) || null;
}

export function getServerTime(): number {
  return Date.now();
}
