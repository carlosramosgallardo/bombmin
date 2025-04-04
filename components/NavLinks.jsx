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
    <div className={`text-base text-gray-400 space-x-3 ${className}`}>
      <Link href="/" className={linkClass('/')}>Home</Link>
      <Link href="/theory" className={linkClass('/theory')}>Theory</Link>
      <Link href="/manifesto" className={linkClass('/manifesto')}>Manifesto</Link>
      <Link href="/pov" className={linkClass('/pov')}>PoV</Link>
      <Link href="/poa" className={linkClass('/poa')}>PoA</Link>
      <Link href="/api" className={linkClass('/api')}>API</Link>
      <Link href="/legal" className={linkClass('/legal')}>Legal</Link>
    </div>
  )
}
