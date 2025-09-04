import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EkoTracker Admin',
  description: 'Admin panel for EkoTracker Srbija',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">EkoTracker Admin</h1>
            <p className="text-gray-600 mt-2">Upravljanje prijavljenim deponijama</p>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}