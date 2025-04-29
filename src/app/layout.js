import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProviderWrapper from "../context/AuthProviderWrapper";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Boost Your Business English Skills",
  description: "Get daily templates, practice exercises, and AI feedback to upgrade your real-world communication.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <AuthProviderWrapper>
          <ThemeProvider>
            <LanguageProvider>
              <Navbar />
              <main className="pt-20">
                {children}
              </main>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
