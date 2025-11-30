import React from 'react'
import { motion } from 'framer-motion'

type LayerSpec = {
  y1: number
  y2: number
  label: string
  fill: string
}

const apex = { x: 200, y: 30 }
const leftBase = { x: 60, y: 270 }
const rightBase = { x: 340, y: 270 }

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function edgeX(y: number, side: 'left' | 'right'): number {
  const t = (y - apex.y) / (leftBase.y - apex.y)
  if (side === 'left') return lerp(apex.x, leftBase.x, t)
  return lerp(apex.x, rightBase.x, t)
}

function trapezoidPoints(y1: number, y2: number): string {
  const l2 = edgeX(y2, 'left')
  const r2 = edgeX(y2, 'right')
  const r1 = edgeX(y1, 'right')
  const l1 = edgeX(y1, 'left')
  return `${l2},${y2} ${r2},${y2} ${r1},${y1} ${l1},${y1}`
}

export function Pyramid(): React.ReactElement {
  const layers: LayerSpec[] = [
    { y1: 30,  y2: 110, label: 'Unit',        fill: 'url(#gradTop)' },
    { y1: 110, y2: 190, label: 'Integration', fill: 'url(#gradMid)' },
    { y1: 190, y2: 270, label: 'E2E',         fill: 'url(#gradBot)' }
  ]

  return (
    <div className="pyramid2-container">
      <svg className="pyramid2-svg" viewBox="0 0 400 300" role="img" aria-label="Test Pyramid">
        <defs>
          <linearGradient id="gradTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7aa2f7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7aa2f7" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="gradMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7aa2f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7aa2f7" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="gradBot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7aa2f7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#7aa2f7" stopOpacity="0.25" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Background triangle outline */}
        <path
          d={`M ${apex.x} ${apex.y} L ${leftBase.x} ${leftBase.y} L ${rightBase.x} ${rightBase.y} Z`}
          fill="none"
          stroke="#ffffff18"
          strokeWidth="2"
        />

        {/* Layers */}
        {layers.map((layer, idx) => (
          <motion.g
            key={layer.label}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            filter="url(#softShadow)"
          >
            <polygon
              points={trapezoidPoints(layer.y1, layer.y2)}
              fill={layer.fill}
              stroke="#ffffff25"
              strokeWidth="1.5"
            />
            <text
              x={200}
              y={(layer.y1 + layer.y2) / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#e9e9ee"
              style={{ fontWeight: 600 }}
            >
              {layer.label}
            </text>
          </motion.g>
        ))}

        {/* Side arrow indicating increases */}
        <motion.g
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <line x1="360" y1="270" x2="360" y2="60" stroke="#9ece6a" strokeWidth="3" strokeDasharray="8 6" />
          <polygon points="360,48 352,64 368,64" fill="#9ece6a" />
          <text x="366" y="76" fill="#9ece6a" style={{ fontSize: 12, fontWeight: 600 }} transform="rotate(-90 366,76)">
            scope ↑
          </text>
        </motion.g>

        {/* Icons along the arrow */}
        <motion.text
          x="368"
          y="210"
          aria-label="Cost increases"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >💲</motion.text>
        <motion.text
          x="368"
          y="170"
          aria-label="Complexity increases"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >🧩</motion.text>
        <motion.text
          x="368"
          y="130"
          aria-label="Time to run increases"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >⏱️</motion.text>
      </svg>
    </div>
  )
}

