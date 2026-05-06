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
  description: "Centro de eventos con producción audiovisual profesional, shows de primer nivel y logística integral.",
  icons: {
    icon: [
      { url: '/favicon/favicon.ico',        sizes: 'any'   },
      { url: '/favicon/favicon-16x16.png',  sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png',  sizes: '32x32', type: 'image/png' },
    ],
    apple:    { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    shortcut: '/favicon/favicon.ico',
  },
  manifest: '/favicon/site.webmanifest',
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
