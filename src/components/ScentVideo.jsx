import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import videoSrc from '../assets/miss-dior-video.mp4'

gsap.registerPlugin(ScrollTrigger)

export default function ScentVideo() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const ctx = gsap.context(() => {
      gsap.set(video, { opacity: 0, scale: 1.04 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          video.play().catch(() => {})
        },
        onEnterBack: () => {
          video.play().catch(() => {})
        },
        onLeave: () => {
          video.pause()
        },
        onLeaveBack: () => {
          video.pause()
        },
      })

      gsap.to(video, {
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          toggleActions: 'play none none none',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="scent-video"
      className="relative min-h-svh overflow-hidden bg-deep"
      aria-label="NIVA film"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        loop
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />
    </section>
  )
}
