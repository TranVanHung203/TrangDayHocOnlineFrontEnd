import React, { useState, useEffect, useCallback } from 'react';
import RestClient from '../../client-api/rest-client.js';
import styles from '../../css/QuizOverview.module.css'; // Import CSS module

const client = new RestClient().service('quizzes'); // Đường dẫn quizzes

const formatDateVN = (date) => {
  const dateObj = new Date(date);
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getUTCSeconds();
  const day = dateObj.getUTCDate();
  const month = dateObj.getUTCMonth() + 1;
  const year = dateObj.getUTCFullYear();

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ngày ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
};

const convertUTCToVN = (utcDate) => {
  const dateObj = new Date(utcDate);
  const vnOffset = 7 * 60;
  dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset() + vnOffset);
  return dateObj;
};

const QuizOverview = () => {
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);

  const getQuizIdFromUrl = () => {
    const path = window.location.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  const quizId = getQuizIdFromUrl();

  const fetchQuizData = useCallback(async (id) => {
    try {
      const data = await client.findById(id);
      if (data && data.name) {
        setQuizData(data);
      } else {
        setError('Không có dữ liệu quiz, vui lòng kiểm tra lại quyền truy cập.');
      }
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      if (error.response && error.response.status === 401) {
        setError('Bạn không có quyền truy cập vào quiz này.');
      } else {
        setError('Đã xảy ra lỗi khi tải quiz. Vui lòng thử lại sau.');
      }
    }
  }, []);

  useEffect(() => {
    fetchQuizData(quizId);
  }, [fetchQuizData, quizId]);

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (!quizData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const startDeadline = formatDateVN(quizData.start_deadline);
  const endDeadline = formatDateVN(quizData.end_deadline);

  const currentDate = new Date();
  const startDeadlines = convertUTCToVN(quizData.start_deadline);
  startDeadlines.setHours(startDeadlines.getHours() - 7);
  const endDeadlines = convertUTCToVN(quizData.end_deadline);
  endDeadlines.setHours(endDeadlines.getHours() - 7);
  const isAvailable = currentDate.getTime() >= startDeadlines.getTime() && currentDate.getTime() <= endDeadlines.getTime();

  const handleGoHome = () => {
    window.location.href = '/mycourses';
  };

  const handleStartQuiz = () => {
    window.location.href = `http://localhost:3000/quizzes/start/${quizId}`;
  };

  return (
    <div className={styles.quizOverviewContainer}>
      <div className={styles.quizCard}>
        <h1 className={styles.quizTitle}>{quizData.name}</h1>
        <div className={styles.quizInfo}>
          <p><strong>Thời gian làm bài:</strong> {quizData.number} Phút</p>
          <p><strong>Minimum Pass Score:</strong> {quizData.min_pass_score}</p>
          <p><strong>Start Deadline:</strong> {startDeadline}</p>
          <p><strong>End Deadline:</strong> {endDeadline}</p>
          <p><strong>Status:</strong> {quizData.attemptTime != null ? 'Completed' : 'Not Attempted'}</p>
          {quizData.attemptTime != null && (
            <p><strong>Date and Time:</strong> {new Date(new Date(quizData.attemptTime).getTime() - 7 * 60 * 60 * 1000).toLocaleString()}</p>
          )}
          {quizData.attemptTime != null && (
            <p><strong>Score:</strong> {quizData.score}</p>
          )}
        </div>

        <button
          className={`${styles.startBtn} ${(!isAvailable || quizData.attemptTime) ? styles.disabled : ''}`}
          disabled={!isAvailable || quizData.attemptTime}
          onClick={handleStartQuiz}
        >
          {quizData.attemptTime ? 'Completed' : (isAvailable ? 'Start Quiz' : 'Quiz Time Not Available')}
        </button>
        <button className={styles.homeBtn} onClick={handleGoHome}>
          My courses
        </button>
      </div>
    </div>
  );
};

export default QuizOverview;
