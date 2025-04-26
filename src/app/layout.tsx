import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Verify this path alias

export const metadata: Metadata = {
  title: 'BudgetEasy - Track Your Spending',
  description: 'A simple app to manage your budget and track expenses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Add suppressHydrationWarning to the html tag */}
      <body className={`${GeistSans.variable} font-sans antialiased`} suppressHydrationWarning>
        {/* Add suppressHydrationWarning to the body tag if needed, but usually html tag is enough */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
