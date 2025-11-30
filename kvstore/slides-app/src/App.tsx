import React from 'react'
import { SlideDeck } from './components/SlideDeck'
import { slides } from './slidesData'

export default function App(): React.ReactElement {
  return (
    <div className="app">
      <SlideDeck slides={slides} />
    </div>
  )
}

