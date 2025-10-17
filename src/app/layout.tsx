import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotificationContainer from "@/components/NotificationContainer";
import { NotificationProvider } from "@/context/NotificationContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Spoekle.com - Developer, Content Creator, and Gamer",
  description: "Welcome to Spoekle.com - Portfolio, blog, photography, and more from a passionate developer and content creator",
  keywords: ["Spoekle", "developer", "content creator", "portfolio", "blog", "photography"],
  authors: [{ name: "Spoekle" }],
  openGraph: {
    title: "Spoekle.com",
    description: "Developer, Content Creator, and Gamer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <NotificationProvider>
            <div className="flex flex-col min-h-screen relative bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-white transition duration-200">
              <Navbar />
              <main className="flex-grow relative z-10">
                {children}
              </main>
              <Footer />
              <NotificationContainer />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
