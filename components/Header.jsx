'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full flex justify-center py-6">
      <Link href="/" aria-label="Go to homepage">
        <Image
          src="/MM.jpg"
          alt="MathsMine3 Logo"
          width={100}
          height={100}
          className="rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          priority
        />
      </Link>
    </header>
  );
}
22