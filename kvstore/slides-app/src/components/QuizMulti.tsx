import React from 'react'

type QuizOption = {
  id: string
  label: React.ReactNode
  correct: boolean
}

type QuizMultiProps = {
  question: React.ReactNode
  options: QuizOption[]
  buttonLabel?: string
}

export function QuizMulti(props: QuizMultiProps): React.ReactElement {
  const { question, options } = props
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})
  const [checked, setChecked] = React.useState(false)

  const toggle = (id: string) => {
    setSelected(s => ({ ...s, [id]: !s[id] }))
  }

  const correctCount = options.filter(o => o.correct).length
  const selectedCorrect = options.filter(o => o.correct && selected[o.id]).length
  const selectedWrong = options.filter(o => !o.correct && selected[o.id]).length
  const isPerfect = checked && selectedCorrect === correctCount && selectedWrong === 0

  return (
    <div className="quiz">
      <div className="quiz-q">{question}</div>
      <div className="quiz-options">
        {options.map(opt => {
          const isSelected = !!selected[opt.id]
          const showCorrect = checked && opt.correct
          const showWrong = checked && isSelected && !opt.correct
          return (
            <label key={opt.id} className={`quiz-option${showCorrect ? ' correct' : ''}${showWrong ? ' wrong' : ''}`}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggle(opt.id)}
                disabled={checked}
              />
              <span className="opt-label">{opt.label}</span>
            </label>
          )
        })}
      </div>
      <div className="quiz-actions">
        {!checked ? (
          <button className="quiz-btn" onClick={() => setChecked(true)}>Check answers</button>
        ) : (
          <button className="quiz-btn" onClick={() => { setChecked(false); setSelected({}) }}>Reset</button>
        )}
        {checked ? (
          <div className={`quiz-result${isPerfect ? ' perfect' : ''}`}>
            Correct: {selectedCorrect} / {correctCount}{selectedWrong > 0 ? `, Wrong: ${selectedWrong}` : ''}
          </div>
        ) : null}
      </div>
    </div>
  )
}


