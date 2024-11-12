import React, { useState, useEffect, useRef } from 'react';
import "../../css/Quiz.css";
import RestClient from '../../client-api/rest-client';

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const questionRefs = useRef([]);

  const quizId = window.location.href.split('/').pop();
  const totalSeconds = quizData ? quizData.number * 60 : 0;

  useEffect(() => {
    const restClient = new RestClient();
    restClient.service('quizzes/start')
      .findById(quizId)
      .then((data) => {
        setQuizData(data);
        setTimeLeft(data.number * 60);
      })
      .catch((error) => console.error('Error fetching quiz data:', error));
  }, [quizId]);

  useEffect(() => {
    if (quizData && totalSeconds > 0) {
      let countdown = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdown);
            setIsTimeUp(true);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [quizData, totalSeconds]);

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));

    if (!answeredQuestions.includes(questionId)) {
      setAnsweredQuestions((prevAnswered) => [...prevAnswered, questionId]);
    }
  };

  const toggleFlag = (questionId) => {
    setFlaggedQuestions((prevFlags) => {
      if (prevFlags.includes(questionId)) {
        return prevFlags.filter((id) => id !== questionId);
      } else {
        return [...prevFlags, questionId];
      }
    });
  };

  const handleScrollToQuestion = (index) => {
    questionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = () => {
    console.log('Selected Answers:', selectedAnswers);
    console.log('Flagged Questions:', flaggedQuestions);
    alert('Quiz submitted!');
  };

  if (!quizData) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="quiz-container">
      <h1>{quizData.name}</h1>
      <div className="timer">
        <h3>Time Left: {formatTime(timeLeft)}</h3>
      </div>

      <div className="quiz-layout">
        <div className="sidebar">
          {quizData.questions && quizData.questions.map((_, index) => (
            <div
              key={index}
              className={`sidebar-item 
                ${flaggedQuestions.includes(quizData.questions[index].questionId) ? 'flagged' : ''} 
                ${answeredQuestions.includes(quizData.questions[index].questionId) ? 'answered' : ''}`}
              onClick={() => handleScrollToQuestion(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <div className="questions">
          {quizData.questions && quizData.questions.map((question, index) => (
            <div
              key={question.questionId}
              ref={(el) => (questionRefs.current[index] = el)}
              className="question-section"
            >
              <h2>{index + 1}. {question.questionTitle}</h2>
              <button
                className={`flag-button ${flaggedQuestions.includes(question.questionId) ? 'flagged' : ''}`}
                onClick={() => toggleFlag(question.questionId)}
              >
                {flaggedQuestions.includes(question.questionId) ? 'Unflag' : 'Flag'}
              </button>
              <ul>
                {question.answers.map((answer) => (
                  <li key={answer.answerId}>
                    <label>
                      <input
                        type="radio"
                        name={question.questionId}
                        value={answer.answerId}
                        checked={selectedAnswers[question.questionId] === answer.answerId}
                        onChange={() => handleAnswerSelect(question.questionId, answer.answerId)}
                      />
                      {answer.answerText}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="submit-section">
        <button className="submit-button" onClick={handleSubmit} disabled={isTimeUp}>
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default Quiz;
