import React from 'react'
import type { Slide, Fragment } from './components/SlideDeck'
import { Bullets, Callout, Paragraph, PanZoomBox, TwoCol, Typewriter, FragmentBullets, FragmentBoard } from './components/Blocks'
import { Pyramid } from './components/Pyramid'
import { FuzzAnim, LoadAnim, ChaosAnim, A11yAnim, IOAnim, PerfAnim, SecurityAnim, ResilienceAnim } from './components/TestTypeAnims'

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
  ,
  {
    id: 's6',
    title: 'Qualities of a Software Test — Purpose',
    video: 'Slide-6',
    fragments: [
      f(<Paragraph>The second quality of a software test is its purpose. The purpose of a test is what it measures.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>Functional correctness — expected output for input</>, appearAtSeconds: 6 },
        { content: <>Performance — finish task under time constraints</>, appearAtSeconds: 16 },
        { content: <>Security — no secret data leaks</>, appearAtSeconds: 26 },
        { content: <>Resilience — doesn’t break under large input sets</>, appearAtSeconds: 36 },
      ]} />, { appearAtSeconds: 6 }),
      f(<FragmentBoard items={[
        { content: <IOAnim />, appearAtSeconds: 8 },
        { content: <PerfAnim />, appearAtSeconds: 18 },
        { content: <SecurityAnim />, appearAtSeconds: 28 },
        { content: <ResilienceAnim />, appearAtSeconds: 38 },
      ]} />, { appearAtSeconds: 8 })
    ]
  },
  {
    id: 's7',
    title: 'Qualities of a Software Test — Specification',
    video: 'Slide-7',
    fragments: [
      f(<Paragraph>The third quality of a software test is its specification.</Paragraph>, { appearAtSeconds: 1.5 }),
      f(<Paragraph>Once we have a purpose, we need to decide how to measure it. Some purposes fit some specifications more than others.</Paragraph>, { appearAtSeconds: 5 }),
      f(<Paragraph>The simplest measurement is manual review. You run the code and personally verify whether the result conforms to your intent.</Paragraph>, { appearAtSeconds: 10 }),
    ]
  },
  {
    id: 's8',
    title: 'Specification — I/O Examples',
    video: 'Slide-8',
    fragments: [
      f(<Paragraph>Input-output specifications are the most popular codified mechanism: write tests in the form y = f(x).</Paragraph>, { appearAtSeconds: 1 }),
      f(<FragmentBullets items={[
        { content: <>Equality: y = f(x)</>, appearAtSeconds: 4 },
        { content: <>Relations: y ∈ f(x)</>, appearAtSeconds: 8 },
        { content: <>Non-functional: t(f(x)) {'<'} t(f(y))</>, appearAtSeconds: 12 },
        { content: <>Security checks: known exploits don’t leak data</>, appearAtSeconds: 16 },
      ]} />, { appearAtSeconds: 4 }),
      f(<IOAnim />, { appearAtSeconds: 6 }),
      f(<PerfAnim />, { appearAtSeconds: 14 }),
      f(<SecurityAnim />, { appearAtSeconds: 18 }),
    ]
  },
  {
    id: 's9',
    title: 'Specification — Properties',
    video: 'Slide-9',
    fragments: [
      f(<Paragraph>A property is a statement expected to hold for any input.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>abs(x) ≥ 0</>, appearAtSeconds: 6 },
        { content: <>pow(x+1, N) = pow(x, N) * x</>, appearAtSeconds: 9 },
        { content: <>Linear traversal of longer list takes longer</>, appearAtSeconds: 12 },
      ]} />, { appearAtSeconds: 6 }),
      f(<Typewriter text="Properties capture general truths beyond specific examples." />, { appearAtSeconds: 16 })
    ]
  },
  {
    id: 's10',
    title: 'Qualities of a Software Test — Method',
    video: 'Slide-10',
    fragments: [
      f(<Paragraph>The specification is not necessarily coupled with the method of providing inputs.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>Manual construction of inputs</>, appearAtSeconds: 6 },
        { content: <>Systematic enumeration</>, appearAtSeconds: 10 },
        { content: <>Random sampling</>, appearAtSeconds: 14 },
        { content: <>Symbolic execution / Model checking</>, appearAtSeconds: 18 },
        { content: <>Hybrid approaches</>, appearAtSeconds: 22 },
      ]} />, { appearAtSeconds: 6 }),
    ]
  },
  {
    id: 's11',
    title: 'What is Property-Based Testing?',
    video: 'Slide-11',
    fragments: [
      f(<Paragraph>We will focus on Property-Based Testing (PBT): properties as the specification method + random generation for inputs.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>Scope: functions primarily</>, appearAtSeconds: 6 },
        { content: <>Purpose: functional correctness</>, appearAtSeconds: 9 },
        { content: <>Next modules: systems scope → resilience, races, and fuzzing</>, appearAtSeconds: 12 },
      ]} />, { appearAtSeconds: 6 }),
    ]
  }
]

