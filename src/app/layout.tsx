import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import logo from "./logo.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.leetproof.org"),
  title: "LeetProof - Theorem Proving Platform",
  description:
    "Sharpen your Lean 4 skills by proving theorems and verifying code. Share solutions and hints with the community.",
  openGraph: {
    title: "LeetProof - Theorem Proving Platform",
    description:
      "Sharpen your Lean 4 skills by proving theorems and verifying code. Share solutions and hints with the community.",
    url: "/",
    siteName: "LeetProof",
    images: [
      {
        url: logo.src,
        width: logo.width,
        height: logo.height,
        alt: "LeetProof",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LeetProof - Theorem Proving Platform",
    description:
      "Sharpen your Lean 4 skills by proving theorems and verifying code. Share solutions and hints with the community.",
    images: [
      {
        url: logo.src,
        width: logo.width,
        height: logo.height,
        alt: "LeetProof",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('leetproof-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex flex-1 min-h-0 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
