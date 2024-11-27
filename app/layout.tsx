import type { Metadata } from 'next';
import './globals.css';
import TitleBar from './components/title-bar';

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
        <TitleBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
