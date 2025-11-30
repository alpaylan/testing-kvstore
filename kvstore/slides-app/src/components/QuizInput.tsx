import React from 'react'

type QuizInputProps = {
  question: React.ReactNode
  expected: string | string[]
  placeholder?: string
  normalize?: (s: string) => string
}

export function QuizInput(props: QuizInputProps): React.ReactElement {
  const { question, expected, placeholder } = props
  const [value, setValue] = React.useState('')
  const [checked, setChecked] = React.useState(false)

  const normalize = props.normalize ?? ((s: string) => s.replace(/\s+/g, '').toLowerCase())
  const expectedSet = React.useMemo(() => {
    const arr = Array.isArray(expected) ? expected : [expected]
    return new Set(arr.map(normalize))
  }, [expected, normalize])

  const isCorrect = checked && expectedSet.has(normalize(value))

  return (
    <div className="quiz">
      <div className="quiz-q">{question}</div>
      <div className="quiz-input-row">
        <input
          className="quiz-input"
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setChecked(false) }}
          placeholder={placeholder ?? 'Type your answer'}
        />
        {!checked ? (
          <button className="quiz-btn" onClick={() => setChecked(true)}>Check</button>
        ) : (
          <button className="quiz-btn" onClick={() => { setChecked(false); setValue('') }}>Reset</button>
        )}
      </div>
      {checked ? (
        <div className={`quiz-result ${isCorrect ? 'perfect' : 'wrong'}`}>
          {isCorrect ? 'Correct' : 'Try again'}
        </div>
      ) : null}
    </div>
  )
}


