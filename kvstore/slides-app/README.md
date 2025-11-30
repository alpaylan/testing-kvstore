# PBT Slides (React + Vite)

A small slide deck that renders and animates the first five slides of the provided transcript using React and Framer Motion.

## Scripts

- `npm install`
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview the built app

## Controls

- Next: Right Arrow, Space, PageDown
- Previous: Left Arrow, Backspace, PageUp

## Structure

- `src/slidesData.tsx` — content for the first 5 slides
- `src/components/SlideDeck.tsx` — deck controller and navigation
- `src/components/SlideView.tsx` — slide renderer with animated fragments
- `src/components/Blocks.tsx` — basic content blocks and simple animations
- `src/styles.css` — styling

You can extend `slidesData.tsx` or swap it with a parser that transforms transcripts into slides/fragments.


