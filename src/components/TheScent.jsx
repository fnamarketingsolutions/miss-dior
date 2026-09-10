import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TheScent() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.scent-reveal', {
        y: 48,
        opacity: 0,
        duration: 1,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="the-scent"
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <p className="scent-reveal font-body text-xs uppercase tracking-[0.35em] text-soft-rose">
          The Scent
        </p>
        <h2 className="scent-reveal mt-4 font-display text-4xl text-deep md:text-5xl lg:text-6xl">
          Born from a thousand roses
        </h2>
        <p className="scent-reveal mt-6 font-body text-base font-light leading-relaxed text-muted md:text-lg">
          Miss Dior is a floral ode — bright, tender, and endlessly feminine.
          It opens with sparkling citrus light, blooms into a heart of damask
          rose and peony, then settles into a soft, powdered trail of white
          musk and warm woods.
        </p>
        <p className="scent-reveal mt-5 font-display text-xl italic text-deep md:text-2xl">
          “Wear it like a second skin — and let the day follow.”
        </p>
      </div>
    </section>
  )
}
