import type { Metadata } from "next";
import "./root.css";

export const metadata: Metadata = {
  title: "Caneva Editor",
  description: "Interface canvas générique avec volet gauche, inspecteur et palettes",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body style={{ minHeight: "100vh" }}>{children}</body>
    </html>
  );
}
