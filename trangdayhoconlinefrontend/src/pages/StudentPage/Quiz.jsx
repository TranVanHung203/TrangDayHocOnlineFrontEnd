import React, { useState, useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js';
import "../../css/Quiz.css";
import RestClient from '../../client-api/rest-client';

const SECRET_KEY = 'my-very-secret-key';

// Hàm mã hóa dữ liệu
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Hàm giải mã dữ liệu
const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    console.error('Failed to decrypt data:', e);
    return null;
  }
};

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const questionRefs = useRef([]);
  
  const quizId = window.location.href.split('/').pop();

  // Lấy dữ liệu từ API
  useEffect(() => {
    const restClient = new RestClient();
    restClient.service('quizzes/start')
      .findById(quizId)
      .then((data) => {
        if (data && data.questions && data.questions.length > 0) {
          setQuizData(data);

          // Thiết lập `quizEndTime` nếu chưa tồn tại
          const storedEndTime = localStorage.getItem('quizEndTime');
          if (!storedEndTime) {
            const endTime = Date.now() + data.number * 60 * 1000;
            localStorage.setItem('quizEndTime', encryptData(endTime));
          }
        } else {
          setLoadError('Không tìm thấy dữ liệu!');
        }
      })
      .catch((error) => {
        console.error('Error fetching quiz data:', error);
        setLoadError('Không thể tải dữ liệu câu hỏi. Vui lòng thử lại sau.');
      });
  }, [quizId]);

  // Cập nhật bộ đếm thời gian
  useEffect(() => {
    const updateTimer = () => {
      const encryptedEndTime = localStorage.getItem('quizEndTime');
      const endTime = encryptedEndTime ? decryptData(encryptedEndTime) : null;

      if (!endTime) {
        // Nếu `quizEndTime` không tồn tại hoặc bị sửa, tự động nộp bài
        if (!hasSubmitted && !isSubmitting && quizData) {
          console.warn('quizEndTime bị xóa hoặc chỉnh sửa. Tự động nộp bài.');
          handleSubmit();
        }
        return;
      }

      const remainingTime = Math.max(0, endTime - Date.now());
      if (remainingTime <= 0) {
        setIsTimeUp(true);
        setTimeLeft(0);
        if (!hasSubmitted && !isSubmitting && quizData) {
          handleSubmit();
        }
      } else {
        setTimeLeft(Math.floor(remainingTime / 1000));
      }
    };

    updateTimer();
    const countdown = setInterval(updateTimer, 1000);

    return () => clearInterval(countdown);
  }, [isSubmitting, hasSubmitted, quizData]);

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

  const handleSubmit = async () => {
    if (isSubmitting || hasSubmitted || !quizData || !quizData.questions) return;

    setIsSubmitting(true);
    setHasSubmitted(true);

    const restClient = new RestClient();
    let startTime = localStorage.getItem('startTime');

    if (startTime) {
      const startDate = new Date(startTime);
      startDate.setHours(startDate.getHours() + 7);
      startTime = startDate.toISOString();
    }

    const answers = quizData.questions.map((question) => ({
      questionId: question.questionId,
      answerId: selectedAnswers[question.questionId] || ""
    }));

    const submissionData = {
      answers,
      startTime
    };

    try {
      await restClient.service(`quizzes/submit/${quizId}`).submitQuiz(submissionData);
      localStorage.clear();
      window.location.href = `http://localhost:3000/quizzes/${quizId}`;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
      setHasSubmitted(false);
    }
  };

  if (loadError) {
    return <div>{loadError}</div>;
  }

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
              <button className="flag-button" onClick={() => toggleFlag(question.questionId)}>
                {flaggedQuestions.includes(question.questionId) ? 'Bỏ Cờ' : 'Đánh Dấu'}
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
        <button className="submit-button" onClick={handleSubmit} disabled={isTimeUp || isSubmitting}>
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default Quiz;
