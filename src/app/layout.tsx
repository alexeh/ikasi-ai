import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ikasi-ai',
  description: 'Next.js app with Tailwind CSS and Supabase',
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
