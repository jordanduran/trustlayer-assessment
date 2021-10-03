// import { useEffect, createContext, useReducer } from 'react';
// import { quizReducer } from '../reducers/quizReducer';

// export const QuizContext = createContext();

// const QuizContextProvider = (props) => {
//   const [state, dispatch] = useReducer(quizReducer, {
//     questionsData: [],
//     currentQuestionIndex: 0,
//     selectedOption: '',
//     score: 0,
//   });

//   useEffect(() => {
//     fetch('https://opentdb.com/api.php?amount=10')
//       .then((response) => response.json())
//       .then((data) =>
//         dispatch({ type: 'LOAD_QUESTIONS', payload: data.results })
//       )
//       .catch((error) => console.error(error));
//   }, []);

//   return (
//     <QuizContext.Provider value={{ state, dispatch }}>
//       {props.children}
//     </QuizContext.Provider>
//   );
// };

// export default QuizContextProvider;
