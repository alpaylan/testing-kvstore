import React from 'react'
import { motion } from 'framer-motion'
import { useFragmentEnv } from './FragmentEnv'

export function Paragraph(props: { children: React.ReactNode }): React.ReactElement {
  return <p className="para">{props.children}</p>
}

export function Bullets(props: { items: React.ReactNode[] }): React.ReactElement {
  return (
    <ul className="bullets">
      {props.items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  )
}

export function FragmentBullets(props: { items: Array<{ content: React.ReactNode; appearAtSeconds?: number }> }): React.ReactElement {
  const { videoTime, visibleCount } = useFragmentEnv()
  // Reveal rule: show item when time passed OR if no time specified, show up to visibleCount
  return (
    <ul className="bullets">
      {props.items.map((it, i) => {
        const show = typeof it.appearAtSeconds === 'number' ? videoTime >= (it.appearAtSeconds ?? 0) : i < visibleCount
        return show ? <li key={i}>{it.content}</li> : null
      })}
    </ul>
  )
}

export function Callout(props: { label: string; icon?: string }): React.ReactElement {
  return (
    <div className="callout">
      <span className="icon">{props.icon ?? '💡'}</span>
      <span className="label">{props.label}</span>
    </div>
  )
}

export function TwoCol(props: { left: React.ReactNode; right: React.ReactNode }): React.ReactElement {
  return (
    <div className="two-col">
      <div className="col">{props.left}</div>
      <div className="col">{props.right}</div>
    </div>
  )
}

export function PanZoomBox(props: { children: React.ReactNode }): React.ReactElement {
  return (
    <motion.div
      className="panzoom"
      initial={{ scale: 1, x: 0, y: 0 }}
      animate={{ scale: 1.2, x: 10, y: -8 }}
      transition={{ duration: 4, ease: 'easeInOut' }}
    >
      {props.children}
    </motion.div>
  )
}

export function Typewriter(props: { text: string; speed?: number }): React.ReactElement {
  const [shown, setShown] = React.useState(0)
  const speed = props.speed ?? 28
  React.useEffect(() => {
    setShown(0)
    const id = setInterval(() => {
      setShown(s => Math.min(s + 1, props.text.length))
    }, Math.max(10, 1000 / speed))
    return () => clearInterval(id)
  }, [props.text, speed])
  return <p className="typewriter">{props.text.slice(0, shown)}</p>
}

export function FragmentBoard(props: {
  items: Array<{ content: React.ReactNode; appearAtSeconds?: number }>
}): React.ReactElement {
  const { videoTime, visibleCount } = useFragmentEnv()
  const showItem = (i: number, t?: number) => {
    if (typeof t === 'number') return videoTime >= t
    return i < visibleCount
  }
  return (
    <div className="board">
      {props.items.map((it, i) => (
        showItem(i, it.appearAtSeconds) ? <div key={i} className="tile">{it.content}</div> : null
      ))}
    </div>
  )
}

