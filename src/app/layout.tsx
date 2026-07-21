import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'zapself | Ephemeral Social Network Experiment',
  description: 'An ephemeral social network experiment where user identities die after 24 hours, but ideas can be immortalized anonymously.',
  keywords: ['zapself', 'ephemeral', 'social network', 'experiment', 'anonymous', 'privacy'],
  authors: [{ name: 'zapself experiment' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://zapself.com'),
  manifest: '/icon/site.webmanifest',
  icons: {
    icon: [
      { url: '/icon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon/favicon.ico' },
    ],
    apple: [
      { url: '/icon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/icon/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/icon/android-chrome-512x512.png',
      },
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'zapself | Ephemeral Social Network Experiment',
    description: 'An ephemeral social network experiment where user identities die after 24 hours, but ideas can be immortalized anonymously.',
    url: '/',
    siteName: 'zapself',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/icon/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'zapself logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'zapself | Ephemeral Social Network Experiment',
    description: 'An ephemeral social network experiment where user identities die after 24 hours, but ideas can be immortalized anonymously.',
    images: ['/icon/android-chrome-512x512.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-bg-dark text-gray-100 font-sans selection:bg-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}
