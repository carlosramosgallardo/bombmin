import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'MathsMine3',
  description: 'The fake Web3 platform where mining means solving math challenges and people around the world propose and vote on ideas freely, openly, and transparently.',
  metadataBase: new URL('https://mathsmine3.xyz'),
  openGraph: {
    title: 'MathsMine3',
    description: 'The fake Web3 platform where mining means solving math challenges and people around the world propose and vote on ideas freely, openly, and transparently.',
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
    description: 'The fake Web3 platform where mining means solving math challenges and people around the world propose and vote on ideas freely, openly, and transparently.',
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
