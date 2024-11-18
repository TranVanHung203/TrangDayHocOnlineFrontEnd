import React, { useState, useEffect, useCallback } from 'react';
import RestClient from '../../client-api/rest-client.js';
import "../../css/QuizOverview.css"; // Thêm CSS cho QuizOverview

const client = new RestClient().service('quizzes'); // Đường dẫn quizzes

const formatDateVN = (date) => {
  const dateObj = new Date(date);
  const hours = dateObj.getUTCHours(); // Lấy giờ theo UTC
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getUTCSeconds();
  const day = dateObj.getUTCDate();
  const month = dateObj.getUTCMonth() + 1; // Tháng bắt đầu từ 0, phải cộng 1
  const year = dateObj.getUTCFullYear();

  // Định dạng "10:00:00 ngày 10/12/2024"
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ngày ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
};

const convertUTCToVN = (utcDate) => {
  // Tạo đối tượng Date từ UTC
  const dateObj = new Date(utcDate);

  // Lấy giờ gốc và chuyển thành giờ Việt Nam, không cộng thêm 7
  const vnOffset = 7 * 60; // Múi giờ Việt Nam = UTC + 7, nhưng không cộng vào giờ gốc.

  // Trả lại thời gian nhưng giữ nguyên giờ
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
    return <div className="error-message">{error}</div>;
  }

  if (!quizData) {
    return <div className="loading">Loading...</div>;
  }

  const startDeadline = formatDateVN(quizData.start_deadline);
  const endDeadline = formatDateVN(quizData.end_deadline);

  // Kiểm tra thời gian hiện tại với start_deadline và end_deadline
  const currentDate = new Date(); // Thời gian hiện tại theo múi giờ hệ thống

  // Chuyển đổi start_deadline và end_deadline từ UTC sang giờ Việt Nam
  const startDeadlines = convertUTCToVN(quizData.start_deadline);
  const endDeadlines = convertUTCToVN(quizData.end_deadline);
  const isAvailable = currentDate.getTime() >= startDeadlines.getTime() && currentDate.getTime() <= endDeadlines.getTime();
  const handleGoHome = () => {
    window.location.href = '/mycourses';
  };
  // Hàm xử lý khi nhấn nút "Start Quiz"
  const handleStartQuiz = () => {
    window.location.href = `http://localhost:3000/quizzes/start/${quizId}`;
  };

  return (
    <div className="quiz-overview-container">
      <div className="quiz-card">
        <h1 className="quiz-title">{quizData.name}</h1>
        <div className="quiz-info">
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

        {/* Nếu đã hoàn thành, làm mờ và vô hiệu nút Start */}
        <button
          className={`start-btn ${(!isAvailable || quizData.attemptTime) ? 'disabled' : ''}`}
          disabled={!isAvailable || quizData.attemptTime}
          onClick={handleStartQuiz}
        >
          {quizData.attemptTime ? 'Completed' : (isAvailable ? 'Start Quiz' : 'Quiz Time Not Available')}
        </button>
        <button className="home-btn" onClick={handleGoHome}>
            My courses
          </button>
      </div>
    </div>
  );
};

export default QuizOverview;
