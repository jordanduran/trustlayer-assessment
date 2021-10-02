import { useEffect, useContext } from 'react';
import { QuizContext } from '../context/QuizContext';

const Quiz = () => {
  const { state, dispatch } = useContext(QuizContext);

  console.log(state);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10')
      .then((response) => response.json())
      .then((data) =>
        dispatch({ type: 'LOAD_QUESTIONS', payload: data.results })
      )
      .catch((error) => console.error(error));
  }, [dispatch]);

  // const listOfQuestions =
  //   state.questionsData &&
  //   state.questionsData.map((value, index) => {
  //     return <li key={index}>{value.question}</li>;
  //   });

  // const currQuestion =
  //   state.questionsData &&
  //   state.questionsData.map((value, index) => {
  //     if (state.currentQuestion === index) {
  //       return value;
  //     }
  //   });

  // console.log(currQuestion);

  return (
    <div className='quiz-container'>
      <h1>Quiz</h1>
      <div className='quiz-card'>
        <h2 className='question-header'>
          Question {state.currentQuestionIndex + 1} of{' '}
          {state.questionsData.length}
        </h2>
        <p className='question'>
          {state.questionsData.length &&
            state.questionsData[state.currentQuestionIndex].question}
        </p>
      </div>
      <div className='button-controls'>
        <button
          className='prev-btn'
          onClick={() => dispatch({ type: 'PREV_QUESTION' })}
          disabled={state.currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          className='next-btn'
          onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
          disabled={state.currentQuestionIndex === 9}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Quiz;
