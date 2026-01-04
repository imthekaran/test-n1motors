import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Number1 Motors - Premium Vehicle Dealer New Zealand",
  description: "Browse quality vehicles from Number1 Motors. Find your perfect car from our extensive collection. FORD, TOYOTA, and more available.",
  keywords: "vehicle dealer, cars for sale, Number1 Motors, New Zealand, Auckland",
  authors: [{ name: "Number1 Motors" }],
  creator: "Number1 Motors",
  metadataBase: new URL("https://number1motors.co.nz"),
  openGraph: {
    type: "website",
    url: "https://number1motors.co.nz",
    title: "Number1 Motors - Premium Vehicle Dealer",
    description: "Browse quality vehicles from our extensive collection",
    images: [
      {
        url: "https://number1motors.co.nz/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Number1 Motors",
    description: "Premium Vehicle Dealer",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#DC2626" />
        <link rel="canonical" href="https://number1motors.co.nz" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
