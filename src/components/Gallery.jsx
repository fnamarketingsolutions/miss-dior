import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import g1 from '../assets/gallery-1.png'
import g2 from '../assets/gallery-2.png'
import g3 from '../assets/gallery-3.png'

gsap.registerPlugin(ScrollTrigger)

const images = [
  { src: g1, alt: 'Soft rose petals and pink atmosphere' },
  { src: g2, alt: 'Silk and blush vanity still life' },
  { src: g3, alt: 'Ethereal floral mist' },
]

export default function Gallery() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.gallery-frame').forEach((frame, i) => {
        const img = frame.querySelector('img')
        gsap.fromTo(
          img,
          { yPercent: i % 2 === 0 ? -12 : 12, scale: 1.12 },
          {
            yPercent: i % 2 === 0 ? 12 : -12,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: frame,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      gsap.from('.gallery-title', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="overflow-hidden bg-gradient-to-b from-white via-light-pink/50 to-baby-pink/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="gallery-title mb-14 text-center">
          <p className="font-body text-xs uppercase tracking-[0.35em] text-soft-rose">
            Gallery
          </p>
          <h2 className="mt-4 font-display text-4xl text-deep md:text-5xl">
            A world in soft pink
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-5">
          {images.map((img) => (
            <div
              key={img.alt}
              className="gallery-frame relative aspect-[3/4] overflow-hidden md:aspect-[3/4]"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 h-full w-full object-cover will-change-transform"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
