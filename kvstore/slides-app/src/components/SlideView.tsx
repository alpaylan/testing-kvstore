import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Slide } from './SlideDeck'
import { Video } from './Video'
import { FragmentEnvProvider } from './FragmentEnv'

type SlideViewProps = {
  slide: Slide
  visibleCount: number
  onVideoEnded?: () => void
}

export function SlideView(props: SlideViewProps): React.ReactElement {
  const { slide, visibleCount, onVideoEnded } = props
  const hasVideo = Boolean(slide.video)
  const hasFragments = slide.fragments.length > 0
  const showTwoCol = hasVideo && hasFragments
  const [videoTime, setVideoTime] = React.useState(0)
  const anyTimed = slide.fragments.some(f => typeof f.appearAtSeconds === 'number')
  React.useEffect(() => {
    setVideoTime(0)
  }, [slide.id, slide.video])
  const visibleFragments = anyTimed && hasVideo
    ? slide.fragments.filter((fragment, idx) => {
        if (typeof fragment.appearAtSeconds === 'number') {
          return videoTime >= (fragment.appearAtSeconds ?? 0)
        }
        return idx < visibleCount
      })
    : slide.fragments.slice(0, visibleCount)
  return (
    <div className={`slide`}>
      <div className="content">
        <FragmentEnvProvider value={{ videoTime, visibleCount }}>
        {hasVideo && !hasFragments ? (
          <div className="fragment" style={{ height: '100%' }}>
            <Video
              key={`video-${slide.id}-${slide.video}`}
              file={slide.video!}
              onTimeUpdate={setVideoTime}
              onEnded={onVideoEnded}
              controls={true}
              loop={false}
            />
          </div>
        ) : null}
        {showTwoCol ? (
          <div className="two-col">
            <div className="col">
              <div className="fragment" style={{ height: '100%' }}>
                <Video
                  key={`video-${slide.id}-${slide.video}`}
                  file={slide.video!}
                  onTimeUpdate={setVideoTime}
                  onEnded={onVideoEnded}
                  controls={true}
                  loop={false}
                />
              </div>
            </div>
            <div className="col">
              <AnimatePresence mode="popLayout">
                {visibleFragments.map(fragment => (
                  <motion.div
                    key={fragment.id}
                    className="fragment"
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.995 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    {fragment.element}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : null}
        {!hasVideo && hasFragments ? (
          <AnimatePresence mode="popLayout">
            {visibleFragments.map(fragment => (
              <motion.div
                key={fragment.id}
                className="fragment"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.995 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {fragment.element}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : null}
        </FragmentEnvProvider>
      </div>
    </div>
  )
}

