import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'FloodGuard — IoT Flood Monitoring System',
  description:
    'Real-time flood monitoring dashboard powered by ESP32, Raspberry Pi 5, and ML prediction. Track water levels, rain intensity, flow rate, and automated flood gate control.',
  keywords: ['flood monitoring', 'IoT', 'ESP32', 'Raspberry Pi', 'machine learning', 'flood alert', 'water level sensor'],
  authors: [{ name: 'FloodGuard Lab Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#07111E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="app-shell">
            <Sidebar />
            <main className="main-content" id="main-content">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
