import "../../css/QuizOverview.css";
import React, { useState, useEffect, useCallback } from 'react';
import RestClient from '../../client-api/rest-client.js';

const client = new RestClient().service('quizzes'); // Đường dẫn quizzes

const QuizOverview = () => {
  const [quizData, setQuizData] = useState(null);
  
  const quizId = "672b2ec2e50a98a089c54b7b"; // ID quiz

  const fetchQuizData = useCallback(async (id) => {
    try {
      // Truyền id vào URL
      const data = await client.find(id); // Gọi API với id
      setQuizData(data);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  }, []);

  useEffect(() => {
    fetchQuizData(quizId); // Gọi API khi component được render
  }, [fetchQuizData]);

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f2f5', padding: '50px', color: '#333' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#333' }}>{quizData.name}</h1>
      <p><strong>Quiz Number:</strong> {quizData.number}</p>
      <p><strong>Minimum Pass Score:</strong> {quizData.min_pass_score}</p>
      <p><strong>Start Deadline:</strong> {new Date(quizData.start_deadline).toLocaleString()}</p>
      <p><strong>End Deadline:</strong> {new Date(quizData.end_deadline).toLocaleString()}</p>
      <p>
        <strong>Status:</strong> {quizData.score && quizData.attemptTime ? 'Completed' : 'Not Attempted'}
      </p>
      {quizData.score && quizData.attemptTime && (
        <>
          <p><strong>Score:</strong> {quizData.score}</p>
          <p><strong>Last Attempt Time:</strong> {new Date(quizData.attemptTime).toLocaleString()}</p>
        </>
      )}
    </div>
  );
};

export default QuizOverview;
