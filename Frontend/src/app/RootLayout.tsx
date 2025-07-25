import Footer from "@/components/Generic/Layout/Footer/Footer";
import Header from "@/components/Generic/Layout/Header/Header";

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
