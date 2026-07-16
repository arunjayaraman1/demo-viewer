import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Newpage Solutions | Secure Demo Portal',
  description: 'Deliver breakthroughs. Confidential client presentation walkthroughs and pitch decks.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-page)', fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}>
          {/* Masthead */}
          <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--np-teal-ink)', backgroundImage: 'radial-gradient(ellipse 60% 100% at 100% 0%, rgba(8,189,184,0.22), transparent 60%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <svg className="np-icon" width="28" height="28" viewBox="0 0 100 100" fill="none">
                  <path d="M10 20 L55 50 L10 80 L26 50 Z" fill="var(--np-teal)"/>
                  <path d="M26 50 L55 50 L38 26 Z" fill="var(--np-deep-teal)"/>
                  <path d="M26 50 L55 50 L38 74 Z" fill="var(--np-orange)"/>
                  <path d="M55 50 L90 50 L72 30 Z" fill="var(--np-gold)"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '17px', letterSpacing: '-0.3px', color: '#fff' }}>
                  Newpage <span style={{ color: 'var(--np-teal-soft)', fontWeight: 500 }}>Demo Portal</span>
                </span>
              </Link>
            </div>
          </header>

          {children}

          <footer style={{ textAlign: 'center', padding: '28px 24px', fontSize: '12.5px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-default)', fontFamily: 'var(--font-body)', letterSpacing: '0.3px' }}>
            © 2026 Newpage Solutions. Confidential — secure connections monitored.
          </footer>
        </div>
      </body>
    </html>
  );
}
