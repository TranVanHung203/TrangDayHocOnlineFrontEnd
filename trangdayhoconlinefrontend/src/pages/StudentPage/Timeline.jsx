import React, { useState, useEffect } from 'react';
import "../../css/Timeline.css";
import HeaderStudent from '../../components/Header/HeaderStudent';
import RestClient from '../../client-api/rest-client';

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

const Timeline = () => {
  const [data, setData] = useState({
    quizzes: [],
    message: 'Loading upcoming quizzes...',
    currentPage: 1,
    totalPages: 1,
  });
  const [daysAhead, setDaysAhead] = useState(2);
  const [sortOrder, setSortOrder] = useState('asc');
  const [quizzesPerPage, setQuizzesPerPage] = useState(3);

  const restClient = new RestClient();

  // Fetch quizzes with days, page, and limit based on quizzesPerPage
  const fetchQuizzes = async (days, page = 1) => {
    try {
      const response = await restClient.service("notify/timeline").find({
        days,
        page,
        limit: quizzesPerPage,
      });
      setData(response);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setData({
        quizzes: [],
        message: 'Error loading quizzes.',
        currentPage: 1,
        totalPages: 1,
      });
    }
  };

  useEffect(() => {
    fetchQuizzes(daysAhead, 1);
  }, [daysAhead, quizzesPerPage]);

  const handleDaysChange = (event) => {
    setDaysAhead(event.target.value);
  };

  const handleQuizzesPerPageChange = (event) => {
    setQuizzesPerPage(parseInt(event.target.value, 10));
  };

  const sortQuizzes = (order) => {
    const sortedQuizzes = [...data.quizzes].sort((a, b) => {
      const dateA = new Date(a.end_deadline);
      const dateB = new Date(b.end_deadline);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setData({ ...data, quizzes: sortedQuizzes });
  };

  const handleSortChange = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortQuizzes(newOrder);
  };

  const paginate = (pageNumber) => {
    fetchQuizzes(daysAhead, pageNumber);
  };

  return (
    <div className="timeline-page">
      <HeaderStudent />

      <div className="timeline-container">
        <h1>📅 Upcoming Quizzes Timeline</h1>
        <p className="message">{data.message}</p>

        <div className="controls">
          <label htmlFor="days-select">View upcoming quizzes for:</label>
          <select id="days-select" value={daysAhead} onChange={handleDaysChange}>
            {[1, 2, 3, 5, 7, 10, 30].map((day) => (
              <option key={day} value={day}>{day} day{day > 1 ? 's' : ''}</option>
            ))}
          </select>

          <label htmlFor="quizzes-per-page-select">Items per page:</label>
          <select
            id="quizzes-per-page-select"
            value={quizzesPerPage}
            onChange={handleQuizzesPerPageChange}
          >
            {[1, 3, 5, 7, 9].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <button onClick={handleSortChange} className="sort-button">
          Sort by Deadline: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>

        <div className="quizzes-list-horizontal">
          {data.quizzes.length > 0 ? (
            data.quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="quiz-card-horizontal"
                onClick={() => window.location.href = `http://localhost:3000/quizzes/${quiz.id}`}
              >
                <div className="card-header">
                  <h2>{quiz.name}</h2>
                </div>
                <div className="card-body">
                <p>
                    <strong>Start Deadline:</strong>{' '}
                    {formatDateVN(quiz.start_deadline)}
                  </p>
                  <p>
                    <strong>End Deadline:</strong>{' '}
                    {formatDateVN(quiz.end_deadline)}
                  </p>
                  <p className="time-remaining">
                    ⏳ Time Remaining: {quiz.time_remaining}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No upcoming quizzes found.</p>
          )}
        </div>

        <div className="pagination">
          {Array.from({ length: data.totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`page-button ${data.currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
