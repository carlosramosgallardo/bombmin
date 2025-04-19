'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks({ className = '' }) {
  const pathname = usePathname()

  const linkClass = (href) =>
    `underline hover:text-white ${
      pathname === href ? 'text-white font-semibold' : ''
    }`

  return (
    <div className={`flex flex-wrap justify-center text-base text-gray-400 space-x-3 ${className}`}>
      <Link href="/" className={linkClass('/')}>MM3</Link>
      <Link href="/learn-math" className={linkClass('/learn-math')}>Learn Math</Link>
      <Link href="/pov" className={linkClass('/pov')}>Proof of Vote</Link>
      <Link href="/poa" className={linkClass('/poa')}>Proof of Ask</Link>
      <Link href="/api" className={linkClass('/api')}>API</Link>
      <Link href="/manifesto" className={linkClass('/manifesto')}>Manifesto</Link>
      <Link href="/manifesto" className={linkClass('/playlist')}>Playlist</Link>
    </div>
  )
}
