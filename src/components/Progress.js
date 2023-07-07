function Progress({ index, numQuestion, points, maxPoints, answer }) {
    return (
        <header className="progress">
            <progress max={numQuestion} value={index + Number(answer !== null)} />
            <p>Question {index + 1} / {numQuestion}</p>
            <p>{points} / {maxPoints}</p>
        </header>
    )
}

export default Progress
