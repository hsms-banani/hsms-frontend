// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/styles/safe-content.css'
import { TopBar } from '@/components/Header/TopBar';
import { LogoBar } from '@/components/Header/LogoBar';
import { MainNav } from '@/components/Header/MainNav';
import { Footer } from '@/components/Footer';
// import ClientLoader from '@/components/ClientLoader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Holy Spirit Major Seminary',
  description: 'Holy Spirit Major Seminary is a premier institution dedicated to the formation of future priests, offering theological education, spiritual guidance, and pastoral training in a faith-centered environment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden max-w-full`}>
        {/* <ClientLoader /> */}
        <TopBar />
        <LogoBar />
        <MainNav />
        <main className="overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}