import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from './components/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8b5cf6' },
    { media: '(prefers-color-scheme: dark)', color: '#a855f7' }
  ],
}

export const metadata: Metadata = {
  title: '✨ Notes App - Your Creative Space',
  description: 'A beautiful, modern notes application with animated interactions, built with Next.js, TypeScript, and Tailwind CSS. Transform your thoughts into organized, searchable notes with style.',
  keywords: 'notes, productivity, creative, writing, organization, nextjs, typescript, tailwind',
  authors: [{ name: 'Notes App Team' }],
  creator: 'Notes App',
  publisher: 'Notes App',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: '✨ Notes App - Your Creative Space',
    description: 'Transform your thoughts into beautiful, organized notes',
    siteName: 'Notes App',
  },
  twitter: {
    card: 'summary_large_image',
    title: '✨ Notes App - Your Creative Space',
    description: 'Transform your thoughts into beautiful, organized notes',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}