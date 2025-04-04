import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'MathsMine3',
  description: 'Mine fake MM3 for free, learn math as you play, and use your voice to shape the community and the world through votes and polls.',
  metadataBase: new URL('https://mathsmine3.xyz'),
  openGraph: {
    title: 'MathsMine3',
    description: 'Mine fake MM3 for free, learn math as you play, and use your voice to shape the community and the world through votes and polls.',
    url: 'https://mathsmine3.xyz',
    siteName: 'MathsMine3',
    images: [
      {
        url: '/MM.jpg',
        width: 800,
        height: 600,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@FreakingAI',
    title: 'MathsMine3',
    description: 'Mine fake MM3 for free, learn math as you play, and use your voice to shape the community and the world through votes and polls.',
    images: ['/MM.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-mono">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
