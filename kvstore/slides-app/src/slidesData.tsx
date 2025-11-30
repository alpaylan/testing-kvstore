import React from 'react'
import type { Slide, Fragment } from './components/SlideDeck'
import { Bullets, Callout, Paragraph, PanZoomBox, TwoCol, Typewriter, FragmentBullets, FragmentBoard } from './components/Blocks'
import { QuizMulti } from './components/Quiz'
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
  },
  {
    id: 's12',
    title: 'Why Property-Based Testing?',
    video: 'Slide-12',
    fragments: [
      f(<Paragraph>What’s special, and more so useful, about Property-Based Testing?</Paragraph>, { appearAtSeconds: 1.5 }),
      f(<Paragraph>Think of other engineering artifacts you use: would you trust a car that isn’t tested across diverse conditions?</Paragraph>, { appearAtSeconds: 5 }),
      f(<FragmentBoard items={[
        { content: <>🚗 Low speed neighborhood</>, appearAtSeconds: 7 },
        { content: <>🚀 Highway velocity</>, appearAtSeconds: 9 },
        { content: <>🛑 Instant brakes</>, appearAtSeconds: 11 },
        { content: <>☀️ Asphalt • ❄️ Gravel • 🌧️ Rain • 🧊 Ice</>, appearAtSeconds: 13 },
      ]} />, { appearAtSeconds: 7 }),
      f(<Paragraph>Engineering defects are out-of-distribution scenarios we forget to test; mainstream IO example testing often misses them.</Paragraph>, { appearAtSeconds: 17 }),
      f(<Paragraph>Properties let us capture complex, large-scale behaviors in the abstract rather than only small, concrete examples.</Paragraph>, { appearAtSeconds: 21 })
    ]
  },
  {
    id: 's14',
    title: 'Describing Sorting Precisely',
    video: 'Slide-14',
    fragments: [
      f(<Paragraph>You have seen that IO examples can still admit incorrect “sorting” algorithms that pass examples but fail generally.</Paragraph>, { appearAtSeconds: 2 }),
      f(<Paragraph>This property captures sorting at a universal level for all lists, succinctly:</Paragraph>, { appearAtSeconds: 5 }),
      f(<FragmentBoard items={[
        { content: <>Sorted: ∀ i {'<'} j, out[i] {'≤'} out[j]</>, appearAtSeconds: 7 },
        { content: <>Same elements: multiset(out) = multiset(input)</>, appearAtSeconds: 11 },
      ]} />, { appearAtSeconds: 7 }),
      f(<Paragraph>We won’t always have such clean specifications, but many useful properties are close at hand.</Paragraph>, { appearAtSeconds: 15 }),
      f(<Typewriter text="Properties specify the behavior space — beyond particular examples." />, { appearAtSeconds: 18 })
    ]
  },
  {
    id: 's16',
    title: 'Describing Complex Systems',
    video: 'Slide-16',
    fragments: [
      f(<Paragraph>As systems get more complex, IO examples become inadequate for defining correctness.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>Randomness: what is a “correct” coin flip?</>, appearAtSeconds: 6 },
        { content: <>Compilers: how many examples define a correct C compiler?</>, appearAtSeconds: 10 },
        { content: <>Engines: DBs, renderers, navigation — thousands of behaviors</>, appearAtSeconds: 14 }
      ]} />, { appearAtSeconds: 6 }),
      f(<Paragraph>With properties, we specify relations universally, not just outputs for a few inputs.</Paragraph>, { appearAtSeconds: 18 }),
      f(<FragmentBoard items={[
        { content: <>Compiler equivalence: GCC(out) ≡ Clang(out)</>, appearAtSeconds: 20 },
        { content: <>Optimization invariance: O0(out) = O2(out)</>, appearAtSeconds: 24 },
        { content: <>Probabilistic constraints: P(heads) ≈ 0.5</>, appearAtSeconds: 28 }
      ]} />, { appearAtSeconds: 20 }),
      f(<Paragraph>These properties range over all programs/inputs — empowering but requiring generators to produce diverse cases.</Paragraph>, { appearAtSeconds: 32 })
    ]
  },
  {
    id: 's17',
    title: 'How to Specify Programs',
    video: 'Slide-17',
    fragments: [
      f(<Paragraph>Welcome to the second section: How to Specify Programs.</Paragraph>, { appearAtSeconds: 1.5 }),
      f(<Paragraph>We will learn to specify programs using properties via popular blueprints and their applications in Frontend, Backend, and Distributed Systems.</Paragraph>, { appearAtSeconds: 5 }),
      f(<Paragraph>While many properties are domain-specific, there are reusable templates we can adapt to our problems.</Paragraph>, { appearAtSeconds: 9 }),
      f(<Typewriter text="Blueprints → Apply to your own work" />, { appearAtSeconds: 13 })
    ]
  },
  {
    id: 's18',
    title: 'Differential Testing',
    video: 'Slide-18',
    fragments: [
      f(<Paragraph>The first blueprint property is a differential test — all about equivalence.</Paragraph>, { appearAtSeconds: 2 }),
      f(<Paragraph>Like proving a scale is fair: place the same weight on both sides; it should balance.</Paragraph>, { appearAtSeconds: 6 }),
      f(<FragmentBoard items={[
        { content: <>Compiler equivalence: GCC(prog) ≡ Clang(prog)</>, appearAtSeconds: 9 },
        { content: <>Reference vs Production: simple spec-correct ref ≡ complex impl</>, appearAtSeconds: 13 },
        { content: <>Concurrency vs Single-thread</>, appearAtSeconds: 17 },
        { content: <>SIMD/vectorized vs scalar loop</>, appearAtSeconds: 21 },
      ]} />, { appearAtSeconds: 9 }),
      f(<Paragraph>We will construct such equivalence tests in UI programming next.</Paragraph>, { appearAtSeconds: 25 })
    ]
  },
  {
    id: 's19',
    title: 'Differential Testing — Frontend',
    // video: 'Slide-19',
    fragments: [
      f(<Paragraph>On frontends, compare a virtualized component against a concrete DOM version to ensure visual invariants hold.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBoard items={[
        { content: <>Virtualized list ≡ Concrete list (same pixels/ARIA)</>, appearAtSeconds: 6 },
        { content: <>Layout invariants: widths/heights/margins match</>, appearAtSeconds: 10 },
        { content: <>Interaction invariants: keyboard focus/scroll parity</>, appearAtSeconds: 14 },
        { content: <>A11y invariants: roles/names/states equivalent</>, appearAtSeconds: 18 },
      ]} />, { appearAtSeconds: 6 })
    ]
  },
  {
    id: 's20',
    title: 'Differential Testing — Backend',
    video: 'Slide-20',
    fragments: [
      f(<Paragraph>In distributed systems, assert multi-node ≡ single-node behavior; in backends, single-threaded ≡ multi-threaded results.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBoard items={[
        { content: <>Cluster output ≡ Single-node output</>, appearAtSeconds: 6 },
        { content: <>Idempotent endpoints: retry yields same result</>, appearAtSeconds: 10 },
        { content: <>Concurrency invariants: no races/duplicates</>, appearAtSeconds: 14 },
        { content: <>Read-your-writes (when applicable)</>, appearAtSeconds: 18 },
      ]} />, { appearAtSeconds: 6 })
    ]
  },
  {
    id: 's21',
    title: 'Safety Properties',
    video: 'Slide-21',
    fragments: [
      f(<Paragraph>Safety properties form a class of “X never happens” expectations for user-facing systems.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>Never corrupt filesystem</>, appearAtSeconds: 6 },
        { content: <>Never crash between checkpoints</>, appearAtSeconds: 9 },
        { content: <>Never get stuck (always possible to make progress)</>, appearAtSeconds: 12 },
      ]} />, { appearAtSeconds: 6 }),
      f(<Paragraph>Use random testing to search for sequences that violate these expectations.</Paragraph>, { appearAtSeconds: 16 })
    ]
  },
  {
    id: 's22',
    title: 'Safety Properties — Frontend',
    // video: 'Slide-22',
    fragments: [
      f(<FragmentBullets items={[
        { content: <>Latency property: respond to local interactions in {'<='} 70ms</>, appearAtSeconds: 2 },
        { content: <>No crash-to-white: no sequence yields a white page</>, appearAtSeconds: 6 },
        { content: <>Never stuck: always an interaction to make progress</>, appearAtSeconds: 10 },
      ]} />, { appearAtSeconds: 2 }),
      f(<Paragraph>Instrument interactions and assert these properties under randomized user flows.</Paragraph>, { appearAtSeconds: 14 })
    ]
  },
  {
    id: 's23',
    title: 'Safety Properties — Backend',
    // video: 'Slide-23',
    fragments: [
      f(<FragmentBullets items={[
        { content: <>Never crash the server</>, appearAtSeconds: 2 },
        { content: <>Never experience data corruption</>, appearAtSeconds: 6 },
        { content: <>Domain SLAs: always respond under 300ms</>, appearAtSeconds: 10 },
        { content: <>Never leak one user’s data to another</>, appearAtSeconds: 14 },
        { content: <>Never double-charge the customer</>, appearAtSeconds: 18 },
      ]} />, { appearAtSeconds: 2 }),
      f(<Paragraph>Some checks need bespoke scenarios and metrics; properties help encode the invariants.</Paragraph>, { appearAtSeconds: 22 })
    ]
  },
  {
    id: 's24',
    title: 'Idempotency',
    // video: 'Slide-24',
    fragments: [
      f(<Paragraph>Idempotency: doing something once is equivalent to doing it many times.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBoard items={[
        { content: <>Sorting: sort(l) = sort(sort(l))</>, appearAtSeconds: 5 },
        { content: <>React Strict Mode: effects should be idempotent</>, appearAtSeconds: 9 },
        { content: <>Distributed systems: retries don’t change result</>, appearAtSeconds: 13 },
      ]} />, { appearAtSeconds: 5 }),
      f(<Paragraph>We’ll not dive deep here; this is crucial in distributed systems and covered later.</Paragraph>, { appearAtSeconds: 17 })
    ]
  },
  {
    id: 's25',
    title: 'Idempotency Quiz',
    fragments: [
      f(<Paragraph>Quiz: Which functions in the String interface are idempotent? Select all that apply.</Paragraph>),
      f(<QuizMulti
        question="Select idempotent String functions (f(f(x)) = f(x))"
        options={[
          { id: 'upper', label: <>toUpperCase</>, correct: true },
          { id: 'lower', label: <>toLowerCase</>, correct: true },
          { id: 'trim', label: <>trim</>, correct: true },
          { id: 'trimS', label: <>trimStart</>, correct: true },
          { id: 'trimE', label: <>trimEnd</>, correct: true },
          { id: 'norm', label: <>normalize</>, correct: true },
          { id: 'padS', label: <>padStart (fixed target width)</>, correct: true },
          { id: 'padE', label: <>padEnd (fixed target width)</>, correct: true },
          { id: 'slice', label: <>slice</>, correct: false },
          { id: 'concat', label: <>concat</>, correct: false },
          { id: 'repeat', label: <>repeat</>, correct: false },
          { id: 'replace', label: <>replace / replaceAll</>, correct: false }
        ]}
      />)
    ]
  },
  {
    id: 's26',
    title: 'Idempotency Quiz',
    fragments: [
      f(<Paragraph>Quiz: HashMap::Insert(map, x) = ___?</Paragraph>),
      f(<QuizMulti
        question="Fill the blank for idempotency of insert"
        options={[
          { id: 'ins2', label: <>HashMap::Insert(HashMap::Insert(map, x), x)</>, correct: true },
          { id: 'del', label: <>HashMap::Delete(map, x)</>, correct: false },
          { id: 'same', label: <>map</>, correct: false },
          { id: 'weird', label: <>HashMap::Insert(map, hash(x))</>, correct: false },
          { id: 'dup', label: <>HashMap::Insert(map, x, x)</>, correct: false }
        ]}
      />)
    ]
  },
  {
    id: 's27',
    title: 'Monotonicity',
    // video: 'Slide-27',
    fragments: [
      f(<Paragraph>Whereas idempotency is f(f…f(x)) = f(x), monotonicity is f(x) {'<='} f(f(x)). Values never decay across successive applications.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>Monotone data in growing systems: IDs, counters, sizes</>, appearAtSeconds: 6 },
        { content: <>Test monotonicity under complex interactions</>, appearAtSeconds: 9 },
      ]} />, { appearAtSeconds: 6 }),
      f(<FragmentBoard items={[
        { content: <>f(x) {'<='} f(f(x)) {'<='} f(f(f(x))) {'<='} f(f … (f(x)))</>, appearAtSeconds: 12 },
        { content: <>incr(i) {'<='} incr(incr(i)) {'<='} incr(incr(incr(i)))</>, appearAtSeconds: 15 },
      ]} />, { appearAtSeconds: 12 })
    ]
  },
  {
    id: 's28',
    title: 'Monotonicity Quiz',
    fragments: [
      f(<Paragraph>Quiz: Write a monotonicity property for f32::power. Select all that apply.</Paragraph>),
      f(<QuizMulti
        question="Which statements express monotonicity for pow(x, n) with n ∈ ℕ (n ≥ 0)?"
        options={[
          { id: 'mono_ge1', label: <>x {'>='} 1 and n {'>='} 0 ⇒ pow(x, n + 1) {'>='} pow(x, n)</>, correct: true },
          { id: 'mono_le1', label: <>0 {'<='} x {'<='} 1 and n {'>='} 0 ⇒ pow(x, n + 1) {'<='} pow(x, n)</>, correct: true },
          { id: 'mono_all', label: <>For all x {'>'} 0: pow(x, n + 1) {'>='} pow(x, n)</>, correct: false },
          { id: 'n_shift', label: <>For x {'>'} 0 and m {'>'} 0: pow(x, n + m) {'>='} pow(x, n)</>, correct: false },
          { id: 'n_wrong', label: <>For x {'>='} 0: pow(x, n) {'>='} n</>, correct: false }
        ]}
      />)
    ]
  },

  {
    id: 's29',
    title: 'Monotonicity Quiz',
    fragments: [
      f(<Paragraph>Quiz: Write a monotonicity property for String::substring. Select all that apply.</Paragraph>),
      f(<QuizMulti
        question="Monotonicity of substring(s, start, end) with 0 {'<='} start {'<='} end {'<='} |s|"
        options={[
          { id: 'end_mono', label: <>Fix start; if end₂ {'>='} end₁ then |substring(s, start, end₂)| {'>='} |substring(s, start, end₁)|</>, correct: true },
          { id: 'start_mono', label: <>Fix end; if start₁ {'<='} start₂ then |substring(s, start₁, end)| {'>='} |substring(s, start₂, end)|</>, correct: true },
          { id: 'always_inc', label: <>For any move of start/end, substring length strictly increases</>, correct: false },
          { id: 'content_mono', label: <>Substring characters are monotone in Unicode code points</>, correct: false }
        ]}
      />)
    ]
  },
  {
    id: 's30',
    title: 'Roundtrip Properties',
    // video: 'Slide-30',
    fragments: [
      f(<Paragraph>A roundtrip property couples two functions so that f(g(x)) = x.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>parse(print(obj)) = obj</>, appearAtSeconds: 5 },
        { content: <>decompress(compress(data)) = data</>, appearAtSeconds: 7 },
        { content: <>serialize/deserialize, add/remove, encode/decode …</>, appearAtSeconds: 9 }
      ]} />, { appearAtSeconds: 5 }),
      f(<Paragraph>I used to cite JSON.parse(JSON.stringify(obj)), but that roundtrip often doesn’t hold. Why?</Paragraph>, { appearAtSeconds: 12 }),
      f(<QuizMulti
        question="Why can JSON.parse(JSON.stringify(obj)) !== obj?"
        options={[
          { id: 'proto', label: <>Prototype/type lost — instances become plain objects</>, correct: true },
          { id: 'undef', label: <>undefined, functions, symbols are dropped or altered</>, correct: true },
          { id: 'nonfinite', label: <>NaN/Infinity serialized as null</>, correct: true },
          { id: 'dates', label: <>Date becomes string; not revived automatically</>, correct: true },
          { id: 'mapset', label: <>Map/Set/BigInt/cyclic refs not faithfully preserved</>, correct: true },
          { id: 'order', label: <>Property order is randomized causing inequality</>, correct: false }
        ]}
      />)
    ]
  },
  {
    id: 's31',
    title: 'Roundtrip Property Quiz',
    fragments: [
      f(<Paragraph>Quiz: Which functions of the HashMap interface can be tested with a roundtrip property?</Paragraph>),
      f(<QuizMulti
        question="Select all roundtrip pairs f(g(x)) = x for a HashMap"
        options={[
          { id: 'ser', label: <>deserialize(serialize(map))</>, correct: true },
          { id: 'entries', label: <>fromEntries(entries(map))</>, correct: true },
          { id: 'ins_rem', label: <>remove(insert(map, k, v), k)</>, correct: false },
          { id: 'get_set', label: <>get(insert(map, k, v), k) = v</>, correct: false },
          { id: 'clear', label: <>insert(clear(map), k, v) = map</>, correct: false }
        ]}
      />)
    ]
  },
  {
    id: 's32',
    title: 'Roundtrip Property — Quiz 2',
    fragments: [
      f(<Paragraph>Quiz: Can we use a strict roundtrip property for compression?</Paragraph>),
      f(<QuizMulti
        question="Which formats support strict decode(encode(data)) = data?"
        options={[
          { id: 'png', label: <>PNG (lossless)</>, correct: true },
          { id: 'jpeg', label: <>JPEG (lossy)</>, correct: false },
          { id: 'lossless_any', label: <>Any lossless codec</>, correct: true },
          { id: 'lossy_any', label: <>Any lossy codec</>, correct: false }
        ]}
      />)
    ]
  },
  {
    id: 's33',
    title: 'Domain Specific Properties',
    // video: 'Slide-33',
    fragments: [
      f(<Paragraph>Correctness is inherently linked to domain: chess engines, databases, medical systems all differ.</Paragraph>, { appearAtSeconds: 2 }),
      f(<Paragraph>Many properties won’t fit our blueprints; tailor specs to your product and risks.</Paragraph>, { appearAtSeconds: 6 }),
      f(<FragmentBullets items={[
        { content: <>Preconditions matter: test only where the property is intended to hold</>, appearAtSeconds: 9 },
        { content: <>Chess: assume opponent moves are valid</>, appearAtSeconds: 12 },
        { content: <>Database: file not externally corrupted</>, appearAtSeconds: 15 },
        { content: <>Division: divisor ≠ 0</>, appearAtSeconds: 18 },
      ]} />, { appearAtSeconds: 9 }),
      f(<Paragraph>As properties grow complex, input generators satisfying preconditions and measuring test efficiency become crucial.</Paragraph>, { appearAtSeconds: 22 })
    ]
  },
  {
    id: 's34',
    title: 'Property Exercise',
    // video: 'Slide-34',
    fragments: [
      f(<Paragraph>Exercise: Turn the example set into a property for append(xs, x).</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBoard items={[
        { content: <>append([1, 2, 3], 4) = [1, 2, 3, 4]</>, appearAtSeconds: 4 },
        { content: <>append([], -1) = [-1]</>, appearAtSeconds: 6 },
        { content: <>append(['a'], 'b') = ['a','b']</>, appearAtSeconds: 8 },
      ]} />, { appearAtSeconds: 4 }),
      f(<QuizMulti
        question="Which general properties hold for append(xs, x)? Select all that apply."
        options={[
          { id: 'len', label: <>length(append(xs, x)) = length(xs) + 1</>, correct: true },
          { id: 'suffix', label: <>append(xs, x) endsWith x</>, correct: true },
          { id: 'prefix', label: <>For all i {'<'} length(xs): append(xs, x)[i] = xs[i]</>, correct: true },
          { id: 'comm', label: <>append(xs, x) = append(x, xs)</>, correct: false },
          { id: 'sort', label: <>append(xs, x) is sorted whenever xs is sorted</>, correct: false }
        ]}
      />)
    ]
  },
  {
    id: 's35',
    title: 'Fundamentals of Random Generation',
    // video: 'Slide-35',
    fragments: [
      f(<Paragraph>Welcome to random generation. Once we have a universal property, we need to generate random inputs to test it.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>Progressively build generators from simple to complex types</>, appearAtSeconds: 6 },
        { content: <>Balance uniformity, constraints, and coverage</>, appearAtSeconds: 10 },
        { content: <>Compose smaller generators into structured data</>, appearAtSeconds: 14 },
      ]} />, { appearAtSeconds: 6 })
    ]
  },
  {
    id: 's36',
    title: 'Set-Based Generators',
    // video: 'Slide-36',
    fragments: [
      f(<Paragraph>Given a finite set, a generator is a random pick over its elements.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBoard items={[
        { content: <>32-bit integers → |ℤ₃₂| = 2^32 choices</>, appearAtSeconds: 6 },
        { content: <>Strings over alphabet Σ of size K, up to length N</>, appearAtSeconds: 10 },
        { content: <>Count = 1 + K + K^2 + … + K^N</>, appearAtSeconds: 12 },
        { content: <>Uniform or weighted picking across the set</>, appearAtSeconds: 16 },
      ]} />, { appearAtSeconds: 6 }),
      f(<Paragraph>We’ll use these building blocks to construct richer generators next.</Paragraph>, { appearAtSeconds: 20 })
    ]
  },
  {
    id: 's37',
    title: 'Composing Generators',
    // video: 'Slide-37',
    fragments: [
      f(<Paragraph>Compose generators for different types by first picking which type to produce, then delegating to its generator.</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>Union types: Option[T] = T | None, Either[A,B] = A | B</>, appearAtSeconds: 5 },
        { content: <>Sets-of-sets analogy: choose an outer set, then pick from inner</>, appearAtSeconds: 8 },
        { content: <>Weights control frequency (e.g., None 10%, T 90%)</>, appearAtSeconds: 11 },
      ]} />, { appearAtSeconds: 5 }),
      f(<FragmentBoard items={[
        { content: <>gen Option[T]:</>, appearAtSeconds: 13 },
        { content: <>&nbsp;&nbsp;if random() {'<'} p: return None</>, appearAtSeconds: 14 },
        { content: <>&nbsp;&nbsp;else: return gen T</>, appearAtSeconds: 15 },
        { content: <>gen Either[A,B]: if coin(): gen A else gen B</>, appearAtSeconds: 17 },
      ]} />, { appearAtSeconds: 13 })
    ]
  },
  {
    id: 's38',
    title: 'Recursive Generators',
    // video: 'Slide-38',
    fragments: [
      f(<Paragraph>A recursive generator is like a recursive function: it calls itself. Useful for recursive types (e.g., JSON).</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>Bound recursion with size/depth; decrease on each call</>, appearAtSeconds: 5 },
        { content: <>Base-only when size = 0; otherwise mix base + recursive</>, appearAtSeconds: 8 },
        { content: <>Compose multiple cases; only some are recursive</>, appearAtSeconds: 11 },
      ]} />, { appearAtSeconds: 5 }),
      f(<FragmentBoard items={[
        { content: <>type JSON = num | str | None | Bool | list[JSON] | dict[str, JSON]</>, appearAtSeconds: 13 },
        { content: <>genJSON(size):</>, appearAtSeconds: 15 },
        { content: <>&nbsp;&nbsp;if size == 0: pick [genNum, genStr, genNone, genBool]</>, appearAtSeconds: 16 },
        { content: <>&nbsp;&nbsp;else: pick [genNum, genStr, genNone, genBool,</>, appearAtSeconds: 18 },
        { content: <>&nbsp;&nbsp;&nbsp;&nbsp;list(genJSON(size-1)), dict(genStr, genJSON(size-1))]</>, appearAtSeconds: 19 }
      ]} />, { appearAtSeconds: 13 })
    ]
  },
  {
    id: 's39',
    title: 'Composite Generators',
    // video: 'Slide-39',
    fragments: [
      f(<Paragraph>Composite generators take other generators as inputs. A list generator consumes a T generator and produces List[T].</Paragraph>, { appearAtSeconds: 2 }),
      f(<FragmentBullets items={[
        { content: <>Construct via sequences: earlier results feed later steps</>, appearAtSeconds: 6 },
        { content: <>Contrasts with derived generators (pure transforms)</>, appearAtSeconds: 9 },
        { content: <>Inner T can itself be composite or recursive</>, appearAtSeconds: 12 },
      ]} />, { appearAtSeconds: 6 }),
      f(<FragmentBoard items={[
        { content: <>genList(genT, size):</>, appearAtSeconds: 14 },
        { content: <>&nbsp;&nbsp;len = genInt(0, size)</>, appearAtSeconds: 15 },
        { content: <>&nbsp;&nbsp;xs = []</>, appearAtSeconds: 16 },
        { content: <>&nbsp;&nbsp;for i in [0..len): xs.push(genT(size')) // choose size' ≤ size</>, appearAtSeconds: 17 },
        { content: <>&nbsp;&nbsp;return xs</>, appearAtSeconds: 18 },
        { content: <>// Nested: genList(genList(genNum)) → List[List[num]]</>, appearAtSeconds: 20 }
      ]} />, { appearAtSeconds: 14 })
    ]
  },
  {
    id: 's40',
    title: 'Stateful Generators',
    // video: 'Slide-40',
    fragments: [
      f(<Paragraph>For complex systems, build state via the system’s API rather than synthesizing raw state files.</Paragraph>, { appearAtSeconds: 2 }),
      f(<Paragraph>Example: SQL DB — generate random SQL to construct a DB; then test with randomized queries and mutations.</Paragraph>, { appearAtSeconds: 6 }),
      f(<FragmentBullets items={[
        { content: <>State evolves: later steps depend on earlier effects</>, appearAtSeconds: 10 },
        { content: <>Respect preconditions and invariants during generation</>, appearAtSeconds: 13 },
        { content: <>Mix builders (setup) with checkers (assertions)</>, appearAtSeconds: 16 },
      ]} />, { appearAtSeconds: 10 }),
      f(<FragmentBoard items={[
        { content: <>state := connect()</>, appearAtSeconds: 18 },
        { content: <>repeat k: stmt := genStmt(state); exec(state, stmt)</>, appearAtSeconds: 19 },
        { content: <>for q in genQueries(state): assert property(state, q)</>, appearAtSeconds: 21 },
        { content: <>shrink by trimming sequence or simplifying stmts</>, appearAtSeconds: 23 },
      ]} />, { appearAtSeconds: 18 })
    ]
  },
  {
    id: 's41',
    title: 'Pitfalls of Random Generation',
    // video: 'Slide-41',
    fragments: [
      f(<Paragraph>Developing good generators takes time and intuition. Here are common pitfalls and how to measure them.</Paragraph>, { appearAtSeconds: 2 }),
      f(<Paragraph>Low precision generators</Paragraph>, { appearAtSeconds: 5 }),
      f(<FragmentBullets items={[
        { content: <>Measure discard ratio — invalid inputs waste budget</>, appearAtSeconds: 6 },
        { content: <>Tighten generators to property preconditions</>, appearAtSeconds: 8 },
        { content: <>Prefer constructive generators over filter-based ones</>, appearAtSeconds: 10 },
      ]} />, { appearAtSeconds: 6 }),
      f(<Paragraph>Low recall generators</Paragraph>, { appearAtSeconds: 13 }),
      f(<FragmentBullets items={[
        { content: <>Broaden input space — e.g., not only SELECT for SQL</>, appearAtSeconds: 14 },
        { content: <>Use coverage as a signal for missing regions</>, appearAtSeconds: 16 },
        { content: <>Balance distributions to reach rare paths</>, appearAtSeconds: 18 },
      ]} />, { appearAtSeconds: 14 }),
      f(<Paragraph>Measuring your generators</Paragraph>, { appearAtSeconds: 21 }),
      f(<FragmentBoard items={[
        { content: <>Stats: discard ratio, size/shape distributions</>, appearAtSeconds: 22 },
        { content: <>Record per-case metadata during campaigns</>, appearAtSeconds: 24 },
        { content: <>Use tools (e.g., Tyche) to visualize coverage and bias</>, appearAtSeconds: 26 },
      ]} />, { appearAtSeconds: 22 })
    ]
  }
]

