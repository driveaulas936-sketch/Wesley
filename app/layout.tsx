import type { Metadata } from 'next';
import { Manrope, Geist_Mono, Sora } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'] });
const sora = Sora({ variable: '--font-sora', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wesley Rodrigues | Estratégias de Low Ticket',
  description: 'Conheça a trajetória e o método utilizado por Wesley Rodrigues no mercado de produtos digitais low ticket.',
  applicationName: 'Wesley Rodrigues',
  authors: [{ name: 'Wesley Rodrigues' }],
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: 'Wesley Rodrigues | Estratégias de Low Ticket',
    description: 'Da portaria a mais de R$ 1 milhão faturado no digital. Conheça a trajetória e a estrutura de low ticket utilizada por Wesley Rodrigues.',
    images: [{ url: '/og.png', width: 1733, height: 908, alt: 'Wesley Rodrigues — Estratégias de Low Ticket' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wesley Rodrigues | Estratégias de Low Ticket',
    description: 'Conheça a trajetória e a estrutura de low ticket utilizada por Wesley Rodrigues.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className="dark"><body className={`${manrope.variable} ${sora.variable} ${geistMono.variable} antialiased`}>{children}</body></html>;
}
