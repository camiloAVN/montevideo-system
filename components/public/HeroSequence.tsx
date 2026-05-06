'use client'

import { useEffect, useRef, useCallback } from 'react'
import NextImage from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

const FRAME_COUNT = 26
const SCROLL_HEIGHT = '300vh'

function frameSrc(i: number) {
  return `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
}

export function HeroSequence() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const imagesRef     = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null))
  const frameIdxRef   = useRef(0)
  const rafRef        = useRef<number | null>(null)

  // Refs for DOM-mutated text elements (avoids React re-renders on every scroll tick)
  const logoRef       = useRef<HTMLDivElement>(null)
  const titleLeftRef  = useRef<HTMLSpanElement>(null)
  const titleRightRef = useRef<HTMLSpanElement>(null)
  const descRef       = useRef<HTMLParagraphElement>(null)
  const ctaRef        = useRef<HTMLDivElement>(null)
  const hintRef       = useRef<HTMLDivElement>(null)

  // ─── draw a frame to canvas (object-fit: cover) ───────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    const img    = imagesRef.current[index]
    if (!canvas || !img?.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cw = canvas.width
    const ch = canvas.height
    const ia = img.naturalWidth / img.naturalHeight
    const ca = cw / ch

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
    if (ia > ca) { sw = sh * ca;           sx = (img.naturalWidth  - sw) / 2 }
    else          { sh = sw / ca;           sy = (img.naturalHeight - sh) / 2 }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
  }, [])

  // ─── resize canvas (DPR-aware, capped at ×2 for perf) ─────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width  = Math.floor(window.innerWidth  * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width  = '100%'
      canvas.style.height = '100%'
      drawFrame(frameIdxRef.current)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame])

  // ─── preload all frames, draw frame 0 as soon as it arrives ───────────────
  useEffect(() => {
    let alive = true

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.onload = () => {
        if (!alive) return
        imagesRef.current[i] = img
        if (i === 0) drawFrame(0)
      }
      img.src = frameSrc(i)
    }

    return () => { alive = false }
  }, [drawFrame])

  // ─── scroll handler: frame scrub + text animation via direct DOM mutation ──
  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current
      if (!container) return

      const { top, height } = container.getBoundingClientRect()
      const scrollableH = height - window.innerHeight
      const scrolled    = -top                                        // px into container
      const clipped     = Math.max(0, Math.min(scrollableH, scrolled))
      const progress    = scrollableH > 0 ? clipped / scrollableH : 0 // 0 → 1

      // Text exits in the first 28 % of one viewport height of scroll
      const textZone = window.innerHeight * 0.28
      const t = Math.max(0, Math.min(1, scrolled / textZone))         // 0 → 1

      // — logo floats up and fades —
      if (logoRef.current) {
        logoRef.current.style.transform = `translateY(${-t * 40}px)`
        logoRef.current.style.opacity   = String(Math.max(0, 1 - t * 1.3))
      }
      // — title halves slide to opposite sides —
      if (titleLeftRef.current) {
        titleLeftRef.current.style.transform = `translateX(${-t * 160}px)`
        titleLeftRef.current.style.opacity   = String(Math.max(0, 1 - t))
      }
      if (titleRightRef.current) {
        titleRightRef.current.style.transform = `translateX(${t * 160}px)`
        titleRightRef.current.style.opacity   = String(Math.max(0, 1 - t))
      }
      // — description fades + drifts down —
      if (descRef.current) {
        descRef.current.style.opacity   = String(Math.max(0, 1 - t * 2.2))
        descRef.current.style.transform = `translateY(${t * 18}px)`
      }
      // — CTA fades faster —
      if (ctaRef.current) {
        const op = Math.max(0, 1 - t * 3.5)
        ctaRef.current.style.opacity      = String(op)
        ctaRef.current.style.pointerEvents = op > 0.05 ? 'auto' : 'none'
      }
      // — scroll hint fades immediately —
      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - t * 4))
      }

      // — frame index —
      const idx = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT))
      if (idx !== frameIdxRef.current) {
        frameIdxRef.current = idx
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => drawFrame(idx))
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [drawFrame])

  return (
    <div ref={containerRef} style={{ height: SCROLL_HEIGHT }} className="relative">

      {/* ── sticky viewport ── */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Canvas – renders the frame sequence */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Overlay for text legibility */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

        {/* ── Hero text ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-none select-none">

          {/* Logo */}
          <div
            ref={logoRef}
            className="mb-6 sm:mb-8"
            style={{ willChange: 'transform, opacity' }}
          >
            <NextImage
              src="/images/logos/Logo_Montevideo_CC_2026_Color_%26_Blanco.png"
              alt="Montevideo Convention Center"
              width={320}
              height={160}
              priority
              className="w-44 sm:w-64 md:w-80 h-auto object-contain mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Title – split so each half slides to its own side */}
          <h1 className="font-bold text-center leading-tight mb-6
                         text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            <span
              ref={titleLeftRef}
              className="inline-block text-white"
              style={{ willChange: 'transform, opacity' }}
            >
              Donde Cada Evento&nbsp;
            </span>
            <span
              ref={titleRightRef}
              className="inline-block text-gradient"
              style={{ willChange: 'transform, opacity' }}
            >
              Cobra Vida
            </span>
          </h1>

          {/* Description */}
          <p
            ref={descRef}
            className="text-sm sm:text-base lg:text-xl text-gray-300
                       max-w-xs sm:max-w-xl lg:max-w-3xl mx-auto mb-10 text-center"
            style={{ willChange: 'transform, opacity' }}
          >
            Centro de eventos con producción audiovisual profesional, shows de primer
            nivel y logística integral. Creamos experiencias únicas que perduran en
            la memoria de cada uno de tus invitados.
          </p>

          {/* CTA buttons */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pointer-events-auto"
            style={{ willChange: 'opacity' }}
          >
            <Link href="/contacto">
              <Button size="lg" variant="primary" className="hover-glow group w-full sm:w-auto">
                Reservar Espacio
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#espacios">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver Espacios
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Scroll hint ── */}
        <div
          ref={hintRef}
          className="absolute bottom-7 left-1/2 -translate-x-1/2
                     flex flex-col items-center gap-1.5 pointer-events-none"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/40">Scroll</span>
          <div className="w-px h-7 bg-gradient-to-b from-white/40 to-transparent animate-bounce" />
        </div>

      </div>
    </div>
  )
}
