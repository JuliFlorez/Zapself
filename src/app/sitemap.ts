import type { MetadataRoute } from 'next';
import { getCleanData } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zapself.com';
  
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  try {
    const data = await getCleanData();
    
    // Active users profiles
    const userUrls = data.users.map((user) => ({
      url: `${baseUrl}/user/${encodeURIComponent(user.username.toLowerCase())}`,
      lastModified: new Date(user.createdAt),
      changeFrequency: 'hourly' as const,
      priority: 0.5,
    }));

    // Active/immortalized posts
    const postUrls = data.posts.map((post) => ({
      url: `${baseUrl}/post/${post.id}`,
      lastModified: new Date(post.createdAt),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }));

    return [...routes, ...userUrls, ...postUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
