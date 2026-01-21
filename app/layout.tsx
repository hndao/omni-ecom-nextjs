import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ETHEREAL - Premium Gemstone Collection",
  description: "Discover a curated world of rare, ethically sourced gemstones crafted into timeless masterpieces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${playfair.variable} ${montserrat.variable} bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-100 font-display transition-colors duration-300 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
