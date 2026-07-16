import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Client Demo Portal | Secure Access',
  description: 'Confidential client presentation walkthroughs and pitch decks.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Ambient background lights */}
        <div className="ambient-glow bg-1"></div>
        <div className="ambient-glow bg-2"></div>
        <div className="ambient-glow bg-3"></div>

        <header className="app-header">
          <div className="nav-container">
            <Link href="/" className="logo">
              Demo Portal
            </Link>
            <nav className="nav-links">
              <Link href="/" className="nav-link">Portal</Link>
              <Link href="/admin" className="nav-link">Admin Console</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="portal-footer">
          <p>&copy; 2026 AI Labs. Secure connections monitored. Confidential distribution only.</p>
        </footer>
      </body>
    </html>
  );
}
