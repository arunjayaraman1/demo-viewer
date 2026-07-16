import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Newpage Solutions | Showcase',
  description: 'Deliver breakthroughs. Confidential client presentation walkthroughs and pitch decks.',
  icons: {
    icon: '/newpage_digital_health_logo.jpeg',
  },
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
                <svg className="np-icon" width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.6667 0H21.3333H32L21.3333 10.6667H10.6667H0L10.6667 0Z" fill="#08BDB8"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M21.3281 10.6667V21.3333V32L31.9948 21.3333V10.6667V0L21.3281 10.6667Z" fill="#FFCF36"/>
                  <path d="M21.3281 0V10.6667L31.9948 0H21.3281Z" fill="#008C85"/>
                  <path d="M21.3281 10.6667H31.9948V0L21.3281 10.6667Z" fill="#FF7F1F"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '17px', letterSpacing: '-0.3px', color: '#fff' }}>
                  Newpage <span style={{ color: 'var(--np-teal-soft)', fontWeight: 500 }}>Showcase</span>
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
