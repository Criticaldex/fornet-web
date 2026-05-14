import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LangProvider } from "./context/LangContext";

export const metadata: Metadata = {
  title: "ForNet | Industria 4.0",
  description:
    "ForNet – Software industrial para monitorización, control y análisis de producción en tiempo real.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
