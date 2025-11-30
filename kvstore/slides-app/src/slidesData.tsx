import React from 'react'
import type { Slide, Fragment } from './components/SlideDeck'
import { Bullets, Callout, Paragraph, PanZoomBox, TwoCol, Typewriter, FragmentBullets, FragmentBoard } from './components/Blocks'
import { Pyramid } from './components/Pyramid'
import { FuzzAnim, LoadAnim, ChaosAnim, A11yAnim } from './components/TestTypeAnims'

let fragmentId = 0
const f = (element: React.ReactNode, opts?: Partial<Fragment>) => ({ id: `f-${fragmentId++}`, element, ...(opts ?? {}) })

export const slides: Slide[] = [
  {
    id: 's1',
    title: 'Introduction to Property-Based Testing',
    transition: 'fade',
    video: 'Slide-1',
    fragments: []
  },
  {
    id: 's2',
    title: 'Understanding Software Testing',
    video: 'Slide-2',
    fragments: [
      f(<Paragraph>Before talking about what PBT is, why it’s important, and how to use it, we’ll map the space of software testing.</Paragraph>),
      f(<FragmentBullets items={[
        { content: <>Qualities of tests</>, appearAtSeconds: 1.0 },
        { content: <>How PBT fits in</>, appearAtSeconds: 2.0 },
        { content: <>Where different methods live</>, appearAtSeconds: 3.0 }
      ]} />)
    ]
  },
  {
    id: 's3',
    title: 'Test Pyramid',
    video: 'Slide-3',
    fragments: [
      f(<Pyramid />, { appearAtSeconds: 3 }),
    ]
  },
  {
    id: 's4',
    title: 'Types of Tests',
    video: 'Slide-4',
    fragments: [
      f(<Paragraph>
        Many test types cut across the pyramid. Pyramid is about scope, not method/purpose.
        </Paragraph>, { appearAtSeconds: 7.0 }),
      f(<FragmentBoard items={[
        { content: <FuzzAnim />, appearAtSeconds: 14.5 },
        { content: <LoadAnim />, appearAtSeconds: 27 },
        { content: <ChaosAnim />, appearAtSeconds: 47 },
        { content: <A11yAnim />, appearAtSeconds: 69 }
      ]} />, { appearAtSeconds: 14.0 }),
    ]
  },
  {
    id: 's5',
    title: 'Qualities of Software Tests — Scope',
    video: 'Slide-5',
    fragments: [
      f(<Paragraph>The scope defines the input space in consideration — the answer to “what do you test?”</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>Pure stateless function → inputs only (e.g., days of the week)</>, appearAtSeconds: 5 },
        { content: <>Interface/module → possible interactions over internal state (e.g., queue)</>, appearAtSeconds: 9 },
        { content: <>External system → input language (JSON/SQL/C) with well/ill-formed cases</>, appearAtSeconds: 13 }
      ]} />, { appearAtSeconds: 5 }),
      f(<Paragraph>For invalid inputs, valid errors become an additional concern beyond behavior on valid inputs.</Paragraph>, { appearAtSeconds: 18 }),
      f(<Typewriter text="Scope grows from values → interactions → languages" speed={28} />, { appearAtSeconds: 22 })
    ]
  }
]

