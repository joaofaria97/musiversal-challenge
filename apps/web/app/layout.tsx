import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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

const hotjarSiteId = process.env.NEXT_PUBLIC_HOTJAR_SITE_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {hotjarSiteId && (
          <Script id="hotjar-tracking" strategy="afterInteractive">
            {`
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${hotjarSiteId},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `}
          </Script>
        )}
      </head>
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
