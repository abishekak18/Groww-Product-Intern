import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Groww Start — Educational Investing Companion for Indian Gen Z',
  description:
    'A zero-risk educational companion for young Indians aged 20-26 to learn investing fundamentals, practice with ₹10,000 virtual cash, and track financial goals.',
  keywords: [
    'investing for beginners',
    'Gen Z finance India',
    'mutual funds education',
    'SIP for students',
    'virtual trading simulator',
    'financial literacy India',
  ],
  authors: [{ name: 'Groww Start Educational Sandbox' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
        {children}
      </body>
    </html>
  );
}
