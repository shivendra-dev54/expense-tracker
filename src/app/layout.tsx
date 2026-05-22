import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/Components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "expense tracker app",
  description: "this is a simple web app to manage expenses spent on yourself and your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`antialiased h-screen flex flex-col bg-gray-900 text-white font-sans`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
