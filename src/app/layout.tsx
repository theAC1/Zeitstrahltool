import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { SkipLinks } from '@/components/ui/SkipLinks';

export const metadata: Metadata = {
  title: {
    default: 'Zeitstrahl - Interactive Timeline Tool',
    template: '%s | Zeitstrahl',
  },
  description:
    'Free, web-based tool for creating interactive historical timelines. Designed for education - teachers and students can visualize and experience history.',
  keywords: [
    'timeline',
    'history',
    'education',
    'interactive',
    'visualization',
    'Zeitstrahl',
    'Geschichte',
    'Bildung',
  ],
  authors: [{ name: 'Zeitstrahl Team' }],
  creator: 'Zeitstrahl',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: 'en_US',
    url: 'https://zeitstrahl.vercel.app',
    siteName: 'Zeitstrahl',
    title: 'Zeitstrahl - Interactive Timeline Tool',
    description: 'Create interactive historical timelines for education',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeitstrahl - Interactive Timeline Tool',
    description: 'Create interactive historical timelines for education',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <I18nProvider>
          <SkipLinks />
          <div className="relative flex min-h-screen flex-col">
            <main id="main-content" className="flex-1" role="main" aria-label="Main content">
              {children}
            </main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
