import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppSidebar from '@/components/AppSidebar';
import { FirebaseClientProvider } from '@/firebase';


export const metadata: Metadata = {
  title: 'Ikasgela',
  description: 'App para alumnos de primaria',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AppSidebar>{children}</AppSidebar>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
