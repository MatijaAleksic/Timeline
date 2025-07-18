import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Generic/Sidebar/Sidebar";

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
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
