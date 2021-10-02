import { useEffect, useContext } from 'react';
import { QuizContext } from '../context/QuizContext';

const Quiz = () => {
  const { state, dispatch } = useContext(QuizContext);

  console.log(state.questionsData);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10')
      .then((response) => response.json())
      .then((data) =>
        dispatch({ type: 'LOAD_QUESTIONS', payload: data.results })
      )
      .catch((error) => console.error(error));
  }, [dispatch]);

  const listOfQuestions =
    state.questionsData &&
    state.questionsData.map((value, index) => {
      return <li key={index}>{value.question}</li>;
    });

  return (
    <div>
      <h1>Quiz Comp</h1>
      {listOfQuestions}
    </div>
  );
};

export default Quiz;
