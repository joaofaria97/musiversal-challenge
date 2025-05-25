import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AuthenticatedLayoutWrapper from "@/components/auth/AuthenticatedLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vinly - Your Personal Music Collection",
  description: "Your personal music collection, beautifully organized.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-zinc-50`}>
        <Providers>
          <AuthenticatedLayoutWrapper>
            {children}
          </AuthenticatedLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
