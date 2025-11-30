import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const element = document.getElementById('root')
if (!element) {
  throw new Error('Root element #root not found')
}
const root = createRoot(element)
root.render(<App />)

