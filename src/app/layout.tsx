
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'NarrativeFlow - AI Agents Presentation',
  description: 'A cinematic presentation exploring multi-agent AI collaboration and the future of digital coworkers at the Swedish Tax Agency.',
  keywords: 'AI, Agents, Genkit, Swedish Tax Agency, Innovation, Hackathon',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-body antialiased bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
