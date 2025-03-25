'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full flex justify-center py-10">
      <Link href="/" aria-label="Go to homepage">
        <Image
          src="/MM.jpg"
          alt="MathsMine3 Logo"
          width={160}
          height={160}
          className="rounded-full shadow-2xl hover:scale-105 transition-transform duration-300"
          priority
        />
      </Link>
    </header>
  );
}
