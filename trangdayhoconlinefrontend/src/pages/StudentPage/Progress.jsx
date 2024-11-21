import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RestClient from '../../client-api/rest-client.js';
import HeaderStudent from '../../components/Header/HeaderStudent.jsx';
import "../../css/STProgress.css";
import Swal from 'sweetalert2';

const Progress = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [courseLoading, setCourseLoading] = useState(true);
    const [quizLoading, setQuizLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            setCourseLoading(true);
            try {
                const client = new RestClient();
                const data = await client.findCourseById(courseId);
                if (data) {
                    setCourse(data);
                } else {
                    Swal.fire('Thông báo', 'Không tìm thấy thông tin khóa học.', 'info');
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin khóa học:', error);
                Swal.fire('Lỗi', 'Không thể tải dữ liệu khóa học. Vui lòng thử lại.', 'error');
            } finally {
                setCourseLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            setQuizLoading(true);
            const client = new RestClient();
            try {
                const response = await client.getQuizzesForStudent(courseId);
                if (response?.quizzes) {
                    setQuizzes(response.quizzes);
                } else {
                    throw new Error('No quizzes found for this course');
                }
            } catch (err) {
                setError(err.message || 'Failed to load quizzes');
            } finally {
                setQuizLoading(false);
            }
        };

        fetchQuizzes();
    }, [courseId]);
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
    if (courseLoading || quizLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className="container">
            <div className="header-wrapper">
                <HeaderStudent />
            </div>
            <div className="header-section">
                {course ? (
                    <>
                        <h1>{course.name}</h1>
                        <div className="dates">
                            <p>Ngày bắt đầu: {course.start_day ? new Date(course.start_day).toLocaleDateString() : "N/A"}</p>
                            <p>Ngày kết thúc: {course.end_day ? new Date(course.end_day).toLocaleDateString() : "N/A"}</p>
                        </div>
                    </>
                ) : (
                    <p>Không tìm thấy thông tin khóa học.</p>
                )}
            </div>
            <div className="content">
                <h1>Quizzes Progress</h1>
                {quizzes.length > 0 ? (
                    <table className="quiz-table">
                        <thead>
                            <tr>
                                <th>Tên quiz</th>
                                <th>Điểm đạt được</th>
                                <th>Điểm tối thiểu</th>
                                <th>Thời gian bắt đầu làm</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map(quiz => (
                                <tr key={quiz.id}>
                                    <td>{quiz.name}</td>
                                    <td>{quiz.diem}</td>
                                    <td>{quiz.min_pass_score}</td>
                                    <td>{formatDateVN(quiz.thoigianlambai)}</td>
                                    <td>
                                        {quiz.diem >= quiz.min_pass_score ? (
                                            <span className="status-pass">Pass</span>
                                        ) : (
                                            <span className="status-fail">Fail</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No quizzes available for this course</p>
                )}
            </div>
        </div>
    );
};

export default Progress;
