import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GradePulse - Modern Student Progress Tracking Platform',
  description: 'Transform your educational institution with GradePulse - the next-generation student progress tracking platform featuring AI-powered testing, real-time analytics, and collaborative learning tools.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 