import type { Metadata } from 'next';
import './globals.css';

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
