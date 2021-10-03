// export const quizReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOAD_QUESTIONS':
//       return {
//         ...state,
//         questionsData: action.payload,
//       };
//     case 'SELECTED_OPTION':
//       return {
//         ...state,
//         selectedOption: action.payload,
//       };
//     case 'NEXT_QUESTION':
//       return {
//         ...state,
//         currentQuestionIndex: state.currentQuestionIndex + 1,
//       };
//     case 'PREV_QUESTION':
//       return {
//         ...state,
//         currentQuestionIndex: state.currentQuestionIndex - 1,
//       };
//     default:
//       return state;
//   }
// };
