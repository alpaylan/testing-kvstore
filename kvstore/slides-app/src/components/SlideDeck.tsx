import React from 'react'
import { SlideView } from './SlideView'

export type Fragment = {
  id: string
  element: React.ReactNode
  appearAtSeconds?: number
}

export type Slide = {
  id: string
  title?: string
  layout?: 'default' | 'two-col' | 'title-only'
  background?: 'light' | 'dark'
  transition?: 'fade' | 'slide' | 'zoom'
  video?: string
  fragments: Fragment[]
}

type SlideDeckProps = {
  slides: Slide[]
}

export function SlideDeck(props: SlideDeckProps): React.ReactElement {
  const { slides } = props
  const [slideIndex, setSlideIndex] = React.useState(0)
  const [stepIndex, setStepIndex] = React.useState(0)
  const [videoEnded, setVideoEnded] = React.useState(true)
  const [watchedMap, setWatchedMap] = React.useState<Record<string, boolean>>({})

  const totalSlides = slides.length
  const currentSlide = slides[slideIndex]
  const maxSteps = currentSlide.fragments.length
  const hasVideo = Boolean(currentSlide.video)

  const canAdvance = stepIndex < maxSteps
  const canRetreat = stepIndex > 0 || slideIndex > 0
  const slideWatched = watchedMap[currentSlide.id] === true

  React.useEffect(() => {
    const key = `slides_watched_${currentSlide.id}`
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
    const watched = stored === '1'
    setWatchedMap(prev => ({ ...prev, [currentSlide.id]: watched }))
    setVideoEnded(!hasVideo || watched)
  }, [slideIndex, hasVideo, currentSlide.id])

  const goStepNext = React.useCallback(() => {
    if (stepIndex < maxSteps) {
      setStepIndex(stepIndex + 1)
    }
  }, [stepIndex, maxSteps])

  const goPrev = React.useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
    } else if (slideIndex > 0) {
      const prevSlide = slides[slideIndex - 1]
      setSlideIndex(slideIndex - 1)
      setStepIndex(prevSlide.fragments.length)
    }
  }, [stepIndex, slideIndex, slides])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goStepNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'PageDown' || e.key === 'Enter') {
        e.preventDefault()
        if (slideIndex < totalSlides - 1) {
          setSlideIndex(slideIndex + 1)
          setStepIndex(0)
        }
      } else if (e.key === 'PageUp') {
        e.preventDefault()
        if (slideIndex > 0) {
          const prevSlide = slides[slideIndex - 1]
          setSlideIndex(slideIndex - 1)
          setStepIndex(prevSlide.fragments.length)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goStepNext, goPrev, hasVideo, videoEnded, slideWatched, slideIndex, totalSlides, slides])

  const progress = (slideIndex + stepIndex / Math.max(1, maxSteps)) / totalSlides

  return (
    <div className={`deck ${currentSlide.background ?? 'light'}`}>
      <div className="toolbar">
        <div className="title">{currentSlide.title ?? ' '}</div>
        <div className="spacer" />
        <div className="controls">
          <button onClick={goPrev} disabled={!canRetreat} aria-label="Previous step">◀</button>
          <button onClick={goStepNext} disabled={!canAdvance} aria-label="Next step">▶</button>
          <span style={{ width: 8 }} />
          <button
            onClick={() => {
              if (slideIndex > 0) {
                const prevSlide = slides[slideIndex - 1]
                setSlideIndex(slideIndex - 1)
                setStepIndex(prevSlide.fragments.length)
              }
            }}
            disabled={slideIndex <= 0}
            aria-label="Previous slide"
            title="Previous slide (PageUp)"
          >« Slide</button>
          <button
            onClick={() => {
              if (slideIndex < totalSlides - 1) {
                setSlideIndex(slideIndex + 1)
                setStepIndex(0)
              }
            }}
            disabled={slideIndex >= totalSlides - 1}
            aria-label="Next slide"
            title="Next slide (Enter/PageDown)"
          >Slide »</button>
        </div>
      </div>
      <SlideView
        slide={currentSlide}
        visibleCount={stepIndex}
        onVideoEnded={() => {
          setVideoEnded(true)
          try {
            window.localStorage.setItem(`slides_watched_${currentSlide.id}`, '1')
            setWatchedMap(prev => ({ ...prev, [currentSlide.id]: true }))
          } catch {}
        }}
      />
      <div className="progress">
        <div className="bar" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      <div className="footer">
        <div>PBT Slides</div>
        <div>{slideIndex + 1} / {totalSlides}</div>
      </div>
    </div>
  )
}

