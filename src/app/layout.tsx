import type { Metadata } from 'next';
import './root.css';

export const metadata: Metadata = {
  title: 'Canvas Editor V3',
  description: 'CE.SDK editor-first bootstrap for Canvas Editor V3'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh' }}>{children}</body>
    </html>
  );
}
