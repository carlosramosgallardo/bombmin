'use client';

import { useEffect } from 'react';
import Link from 'next/link';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
      // Carga el script de Google Analytics
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
      `;
      document.head.appendChild(script2);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Welcome to MathsMine3
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-2xl">
        Master Math, Mine MM3, and Shape the Future with Proof of Vote and Ask.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/learn-math" className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition">
          Start Mining
        </Link>
        <Link href="/pov" className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition">
          Proof of Vote
        </Link>
        <Link href="/poa" className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition">
          Proof of Ask
        </Link>
        <Link href="/manifesto" className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition">
          Manifesto
        </Link>
        <Link href="/api" className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition">
          API Docs
        </Link>
      </div>
    </div>
  );
}
