import React from 'react'

export type QuizOption = {
  id: string
  label: React.ReactNode
  correct: boolean
}

type QuizMultiProps = {
  question: React.ReactNode
  options: QuizOption[]
  submitLabel?: string
}

export function QuizMulti(props: QuizMultiProps): React.ReactElement {
  const { question, options, submitLabel = 'Check answers' } = props
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = React.useState(false)

  const toggle = (id: string) => {
    if (submitted) return
    setSelected(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const onSubmit = () => {
    setSubmitted(true)
  }

  const isCorrect = (id: string): boolean => {
    const want = options.find(o => o.id === id)?.correct ?? false
    const got = !!selected[id]
    return want === got
  }

  const allCorrect = submitted && options.every(o => isCorrect(o.id))

  return (
    <div className="quiz">
      <div className="quiz-question">{question}</div>
      <div className="quiz-options">
        {options.map(opt => {
          const chosen = !!selected[opt.id]
          const correct = submitted ? opt.correct : undefined
          const state =
            submitted ? (opt.correct ? 'correct' : (chosen ? 'wrong' : 'neutral')) : 'idle'
          return (
            <label key={opt.id} className={`quiz-option ${state}`}>
              <input
                type="checkbox"
                checked={chosen}
                onChange={() => toggle(opt.id)}
                disabled={submitted}
              />
              <span className="quiz-label">{opt.label}</span>
              {submitted && opt.correct ? <span className="badge">✓</span> : null}
              {submitted && !opt.correct && chosen ? <span className="badge">✗</span> : null}
            </label>
          )
        })}
      </div>
      <div className="quiz-actions">
        {!submitted ? (
          <button onClick={onSubmit}>{submitLabel}</button>
        ) : (
          <>
            <div className={`quiz-feedback ${allCorrect ? 'ok' : 'not-ok'}`}>
              {allCorrect ? 'Correct!' : 'Some selections are incorrect.'}
            </div>
            <button onClick={() => { setSubmitted(false); setSelected({}) }}>Reset</button>
          </>
        )}
      </div>
    </div>
  )
}


