import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Contact() {
  const formRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
    })
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-svh bg-gradient-to-b from-light-pink/70 via-white to-baby-pink/30 pt-28 pb-20">
        <div
          ref={formRef}
          className="mx-auto max-w-xl px-5 md:px-8"
        >
          <p className="font-body text-xs uppercase tracking-[0.35em] text-soft-rose">
            Contact
          </p>
          <h1 className="mt-4 font-display text-4xl text-deep md:text-5xl">
            We’d love to hear from you
          </h1>
          <p className="mt-4 font-body text-base font-light text-muted">
            Ask about Miss Dior, boutique availability, or a personal scent
            consultation.
          </p>

          {submitted ? (
            <div className="mt-12 border border-baby-pink bg-white/80 px-8 py-12 text-center">
              <p className="font-display text-3xl text-deep">Thank you</p>
              <p className="mt-3 font-body text-muted">
                Your message has been received. We’ll be in touch soon.
              </p>
              <Link
                to="/"
                className="mt-8 inline-flex rounded-full bg-deep px-7 py-3 font-body text-sm text-white transition hover:bg-soft-rose"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block font-body text-sm text-deep"
                >
                  Name
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full border border-baby-pink/80 bg-white/90 px-4 py-3 font-body text-deep outline-none transition focus:border-soft-rose"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-body text-sm text-deep"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full border border-baby-pink/80 bg-white/90 px-4 py-3 font-body text-deep outline-none transition focus:border-soft-rose"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block font-body text-sm text-deep"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  className="w-full resize-y border border-baby-pink/80 bg-white/90 px-4 py-3 font-body text-deep outline-none transition focus:border-soft-rose"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-deep px-8 py-3.5 font-body text-sm tracking-wide text-white transition hover:bg-soft-rose"
              >
                Send message
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
