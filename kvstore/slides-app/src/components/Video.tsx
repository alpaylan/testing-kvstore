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

// Map all assets under /src/videos to URLs at build/dev time
const videoMap = (import.meta as any).glob('/src/videos/*', { eager: true, as: 'url' }) as Record<string, string>

export function getVideoUrl(file: string): string | undefined {
  const normalized = file.startsWith('/') ? file : `/src/videos/${file}`
  return videoMap[normalized]
}

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
  const candidates = preferredExts
    .map(ext => `/src/videos/${stem}.${ext}`)
    .filter(path => videoMap[path])
    .map(path => ({ url: videoMap[path], type: guessMime(path) }))

  // If the original parameter included an extension that isn't present in candidates, try it explicitly
  if (file.includes('.')) {
    const explicit = file.startsWith('/') ? file : `/src/videos/${file}`
    if (videoMap[explicit] && !candidates.find(c => c.url === videoMap[explicit])) {
      candidates.push({ url: videoMap[explicit], type: guessMime(explicit) })
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

