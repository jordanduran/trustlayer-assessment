import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Quiz = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [userIsCorrect, setUserIsCorrect] = useState(false);
  const [checkAnswerBtnClicked, setCheckAnswerBtnClicked] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch data from API on component mount

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10')
      .then((response) => response.json())
      .then((data) => setQuestionsData(data.results))
      .catch((error) => console.error(error));
    console.log('I ran!');
  }, []);

  // Combine all answers into one array

  useEffect(() => {
    const listOfAnswers =
      questionsData.length &&
      [
        questionsData[currentQuestionIndex].incorrect_answers,
        questionsData[currentQuestionIndex].correct_answer,
      ]
        .flat()
        .sort(() => Math.random() - 0.5);
    setOptions(listOfAnswers);
  }, [questionsData, currentQuestionIndex]);

  // Creating an array combining correct answer and incorrect answers then randomly sorting it

  const handleSelectOption = (userSelectedOption) => {
    setSelectedOption(userSelectedOption);
  };

  const handleCheckAnswer = () => {
    setCheckAnswerBtnClicked(true);
    if (selectedOption === questionsData[currentQuestionIndex].correct_answer) {
      setUserIsCorrect(true);
    }
  };

  console.log(userIsCorrect);
  console.log(questionsData[currentQuestionIndex]);

  const handlePrevBtnClick = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleNextBtnClick = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOption('');
    setCheckAnswerBtnClicked(false);
  };

  return (
    <div className='quiz-container'>
      <h1>Quiz</h1>
      <div className='quiz-card'>
        <h2 className='question-header'>
          Question {currentQuestionIndex + 1} of {questionsData.length}
        </h2>
        <p className='question'>
          {questionsData.length &&
            questionsData[currentQuestionIndex].question.replace(
              /(&quot;)/g,
              '"'
            )}
        </p>
        {options.length &&
          options.map((option) => (
            <li className='answer-list' key={uuidv4()}>
              <button
                className={
                  selectedOption === option
                    ? 'answer-option selected'
                    : 'answer-option'
                }
                onClick={() => handleSelectOption(option)}
              >
                {option}
              </button>
            </li>
          ))}
        <p
          className={`question-difficulty ${
            questionsData.length &&
            questionsData[currentQuestionIndex].difficulty
          }`}
        >
          {questionsData.length &&
            questionsData[currentQuestionIndex].difficulty}
        </p>
        <div className='check-answer-btn-wrapper'>
          <button
            className='check-answer-btn'
            onClick={handleCheckAnswer}
            disabled={selectedOption === '' || checkAnswerBtnClicked}
          >
            Check Answer
          </button>
        </div>
      </div>
      <div className='answer-result-wrapper'>
        {userIsCorrect && checkAnswerBtnClicked && (
          <p className='correct-answer'>You are correct!</p>
        )}
        {checkAnswerBtnClicked && !userIsCorrect && (
          <p className='incorrect-answer'>
            Sorry, the correct answer is{' '}
            {questionsData.length &&
              questionsData[currentQuestionIndex].correct_answer}{' '}
          </p>
        )}
      </div>
      <div className='button-controls'>
        <button
          className='prev-btn'
          onClick={handlePrevBtnClick}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          className='next-btn'
          onClick={handleNextBtnClick}
          disabled={currentQuestionIndex === 9 || selectedOption === ''}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Quiz;
