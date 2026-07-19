import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { DeskChatProvider } from "@/components/desk/desk-chat-provider";
import { AppShell } from "@/components/layout/app-shell";
import { SplashScreen } from "@/components/layout/splash-screen";
import { QueryProvider } from "@/components/query-provider";
import { WalkthroughProgressProvider } from "@/components/walkthroughs/progress-provider";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "NCA Knowledge Desk",
  description: "Institutional knowledge & AI help desk for the NCA Engineering department.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="h-full">
        <QueryProvider>
          <SplashScreen />
          <DeskChatProvider>
            <WalkthroughProgressProvider>
              <AppShell>{children}</AppShell>
            </WalkthroughProgressProvider>
          </DeskChatProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
