import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'GazeTrack - Eye Gaze Tracker',
  description: 'Eye gaze tracker berbasis browser menggunakan MediaPipe Face Mesh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={jetbrainsMono.className}>{children}</body>
    </html>
  );
}
