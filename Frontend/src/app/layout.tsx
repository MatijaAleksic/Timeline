import type { Metadata } from "next";
import "./globals.scss";
import Header from "@/components/Generic/Header/Header";
import Footer from "@/components/Generic/Footer/Footer";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Timeline web app for learning history through visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="mainContentWrapper">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
