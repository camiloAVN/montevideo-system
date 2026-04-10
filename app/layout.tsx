import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Montevideo Convention Center",
    template: "%s | MCC",
  },
  description: "Sistema de gestión para Montevideo Convention Center.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgb(20, 20, 20)',
                color: 'rgb(237, 237, 237)',
                border: '1px solid rgb(32, 32, 32)',
              },
              success: {
                iconTheme: {
                  primary: 'rgb(233, 30, 99)',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: 'rgb(239, 68, 68)',
                  secondary: 'white',
                },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
