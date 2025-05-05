import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from '@/components/common/SiteHeader';
import HeaderWrapper from '@/components/common/HeaderWrapper';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Thee Human Archives",
  description: "Celebrating humanity one artifact at a time",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body
        className= {`${geistSans.variable} ${geistMono.variable} antialiased` }
      >
        {children}
        <HeaderWrapper className="sticky bottom-0 z-40" /> {/* bottom bar */}
      </body>
    </html>
  );
}
