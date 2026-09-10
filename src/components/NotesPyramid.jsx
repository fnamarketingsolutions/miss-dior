import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import layer1 from '../assets/layer-1.png'
import layer2 from '../assets/layer-2.png'

gsap.registerPlugin(ScrollTrigger)

const notes = [
  {
    tier: 'Top',
    title: 'Bergamot & Mandarin',
    desc: 'A luminous sparkle that lifts the first impression.',
  },
  {
    tier: 'Heart',
    title: 'Damask Rose & Peony',
    desc: 'The signature bouquet — soft, romantic, unmistakably Miss Dior.',
  },
  {
    tier: 'Base',
    title: 'White Musk & Woods',
    desc: 'A creamy trail that stays close, warm, and intimate.',
  },
]

const layerImages = [
  { src: layer1, alt: 'Miss Dior fragrance base — luminous dropper detail' },
  { src: layer2, alt: 'Miss Dior fragrance base — gold collar detail' },
]

export default function NotesPyramid() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })

      tl.from('.notes-copy > *', {
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
      }).from(
        '.notes-line',
        {
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.35',
      )

      tl.from(
        '.notes-image',
        {
          x: 110,
          opacity: 0,
          duration: 1.05,
          stagger: 0.18,
          ease: 'power3.out',
        },
        '-=0.75',
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="notes"
      className="relative overflow-hidden bg-gradient-to-b from-light-pink/80 via-baby-pink/30 to-white py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute left-1/4 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-baby-pink/35 blur-3xl md:h-96 md:w-96"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:gap-14 md:px-8 lg:gap-20">
        <div className="notes-copy">
          <p className="font-body text-xs uppercase tracking-[0.35em] text-soft-rose">
            Fragrance layers
          </p>
          <h2 className="mt-4 font-display text-4xl text-deep md:text-5xl">
            Layer by layer, a love letter
          </h2>
          <p className="mt-5 max-w-md font-body text-base font-light leading-relaxed text-muted md:text-lg">
            From the first citrus spark to a soft trail of musk and woods — each
            note unfolds like a line written only for her.
          </p>

          <div className="mt-10 space-y-7 border-t border-soft-rose/30 pt-8">
            {notes.map((note) => (
              <div key={note.tier} className="notes-line">
                <p className="font-body text-xs uppercase tracking-[0.3em] text-soft-rose">
                  {note.tier}
                </p>
                <h3 className="mt-1.5 font-display text-2xl text-deep md:text-[1.65rem]">
                  {note.title}
                </h3>
                <p className="mt-2 max-w-sm font-body text-sm font-light leading-relaxed text-muted md:text-base">
                  {note.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col gap-4 md:gap-5">
          {layerImages.map((image, i) => (
            <div
              key={image.src}
              className={`notes-image overflow-hidden ${
                i === 1 ? 'md:ml-8 lg:ml-12' : 'md:mr-8 lg:mr-12'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-48 w-full object-cover md:h-56 lg:h-64"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
