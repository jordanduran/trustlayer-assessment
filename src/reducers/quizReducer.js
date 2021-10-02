const initState = {
  questionsData: [],
  score: 0,
};

export const quizReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_QUESTIONS':
      return {
        ...state,
        questionsData: action.payload,
      };
    default:
      return state;
  }
};
