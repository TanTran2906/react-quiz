import { useEffect, useReducer } from 'react'
import Header from './Header'
import Main from './Main'
import Error from './Error'
import Loader from './Loader'
import StarScreen from './StarScreen'
import Questions from './Questions'

const initialState = {
    questions: [],

    //loading, error, finished, ready, active
    status: "loading",
    index: 0, //lưu câu hỏi hiện tại
    answer: null,
    points: 0,
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
                status: 'active'
            }
        case 'newAnswer':
            const question = state.questions.at(state.index) //lấy {} question hiện tại

            return {
                ...state,
                answer: action.payload,//lưu vị trí chọn đáp án
                points: question.correctOption === action.payload ? state.points + question.points : state.points
            }
        default:
            throw new Error("Unknow action")
    }
}

export default function App() {
    const [state, dispatch] = useReducer(reduce, initialState)
    const { questions, status, index, answer } = state

    const numQuestion = questions.length

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
                {status === 'active' && <Questions question={questions[index]} dispatch={dispatch} answer={answer} />}
            </Main>
        </div>
    )
}