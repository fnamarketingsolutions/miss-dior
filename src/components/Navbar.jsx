import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { getLenis } from '../lib/lenisStore'

const links = [
  { href: '/#the-scent', label: 'The Scent' },
  { href: '/#shop', label: 'Shop' },
  { href: '/#ritual', label: 'Ritual' },
  { href: '/#gallery', label: 'Gallery' },
]

export default function Navbar() {
  const navRef = useRef(null)
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -24,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.15,
      })
    })
    return () => ctx.revert()
  }, [])

  const handleAnchor = (e, href) => {
    setOpen(false)
    if (!href.startsWith('/#')) return
    if (location.pathname !== '/') return
    e.preventDefault()
    const id = href.slice(2)
    const el = document.getElementById(id)
    const lenis = getLenis()
    if (el) {
      if (lenis) lenis.scrollTo(el, { offset: -80 })
      else el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-baby-pink/40 bg-white/70 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link
          to="/"
          className="font-display text-2xl tracking-[0.18em] text-deep md:text-3xl"
          onClick={() => setOpen(false)}
        >
          MISS DIOR
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={(e) => handleAnchor(e, link.href)}
              className="font-body text-sm tracking-wide text-muted transition hover:text-deep"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="rounded-full bg-soft-rose px-5 py-2 font-body text-sm tracking-wide text-white transition hover:bg-deep"
          >
            Contact
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-deep" />
          <span className="block h-0.5 w-6 bg-deep" />
          <span className="block h-0.5 w-6 bg-deep" />
        </button>
      </div>

      {open && (
        <div className="border-t border-baby-pink/40 bg-white px-5 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => handleAnchor(e, link.href)}
                className="font-body text-base text-deep"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-fit rounded-full bg-soft-rose px-5 py-2 font-body text-sm text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
