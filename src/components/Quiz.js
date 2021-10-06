import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Leaderboard from './Leaderboard';

const Quiz = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(9);
  const [previousQuestionIndex, setPreviousQuestionIndex] = useState(0);
  const [firstQuestionAnswered, setFirstQuestionAnswered] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [userIsCorrect, setUserIsCorrect] = useState(false);
  const [checkAnswerBtnClicked, setCheckAnswerBtnClicked] = useState(false);
  const [answersCorrect, setAnswersCorrect] = useState(0);
  const [prevBtnClicked, setPrevBtnClicked] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [userSave, setUserSave] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(() => {
    const users = localStorage.getItem('users');
    return users !== null ? JSON.parse(users) : [];
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);
  const [noBtnClicked, setNoBtnClicked] = useState(false);
  const [refreshBtnClicked, setRefreshBtnClicked] = useState(false);

  // Fetch data from API on component mount

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10')
      .then((response) => response.json())
      .then((data) => setQuestionsData(data.results))
      .catch((error) => console.error(error));
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

  // On last question, once answer is checked the game is over after 3 seconds

  useEffect(() => {
    if (currentQuestionIndex === 9 && checkAnswerBtnClicked) {
      const timer = setTimeout(() => {
        setGameOver(true);
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentQuestionIndex, checkAnswerBtnClicked, gameOver]);

  // Storing user data in localStorage

  useEffect(() => {
    const data = userData && userData;
    window.localStorage.setItem('users', JSON.stringify(data));
  }, [userData, refreshBtnClicked]);

  // Adds points according to difficulty of question

  const handleCheckAnswer = () => {
    setCheckAnswerBtnClicked(true);
    if (currentQuestionIndex === 0) {
      setFirstQuestionAnswered(true);
      setAnswersCorrect(answersCorrect + 1);
    }
    if (selectedOption === questionsData[currentQuestionIndex].correct_answer) {
      setUserIsCorrect(true);
      if (questionsData[currentQuestionIndex].difficulty === 'easy') {
        setScore(score + 1);
      } else if (questionsData[currentQuestionIndex].difficulty === 'medium') {
        setScore(score + 2);
      } else if (questionsData[currentQuestionIndex].difficulty === 'hard') {
        setScore(score + 3);
      }
    }
  };

  const handlePrevBtnClick = () => {
    setPrevBtnClicked(true);
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setCheckAnswerBtnClicked(true);
  };

  const handleNextBtnClick = () => {
    setAnsweredQuestions([
      ...answeredQuestions,
      questionsData[currentQuestionIndex],
    ]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setPreviousQuestionIndex(currentQuestionIndex);
    setSelectedOption('');
    setCheckAnswerBtnClicked(false);
    setUserIsCorrect(false);
    setPrevBtnClicked(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setUserData([
      ...userData,
      {
        user,
        password,
        score,
        date: new Date().toLocaleString().split(',')[0],
      },
    ]);
    const updatedLeaderboard = [
      ...leaderboardUsers,
      {
        user,
        password,
      },
    ];
    setLeaderboardUsers(updatedLeaderboard);
    setUser('');
    setPassword('');
  };

  if (!gameOver) {
    return (
      <div className='quiz-container'>
        <h1>Random Quiz</h1>
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
                  onClick={() => setSelectedOption(option)}
                  disabled={
                    checkAnswerBtnClicked ||
                    prevBtnClicked ||
                    (firstQuestionAnswered && currentQuestionIndex === 0)
                  }
                >
                  {option.replace(/(&quot;)/g, '"')}
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

          <button
            className='check-answer-btn'
            onClick={handleCheckAnswer}
            disabled={selectedOption === '' || checkAnswerBtnClicked}
          >
            Check Answer
          </button>
        </div>
        <div className='answer-result-wrapper'>
          {userIsCorrect && checkAnswerBtnClicked && !prevBtnClicked && (
            <p className='correct-answer'>You are correct!</p>
          )}
          {checkAnswerBtnClicked && !userIsCorrect && !prevBtnClicked && (
            <p className='incorrect-answer'>
              Sorry, the correct answer is{' '}
              {questionsData.length &&
                questionsData[currentQuestionIndex].correct_answer.replace(
                  /(&quot;)/g,
                  '"'
                )}{' '}
            </p>
          )}
        </div>
        <span className='quiz-score'>Score: {score}</span>
        <div className='button-controls'>
          <button
            className='prev-btn'
            onClick={handlePrevBtnClick}
            disabled={
              currentQuestionIndex === 0 ||
              previousQuestionIndex === currentQuestionIndex ||
              checkAnswerBtnClicked
            }
          >
            Previous
          </button>
          <button
            className='next-btn'
            onClick={handleNextBtnClick}
            disabled={currentQuestionIndex === 9 || !checkAnswerBtnClicked}
          >
            Next
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className='game-over-container'>
        <h1 className='game-over-header'>Game Over</h1>
        <p className='final-result'>Your final score is {score}</p>
        <p className='final-result'>
          You got {answersCorrect}/{questionsData.length} answers correct
        </p>
        {!userSave && !noBtnClicked && (
          <div className='game-over-form-container'>
            <p className='save-score-header'>
              Would you like to save your score?
            </p>
            <div className='save-controls'>
              <button
                className='save-btn no'
                onClick={() => setNoBtnClicked(true)}
              >
                No
              </button>
              <button
                className='save-btn yes'
                onClick={() => setUserSave(true)}
              >
                Yes
              </button>
            </div>
          </div>
        )}
        {userSave && !formSubmitted && (
          <div className='save-form-container'>
            <form className='save-form' onSubmit={handleSubmit}>
              <label>Username:</label>
              <input
                type='text'
                name='user'
                className='user-input'
                required
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <label>Password:</label>
              <input
                type='password'
                name='password'
                className='password-input'
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className='submit-btn' type='submit'>
                Submit
              </button>
            </form>
          </div>
        )}
        {noBtnClicked || formSubmitted ? (
          <div className='play-again-container'>
            <p className='thanks-text'>Thank you for playing!</p>
            <button
              className='restart-btn'
              onClick={() => window.location.reload()}
            >
              Start a new Quiz
            </button>
          </div>
        ) : null}
        <h1 className='highscore-header'>LEADERBOARD</h1>

        <Leaderboard users={leaderboardUsers} />
        {formSubmitted && (
          <div>
            <button
              className='refresh-btn'
              onClick={() => setRefreshBtnClicked(true)}
            >
              Refresh Leaderboard
            </button>
          </div>
        )}
      </div>
    );
  }
};

export default Quiz;
