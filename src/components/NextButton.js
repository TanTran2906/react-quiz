function NextButton({ dispatch, answer, index, numQuestion }) {
    if (answer === null) return null

    return (
        <div>
            {index < numQuestion - 1 && <button className="btn btn-ui" onClick={() => dispatch({ type: 'nextQuestion' })}>Next</button>}
            {index === numQuestion - 1 && <button className="btn btn-ui" onClick={() => dispatch({ type: 'finish' })}>Finish</button>}

        </div>
    )
}

export default NextButton
