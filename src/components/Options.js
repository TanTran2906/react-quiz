function Options({ question, dispatch, answer }) {
    const hasAnswer = answer !== null

    return (
        <div className="options">
            {question.options.map((option, index) =>
                <button
                    // hasAnswer là false thì trả về "" 
                    className={
                        `btn btn-option ${index === answer ? "answer" : ""}
                        ${hasAnswer ? index === question.correctOption ? "correct" : "wrong" : ""}`
                    }

                    disabled={hasAnswer}
                    key={option}
                    onClick={() => dispatch({ type: 'newAnswer', payload: index })}
                >
                    {option}
                </button>)
            }
        </div>

    )
}

export default Options
