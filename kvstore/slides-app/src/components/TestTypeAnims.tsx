import React from 'react'
import { motion } from 'framer-motion'

export function FuzzAnim(): React.ReactElement {
  const colors = ['#9ece6a', '#7aa2f7', '#bb9af7', '#f7768e', '#e0af68']
  const bubbles = Array.from({ length: 7 }, (_, i) => i)
  return (
    <div className="anim fuzz">
      <div className="anim-title">Fuzz testing</div>
      <div className="lane">
        {bubbles.map((i) => (
          <motion.div
            key={i}
            className="bubble"
            style={{ background: colors[i % colors.length] }}
            initial={{ x: -20, y: (i % 3) * 10 - 10, opacity: 0 }}
            animate={{ x: 220, opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2.6 + i * 0.1, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <motion.div
          className="crash"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2.2 }}
        >
          💥
        </motion.div>
      </div>
      <div className="legend">random inputs → explore paths → occasional crash</div>
    </div>
  )
}

export function LoadAnim(): React.ReactElement {
  return (
    <div className="anim load">
      <div className="anim-title">Load/Stress testing</div>
      <div className="queue">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="qbar"
            initial={{ height: 10 + i * 8 }}
            animate={{ height: [20, 60, 120, 160, 190, 160, 120, 60, 20] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}
      </div>
      <div className="legend">increasing traffic → queue growth → saturation</div>
    </div>
  )
}

export function ChaosAnim(): React.ReactElement {
  const nodes = [
    { cx: 35, cy: 35 },
    { cx: 115, cy: 25 },
    { cx: 75, cy: 65 },
    { cx: 150, cy: 70 },
    { cx: 40, cy: 90 }
  ]
  const links = [
    [0, 2], [1, 2], [2, 3], [0, 4], [4, 2]
  ]
  return (
    <div className="anim chaos">
      <div className="anim-title">Chaos testing</div>
      <svg viewBox="0 0 180 120" className="net">
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="#ffffff22"
            strokeWidth="2"
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.cx}
            cy={n.cy}
            r="10"
            initial={{ fill: '#9ece6a' }}
            animate={{ fill: ['#9ece6a', '#f7768e', '#9ece6a'] }}
            transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          />
        ))}
      </svg>
      <div className="legend">inject failures → observe recovery behavior</div>
    </div>
  )
}

export function A11yAnim(): React.ReactElement {
  const focusYs = [8, 36, 64, 92]
  return (
    <div className="anim a11y">
      <div className="anim-title">Accessibility testing</div>
      <div className="page">
        <div className="line" style={{ width: 120 }} />
        <div className="line" style={{ width: 160 }} />
        <div className="line" style={{ width: 140 }} />
        <div className="line" style={{ width: 100 }} />
        <motion.div
          className="focus"
          initial={{ y: focusYs[0] }}
          animate={{ y: focusYs }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="legend">keyboard navigation focus order and visibility</div>
    </div>
  )
}


