import { useCallback, useEffect, useRef, useState } from 'react'
import BoutiqueScene from './boutique/BoutiqueScene'
import ScatterShop from './boutique/ScatterShop'
import { getPerfume } from '../data/perfumes'
import { pauseLenis, resumeLenis } from '../lib/lenisStore'

function splitNote(note = '') {
  const words = note.trim().split(/\s+/).filter(Boolean)
  if (words.length < 2) return { left: note, right: '' }
  const mid = Math.ceil(words.length / 2)
  return {
    left: words.slice(0, mid).join(' '),
    right: words.slice(mid).join(' '),
  }
}

export default function PerfumeBoutique() {
  const [selectedId, setSelectedId] = useState(null)
  const [panelId, setPanelId] = useState(null)
  const [panelVisible, setPanelVisible] = useState(false)
  const [scatterOpen, setScatterOpen] = useState(false)
  const closeTimer = useRef(null)
  const sectionRef = useRef(null)

  const panel = panelId ? getPerfume(panelId) : null
  const noteParts = panel ? splitNote(panel.note) : { left: '', right: '' }

  const dismiss = useCallback(() => {
    setPanelVisible(false)
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setSelectedId(null), 320)
  }, [])

  const selectPerfume = useCallback(
    (id) => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
      if (selectedId === id) {
        dismiss()
        return
      }
      setSelectedId(id)
    },
    [dismiss, selectedId],
  )

  useEffect(() => {
    if (scatterOpen) {
      pauseLenis()
      document.body.style.overflow = 'hidden'
    } else {
      resumeLenis()
      document.body.style.overflow = ''
    }
    return () => {
      resumeLenis()
      document.body.style.overflow = ''
    }
  }, [scatterOpen])

  useEffect(() => {
    if (!selectedId || !sectionRef.current) return
    const section = sectionRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) dismiss()
      },
      { threshold: 0 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [selectedId, dismiss])

  useEffect(() => {
    if (!selectedId) {
      setPanelVisible(false)
      const hide = window.setTimeout(() => setPanelId(null), 320)
      return () => window.clearTimeout(hide)
    }
    setPanelId(selectedId)
    setPanelVisible(false)
    const show = window.setTimeout(() => setPanelVisible(true), 400)
    return () => window.clearTimeout(show)
  }, [selectedId])

  useEffect(() => {
    if (!selectedId) return
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, dismiss])

  const openScatter = useCallback(() => {
    setSelectedId(null)
    setScatterOpen(true)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="shop"
      className="relative min-h-[130vh] w-full bg-gradient-to-b from-[#f4f7fa] via-[#eef3f7] to-[#e4ebf2] sm:min-h-[140vh] md:min-h-[150vh]"
    >
      <div className="sticky top-0 h-[100dvh] min-h-[100dvh] w-full overflow-hidden">
        {/* Main Header: Anchored higher up to stay clear of the bottles */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-12 z-20 px-5 text-center transition-opacity duration-500 md:top-16 md:px-8 ${
            selectedId ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <p className="font-body text-xs uppercase tracking-[0.28em] text-muted">
            The boutique
          </p>
          <h2 className="pt-1 font-display text-3xl text-deep md:pt-2 md:text-5xl">
            Step inside the shop
          </h2>
          <p className="mx-auto max-w-md pt-1.5 font-body text-xs text-muted md:pt-2 md:text-sm">
            Click a perfume on the lawn · click the SHOP pole for the full floor
          </p>
        </div>

        {/* 3D Canvas with extra top clearance */}
        <div className="absolute inset-0 z-0">
          <BoutiqueScene
            selectedId={selectedId}
            onSelectPerfume={selectPerfume}
            onClearSelection={dismiss}
            onOpenScatter={openScatter}
          />
        </div>

        {/* Selected Product Detail Card */}
        {panel && (
          <div
            className={`pointer-events-none absolute inset-0 z-30 flex flex-col justify-between px-6 pb-10 pt-12 transition-all duration-500 ease-out sm:px-10 md:pt-16 ${
              panelVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            {/* Header Title */}
            <div
              role="dialog"
              aria-label={panel.name}
              className="mx-auto w-full max-w-2xl shrink-0 text-center"
            >
              <div className="inline-block rounded-2xl bg-white/70 px-6 py-2.5 shadow-sm backdrop-blur-md">
                <p className="font-display text-2xl text-deep sm:text-3xl md:text-4xl">
                  {panel.name}
                </p>
                <p className="mx-auto mt-0.5 font-body text-[11px] uppercase tracking-[0.22em] text-muted">
                  {panel.note.split(/[—–-]/)[0].trim()}
                </p>
              </div>
            </div>

            {/* Side-by-side text columns leaving middle clear */}
            <div className="grid w-full max-w-5xl flex-1 grid-cols-1 items-center gap-4 self-center md:grid-cols-[minmax(220px,1fr)_minmax(280px,360px)_minmax(220px,1fr)]">
              {/* Left Column */}
              <div className="order-2 md:order-1 md:text-right">
                <div className="inline-block max-w-sm rounded-2xl bg-white/70 p-4 text-left shadow-sm backdrop-blur-md md:text-right">
                  <p className="font-body text-xs leading-relaxed text-deep/90 sm:text-sm">
                    {noteParts.left}
                  </p>
                </div>
              </div>

              {/* Middle Clear Gap */}
              <div className="order-1 h-[28vh] w-full pointer-events-none md:order-2 md:h-[50vh]" />

              {/* Right Column */}
              <div className="order-3 md:order-3 md:text-left">
                <div className="inline-block max-w-sm rounded-2xl bg-white/70 p-4 text-left shadow-sm backdrop-blur-md">
                  <p className="font-body text-xs leading-relaxed text-deep/90 sm:text-sm">
                    {noteParts.right}
                  </p>
                  <button
                    type="button"
                    onClick={dismiss}
                    className="pointer-events-auto mt-3 inline-flex items-center rounded-full bg-deep px-3.5 py-1 font-body text-[11px] uppercase tracking-widest text-white transition hover:bg-deep/80"
                  >
                    Put back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {scatterOpen && <ScatterShop onClose={() => setScatterOpen(false)} />}
    </section>
  )
}