import RestClient from '../../client-api/rest-client.js';

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../css/CreatQuestionAndAnswer.module.css'; // Import CSS Module

const restClient = new RestClient();

const App = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [quizId, setQuizId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState('');
  const questionsPerPage = 2;

  const checkRole = async () => {
    try {
      restClient.service('getRole');
      const response = await restClient.find();
      if (response.role === 'Lecturer') {
        setHasAccess(true);
      } else {
        setError('Bạn không có quyền truy cập trang này!');
        setHasAccess(false);
      }
    } catch (err) {
      console.error('Lỗi khi kiểm tra quyền:', err);
      setError('Lỗi khi kiểm tra quyền truy cập!');
      setHasAccess(false);
    }
  };

  const validateQuestions = (data) => {
    return (
      data &&
      typeof data.quizId === 'string' &&
      Array.isArray(data.questions) &&
      typeof data.page === 'number' &&
      typeof data.totalPages === 'number'
    );
  };

  useEffect(() => {
    const url = window.location.href;
    const match = url.match(/\/QuestionAndAnswer\/([a-f0-9]{24})/);
    if (match) {
      setQuizId(match[1]);
    } else {
      toast.error('Quiz ID không hợp lệ');
    }
  }, []);

  useEffect(() => {
    checkRole();
  }, []);

  useEffect(() => {
    if (hasAccess && quizId) {
      fetchQuestions();
    }
  }, [hasAccess, quizId, currentPage]);

  const fetchQuestions = async () => {
    try {
      restClient.service(`quizzes/Q&A/${quizId}`);
      const response = await restClient.find({
        page: currentPage,
        limit: questionsPerPage,
      });
      if (validateQuestions(response)) {
        setQuestionsList(response.questions);
        setTotalPages(response.totalPages);
      } else {
        throw new Error('Dữ liệu không đúng định dạng!');
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách câu hỏi');
    }
  };

  const validateInputs = () => {
    if (question.trim() === '') {
      toast.warning('Câu hỏi không được để trống!');
      return false;
    }

    const answersArray = answers.split('\n').filter((answer) => answer.trim() !== '');
    if (answersArray.length === 0) {
      toast.warning('Phải có ít nhất một câu trả lời!');
      return false;
    }

    for (let ans of answersArray) {
      const [text, isCorrect] = ans.split('|');
      if (!text || text.trim() === '') {
        toast.warning('Mỗi câu trả lời phải có nội dung!');
        return false;
      }
      if (isCorrect === undefined || (isCorrect.trim() !== 'true' && isCorrect.trim() !== 'false')) {
        toast.warning('Định dạng câu trả lời sai! Hãy dùng định dạng Answer1|true hoặc Answer2|false');
        return false;
      }
    }

    return true;
  };

  const formatAnswers = () => {
    return answers
      .split('\n')
      .filter((answer) => answer.trim() !== '')
      .map((ans) => {
        const [text, isCorrect] = ans.split('|');
        return {
          answer_text: text.trim(),
          is_correct: isCorrect.trim() === 'true',
        };
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const data = {
      question_title: question,
      answers: formatAnswers(),
    };

    try {
      restClient.service(`quizzes/questions/answers/${quizId}`);
      if (editIndex !== null) {
        const questionId = questionsList[editIndex].question_id;
        restClient.service(`quizzes/${quizId}/${questionId}`);
        await restClient.patch(data);
        toast.success('Câu hỏi đã được cập nhật!');
      } else {
        const response = await restClient.create({ questions: [data] });
        if (response && response.length > 0) {
          const newQuestion = response[0].question;
          const newAnswers = response[0].answers;
          setQuestionsList([
            ...questionsList,
            {
              question_title: newQuestion.question_title,
              question_id: newQuestion._id,
              answers: newAnswers,
            },
          ]);
          toast.success('Câu hỏi và câu trả lời đã được lưu thành công!');
        } else {
          throw new Error('API không trả về dữ liệu đúng');
        }
      }
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleDelete = async (index) => {
    const questionId = questionsList[index].question_id;
    try {
      restClient.service(`quizzes/questions/${questionId}`);
      await restClient.delete();
      toast.success('Câu hỏi đã được xóa thành công!');
  
      // Quay lại trang đầu tiên
      setCurrentPage(1);
    } catch (error) {
      toast.error('Không thể xóa câu hỏi, vui lòng thử lại!');
    }
  };
  


  const handleEdit = (index) => {
    const questionToEdit = questionsList[index];
    setQuestion(questionToEdit.question_title);
    setAnswers(
      questionToEdit.answers
        .map((ans) => `${ans.answer_text}|${ans.is_correct ? 'true' : 'false'}`)
        .join('\n')
    );
    setEditIndex(index);
  };

  const resetForm = () => {
    setQuestion('');
    setAnswers('');
    setEditIndex(null);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!hasAccess || error) {
    return <div>{error || 'Bạn không có quyền truy cập!'}</div>;
  }

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.title}>Quản lý Câu hỏi & Trả lời</h1>
      <ToastContainer />
      <div className={styles.contentContainer}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <label className={styles.label}>Câu hỏi:</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Nhập câu hỏi của bạn"
              required
            />

            <label className={styles.label}>Câu trả lời (mỗi dòng là một câu trả lời, ví dụ: Paris|true):</label>
            <textarea
              rows="6"
              value={answers}
              onChange={(e) => setAnswers(e.target.value)}
              placeholder="Nhập câu trả lời, mỗi dòng là một câu trả lời (Answer|true/false)"
            ></textarea>

            <button type="submit" className={styles.button}>
              {editIndex !== null ? 'Cập nhật' : 'Lưu'}
            </button>
          </form>
        </div>

        <div className={styles.questionsListContainer}>
          <h2>Danh sách câu hỏi</h2>
          {questionsList.length === 0 ? (
            <p className={styles.noQuestions}>Chưa có câu hỏi nào được tạo.</p>
          ) : (
            questionsList.map((item, index) => (
              <div key={index} className={styles.questionItem}>
                <h3>{item.question_title}</h3>
                <ul>
                  {item.answers.map((answer, i) => (
                    <li key={i}>
                      {answer.answer_text} - {answer.is_correct ? 'Đúng' : 'Sai'}
                    </li>
                  ))}
                </ul>
                <div className={styles.buttons}>
                  <button onClick={() => handleEdit(index)} className={styles.button}>
                    Chỉnh sửa
                  </button>
                  <button onClick={() => handleDelete(index)} className={styles.button}>
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}

          <div className={styles.pagination}>
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              Trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
