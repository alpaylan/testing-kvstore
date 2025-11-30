import React from 'react'

type VideoProps = {
  file: string // e.g., 'fuzz.mkv' or 'fuzz' inside /src/videos
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  objectFit?: 'cover' | 'contain'
  onTimeUpdate?: (currentTimeSeconds: number) => void
  onEnded?: () => void
  children?: React.ReactNode // fallback content if file not found or unsupported
}

function ensureTrailingSlash(s: string): string {
  return s.endsWith('/') ? s : `${s}/`
}

// Base URL for serving videos. Default to /videos/, can be overridden via env.
// For Cloudflare Pages + Vite, define VITE_VIDEOS_BASE_URL in project settings when hosting on R2/Stream/CDN.
const VIDEO_BASE_URL = ensureTrailingSlash(import.meta.env.VITE_VIDEOS_BASE_URL ?? '/videos/')

function guessMime(file: string): string | undefined {
  const ext = file.split('.').pop()?.toLowerCase()
  // Intentionally omit type for MKV to allow browser sniffing (improves Chrome behavior)
  if (ext === 'mkv') return undefined
  if (ext === 'mp4') return 'video/mp4'
  if (ext === 'webm') return 'video/webm'
  return undefined
}

function getStem(file: string): string {
  const fname = file.split('/').pop() ?? file
  const parts = fname.split('.')
  if (parts.length <= 1) return fname
  parts.pop()
  return parts.join('.')
}

function getAvailableSources(file: string): Array<{ url: string; type?: string }> {
  // Prefer Safari-friendly formats first
  const preferredExts = ['mp4', 'webm', 'mkv']
  const stem = getStem(file)
  const explicitHasExt = file.includes('.')

  // Construct URLs without pre-validating existence; the browser will try in order.
  const candidates: Array<{ url: string; type?: string }> = preferredExts.map(ext => {
    const path = `${stem}.${ext}`
    const url = `${VIDEO_BASE_URL}${path}`
    return { url, type: guessMime(path) }
  })

  // If an explicit extension was provided, prefer it first by unshifting
  if (explicitHasExt) {
    const explicitPath = file
    const explicitUrl = `${VIDEO_BASE_URL}${explicitPath}`
    const explicitType = guessMime(explicitPath)
    // Put the explicit candidate at the front if not already first
    if (!candidates.find(c => c.url === explicitUrl)) {
      candidates.unshift({ url: explicitUrl, type: explicitType })
    }
  }
  return candidates
}

export function Video(props: VideoProps): React.ReactElement {
  const {
    file,
    autoplay = true,
    loop = true,
    muted = true,
    controls = false,
    objectFit = 'cover',
    onTimeUpdate,
    onEnded,
    children
  } = props
  const sources = getAvailableSources(file)

  if (!sources.length) {
    return (
      <div className="video-card">
        <div className="video-fallback">
          <div className="video-meta">
            <span className="video-file">{file}</span>
          </div>
          <div className="video-missing">No matching file in /src/videos</div>
          {children ? <div className="video-alt">{children}</div> : null}
        </div>
      </div>
    )
  }

  return (
    <div className="video-card">
      <video
        className="video-el"
        style={{ objectFit }}
        {...(autoplay ? { autoPlay: true } : {})}
        {...(loop ? { loop: true } : {})}
        {...(muted ? { muted: true } : {})}
        {...(controls ? { controls: true } : {})}
        playsInline
        preload="metadata"
        onTimeUpdate={(e) => {
          const el = e.currentTarget as HTMLVideoElement
          if (onTimeUpdate) onTimeUpdate(el.currentTime)
        }}
        onEnded={() => {
          if (onEnded) onEnded()
        }}
      >
        {sources.map((s, i) => (
          <source key={i} src={s.url} {...(s.type ? { type: s.type } : {})} />
        ))}
      </video>
    </div>
  )
}

