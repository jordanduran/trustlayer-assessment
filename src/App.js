import Quiz from './components/Quiz';
import QuizContextProvider from './context/QuizContext';

const App = () => {
  return (
    <QuizContextProvider>
      <div className='App'>
        <Quiz />
      </div>
    </QuizContextProvider>
  );
};

export default App;
