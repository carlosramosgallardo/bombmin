import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WagmiProvider } from 'wagmi'; // Asegúrate de importar WagmiProvider
import { createConfig } from 'wagmi'; // Importa la configuración que usas

const wagmiConfig = createConfig({
  chains: [], // Asegúrate de añadir las chains configuradas previamente
  // cualquier otra configuración que hayas definido
});

export const metadata = {
  title: 'MathsMine3',
  description: 'Solve fast to mine! A fake Web3 mining game where your speed changes everything.',
  metadataBase: new URL('https://mathsmine3.xyz'),
  openGraph: {
    title: 'MathsMine3',
    description: 'Solve fast to mine! A fake Web3 mining game where your speed changes everything.',
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
    description: 'Solve fast to mine! A fake Web3 mining game where your speed changes everything.',
    images: ['/MM.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-mono">
        <WagmiProvider config={wagmiConfig}> {/* Envuelve tu contenido con WagmiProvider */}
          <Header />
          {children}
          <Footer />
        </WagmiProvider>
      </body>
    </html>
  );
}
