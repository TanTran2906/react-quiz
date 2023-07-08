import { useEffect, useReducer } from 'react'
import Header from './Header'
import Main from './Main'
import Error from './Error'
import Loader from './Loader'
import StarScreen from './StarScreen'
import Questions from './Questions'
import NextButton from './NextButton'
import Progress from './Progress'
import FinishScreen from './FinishScreen'
import Footer from './Footer'
import Timer from './Timer'

const SECS_PER_QUESTION = 30

const initialState = {
    questions: [],

    //loading, error, finished, ready, active
    status: "loading",
    index: 0, //lưu câu hỏi hiện tại
    answer: null,
    points: 0,
    highscore: 0,
    secondRemaining: null//thời gian làm trắc nghiệm, được gán trong case "start"
}

function reduce(state, action) {

    switch (action.type) {
        case 'dataReceived':
            return {
                ...state,
                questions: action.payload,
                status: 'ready'
            }
        case 'dataFailed':
            return {
                ...state,
                status: 'error'
            }
        case 'start':
            return {
                ...state,
                status: 'active',
                secondRemaining: state.questions.length * SECS_PER_QUESTION
            }
        case 'newAnswer':
            const question = state.questions.at(state.index) //lấy {} question hiện tại

            return {
                ...state,
                answer: action.payload,//lưu vị trí chọn đáp án
                points: question.correctOption === action.payload ? state.points + question.points : state.points
            }
        case 'nextQuestion':
            return {
                ...state,
                index: state.index + 1,
                answer: null
            }
        case 'finish':
            return {
                ...state,
                status: 'finished',
                highscore: state.points > state.highscore ? state.points : state.highscore
            }
        case 'restart':
            return {
                ...initialState,
                questions: state.questions,
                status: 'ready'
            }
        case 'tick':
            return {
                ...state,
                secondRemaining: state.secondRemaining - 1,
                status: state.secondRemaining === 0 ? "finished" : state.status
            }
        default:
            throw new Error("Unknow action")
    }
}

export default function App() {
    const [state, dispatch] = useReducer(reduce, initialState)
    const { questions, status, index, answer, points, highscore, secondRemaining } = state

    const numQuestion = questions.length
    const maxPoints = questions.reduce((pre, cur) => pre + cur.points, 0)

    useEffect(function () {
        fetch('http://localhost:8000/questions')
            .then(res => res.json())
            .then(data => dispatch({ type: 'dataReceived', payload: data }))
            .catch(err => dispatch({ type: 'dataFailed' }))
    }, [])

    return (
        <div className='app'>
            <Header />
            <Main>
                {status === 'error' && <Error />}
                {status === 'loading' && <Loader />}
                {status === 'ready' && <StarScreen numQuestion={numQuestion} dispatch={dispatch} />}
                {status === 'active' &&
                    <>
                        <Progress index={index} numQuestion={numQuestion} answer={answer} points={points} maxPoints={maxPoints} />
                        <Questions question={questions[index]} dispatch={dispatch} answer={answer} />
                        <Footer>
                            <Timer dispatch={dispatch} secondRemaining={secondRemaining} />
                            <NextButton dispatch={dispatch} answer={answer} index={index} numQuestion={numQuestion} />
                        </Footer>
                    </>
                }
                {status === 'finished' && <FinishScreen points={points} highscore={highscore} maxPoints={maxPoints} dispatch={dispatch} />}
            </Main>
        </div>
    )
}