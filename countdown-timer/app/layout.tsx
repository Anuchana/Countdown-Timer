import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  // Only load weights actually used: 400 (body), 600 (semibold), 800 (display digits)
  weight: ['400', '600', '800'],
});

export const metadata: Metadata = {
  title: 'Coming Soon — We Launch Soon',
  description:
    'Our new experience is coming. Subscribe to be notified the moment we go live.',
  keywords: ['coming soon', 'launch', 'countdown timer'],
  openGraph: {
    title: 'Coming Soon — We Launch Soon',
    description: 'Subscribe to be notified the moment we go live.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
