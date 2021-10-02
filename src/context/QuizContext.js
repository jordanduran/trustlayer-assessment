import { createContext, useReducer } from 'react';
import { quizReducer } from '../reducers/quizReducer';

export const QuizContext = createContext();

const QuizContextProvider = (props) => {
  const [state, dispatch] = useReducer(quizReducer, {
    questionsData: [],
    currentQuestionIndex: 0,
    score: 0,
  });

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {props.children}
    </QuizContext.Provider>
  );
};

export default QuizContextProvider;
