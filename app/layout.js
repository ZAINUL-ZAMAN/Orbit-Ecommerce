import { Sora } from 'next/font/google';
import './globals.css';

const sora = Sora({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Orbit 65 — Compact keyboard',
  description: 'A compact wireless keyboard with a quiet, precise feel.',
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sora.className}>{children}</body>
    </html>
  );
}
