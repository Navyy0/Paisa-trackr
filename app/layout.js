import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PaisaTrackr",
  description: "One stop Finance Platform – Track your money smartly",
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear();

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />

          <footer className="bg-[#001f4d] py-6 text-yellow-400">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-yellow-300">
                © {year} PaisaTrackr. All rights reserved.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
