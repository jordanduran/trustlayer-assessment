import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Leaderboard from './Leaderboard';

const Quiz = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [userIsCorrect, setUserIsCorrect] = useState(false);
  const [checkAnswerBtnClicked, setCheckAnswerBtnClicked] = useState(false);
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

  useEffect(() => {
    const data = userData && userData;
    window.localStorage.setItem('users', JSON.stringify(data));
  }, [userData]);

  // Creating an array combining correct answer and incorrect answers then randomly sorting it

  const handleSelectOption = (userSelectedOption) => {
    setSelectedOption(userSelectedOption);
  };

  const handleCheckAnswer = () => {
    setCheckAnswerBtnClicked(true);
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
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleNextBtnClick = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOption('');
    setCheckAnswerBtnClicked(false);
    setUserIsCorrect(false);
  };

  const handleSaveScore = () => {
    setUserSave(true);
  };

  const handleUserInputChange = (e) => {
    setUser(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setPassword(e.target.value);
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
    ].slice(0, 9);
    setLeaderboardUsers(updatedLeaderboard);
    setUser('');
    setPassword('');
  };

  const handleRestart = () => {
    window.location.reload();
  };

  if (!gameOver) {
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
                  disabled={checkAnswerBtnClicked}
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
        <span className='quiz-score'>Score: {score}</span>
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
        <p className='final-score'>Your final score is {score}</p>
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
              <button className='save-btn yes' onClick={handleSaveScore}>
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
                onChange={handleUserInputChange}
              />
              <label>Password:</label>
              <input
                type='password'
                name='password'
                className='password-input'
                required
                value={password}
                onChange={handlePasswordInputChange}
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
            <button className='restart-btn' onClick={handleRestart}>
              Start a new Quiz
            </button>
          </div>
        ) : null}
        <h1 className='highscore-header'>LEADERBOARD</h1>

        <Leaderboard users={leaderboardUsers} />
      </div>
    );
  }
};

export default Quiz;
