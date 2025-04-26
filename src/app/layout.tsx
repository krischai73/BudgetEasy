import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Corrected import
// import { GeistMono } from 'geist/font/mono'; // Removed import - dependency not found
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

export const metadata: Metadata = {
  title: 'BudgetEasy - Track Your Spending', // Updated Title
  description: 'A simple app to manage your budget and track expenses.', // Updated Description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
