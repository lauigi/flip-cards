import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import TitleBar from './components/title-bar';
import { Toaster } from './components/ui/toaster';

export const metadata: Metadata = {
  title: 'Flip Cards',
  description: 'Saving your mid-terms, and end-terms',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          <TitleBar />
          <main className="flex-1">{children}</main>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
