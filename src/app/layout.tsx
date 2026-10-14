import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import MobileNav from "@/components/layout/MobileNav";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MENZPLAZA | The Right Fit. Every Time.",
  description:
    "Specialized premium men's pants and trousers store in India. Explore tailored formal pants, bespoke chinos, rugged cargo, designer jeans, relaxed linen, and athletic joggers.",
  keywords: [
    "men's pants",
    "formal trousers",
    "chinos India",
    "cargo pants",
    "linen pants",
    "menswear India",
    "MENZPLAZA",
    "slim fit trousers",
  ],
  openGraph: {
    title: "MENZPLAZA | Premium Men's Pants",
    description: "The Right Fit. Every Time. Crafted trousers engineered for the modern Indian gentleman.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#FAF8F5] text-obsidian font-sans antialiased flex flex-col pb-16 md:pb-0">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileNav />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
