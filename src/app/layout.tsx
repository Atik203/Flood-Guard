import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeProvider';
import { AppSidebar } from '@/components/layout/AppSidebar';

export const metadata: Metadata = {
  title: 'FloodGuard — IoT Flood Monitoring System',
  description: 'Real-time flood monitoring powered by ESP32, Raspberry Pi 5, and ML prediction. Track water levels, rain, flow rate, and automated flood gate control.',
  keywords: ['flood monitoring', 'IoT', 'ESP32', 'Raspberry Pi', 'machine learning', 'flood alert'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen bg-background">
            <AppSidebar />
            <main className="flex-1 min-w-0 transition-all duration-300">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
