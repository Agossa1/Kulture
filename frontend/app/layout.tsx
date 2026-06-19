import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./provider";

export const metadata: Metadata = {
  title: "Kulture - Plateforme de gestion d'événements artistiques",
  description: "Kulture est une plateforme de gestion d'événements artistiques qui permet aux organisateurs de créer, promouvoir et gérer leurs événements, et aux artistes de vendre leurs œuvres et tickets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className="font-sans h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
