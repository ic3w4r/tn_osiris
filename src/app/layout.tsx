import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';

import ErrorBoundary from '@/components/ErrorBoundary';

import './globals.css';

const siteUrl = 'https://tn-osiris.local';

export const viewport: Viewport = {
  themeColor: '#24c4b0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'TN-OSIRIS | Tamil Nadu Governance Intelligence',
  description:
    'A map-first governance monitoring platform for Tamil Nadu covering district risk, grievances, schemes, public assets, projects, tenders, and disaster readiness.',
  keywords: [
    'Tamil Nadu governance dashboard',
    'district intelligence platform',
    'public grievance monitoring',
    'scheme delivery tracking',
    'project monitoring Tamil Nadu',
    'tender risk analytics',
    'governance intelligence map',
  ],
  openGraph: {
    title: 'TN-OSIRIS',
    description:
      'Tamil Nadu Governance Intelligence & Monitoring System with district command views, risk scoring, grievance intelligence, and project tracking.',
    url: siteUrl,
    type: 'website',
    siteName: 'TN-OSIRIS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TN-OSIRIS',
    description:
      'Map-first monitoring for Tamil Nadu governance performance, delivery risks, and public accountability.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary name="TN-OSIRIS Core">
          {children}
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
