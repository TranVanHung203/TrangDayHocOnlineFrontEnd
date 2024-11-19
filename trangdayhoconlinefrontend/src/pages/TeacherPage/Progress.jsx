import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RestClient from '../../client-api/rest-client.js';
import HeaderTeacher from '../../components/Header/HeaderTeacher';
import Swal from 'sweetalert2';
import '../../css/Progress.css';

const Progress = () => {
    const { courseId } = useParams(); // Lấy courseId từ URL
    const [quizzes, setQuizzes] = useState([]); // Danh sách quiz
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [expandedQuizId, setExpandedQuizId] = useState(null); // ID quiz đang được mở rộng
    const [progressLoading, setProgressLoading] = useState(false); // Trạng thái loading tiến độ
    const [quizProgress, setQuizProgress] = useState({}); // Tiến độ cho từng quiz (theo ID)
    const [searchTerm, setSearchTerm] = useState(''); // Lưu trữ từ khóa tìm kiếm
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang

    const PAGE_GROUP_SIZE = 10; // Số lượng trang trong một nhóm

    // Fetch danh sách quiz
    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            try {
                const client = new RestClient();
                const data = await client.getAllQuizzes(courseId);

                if (data && Array.isArray(data.quizzes)) {
                    setQuizzes(data.quizzes);
                } else {
                    setQuizzes([]);
                    Swal.fire('Thông báo', 'Không có quiz nào được tìm thấy.', 'info');
                }
            } catch (error) {
                setQuizzes([]);
                Swal.fire('Lỗi', 'Không thể tải quiz. Vui lòng thử lại.', 'error');
                console.error('Lỗi khi tải quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [courseId]);

    // Fetch tiến độ học tập của sinh viên theo quiz ID
    const fetchStudentProgress = async (quizId, page = 1, search = '') => {
        setProgressLoading(true);
        try {
            const client = new RestClient();
            const data = await client.getStudentProgress(quizId, { page, limit: 5, search });

            if (data && Array.isArray(data.studentProgress)) {
                setQuizProgress((prev) => ({ ...prev, [quizId]: data.studentProgress }));
                setCurrentPage(data.currentPage || 1);
                setTotalPages(data.totalPages || 1);
            } else {
                setQuizProgress((prev) => ({ ...prev, [quizId]: [] }));
                Swal.fire('Thông báo', 'Không có tiến độ nào được tìm thấy.', 'info');
            }
        } catch (error) {
            setQuizProgress((prev) => ({ ...prev, [quizId]: [] }));
            Swal.fire('Lỗi', 'Không thể tải tiến độ. Vui lòng thử lại.', 'error');
            console.error('Lỗi khi tải tiến độ:', error);
        } finally {
            setProgressLoading(false);
        }
    };

    // Xử lý khi nhấn vào một quiz
    const handleQuizClick = (quizId) => {
        if (expandedQuizId === quizId) {
            // Nếu quiz đang mở rộng, thu gọn nó
            setExpandedQuizId(null);
        } else {
            // Mở rộng quiz mới và fetch dữ liệu nếu chưa có
            setExpandedQuizId(quizId);
            if (!quizProgress[quizId]) {
                fetchStudentProgress(quizId, 1, searchTerm);
            }
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (expandedQuizId) {
            fetchStudentProgress(expandedQuizId, 1, value); // Tìm kiếm lại với từ khóa mới
        }
    };

    // Xác định phạm vi nhóm trang hiện tại
    const getPageGroupRange = (currentPage, pageGroupSize, totalPages) => {
        const startPage = Math.floor((currentPage - 1) / pageGroupSize) * pageGroupSize + 1;
        const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
        return { startPage, endPage };
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        // Lấy nhóm trang hiện tại
        const { startPage, endPage } = getPageGroupRange(currentPage, PAGE_GROUP_SIZE, totalPages);

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`page-button ${i === currentPage ? 'active' : ''}`}
                    onClick={() => fetchStudentProgress(expandedQuizId, i, searchTerm)}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="pagination-controls">

                <button
                    disabled={currentPage === 1}
                    onClick={() => fetchStudentProgress(expandedQuizId, currentPage - 1, searchTerm)}
                >
                    Trang trước
                </button>
                {/* Nút để chuyển sang nhóm trước */}
                {startPage > 1 && (
                    <button
                        onClick={() =>
                            fetchStudentProgress(
                                expandedQuizId,
                                Math.max(startPage - 1, 1),
                                searchTerm
                            )
                        }
                    >
                        ...
                    </button>
                )}


                {/* Các nút trang trong nhóm hiện tại */}
                {pages}


                {/* Nút để chuyển sang nhóm tiếp theo */}
                {endPage < totalPages && (
                    <button
                        onClick={() =>
                            fetchStudentProgress(
                                expandedQuizId,
                                Math.min(endPage + 1, totalPages),
                                searchTerm
                            )
                        }
                    >
                        ...
                    </button>
                )}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => fetchStudentProgress(expandedQuizId, currentPage + 1, searchTerm)}
                >
                    Trang sau
                </button>
            </div>
        );
    };

    return (
        <div>
            <HeaderTeacher />

            <h1 className="progress-title">Danh sách Quiz</h1>

            {loading ? ( // Hiển thị trạng thái loading
                <p>Đang tải dữ liệu...</p>
            ) : quizzes.length > 0 ? (
                <ul className="quiz-list">
                    {quizzes.map((quiz) => (
                        <li key={quiz._id} className="quiz-item">
                            {/* Quiz title */}
                            <div
                                className="quiz-title-1"
                                onClick={() => handleQuizClick(quiz._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="quiz-name">{quiz.name || 'Không có tên'}</span>
                                <span
                                    className={`quiz-toggle ${expandedQuizId === quiz._id ? 'expanded' : 'collapsed'
                                        }`}
                                >
                                    ▼
                                </span>
                            </div>

                            {/* Student progress, chỉ hiển thị nếu quiz đang được mở rộng */}
                            {expandedQuizId === quiz._id && (
                                <div className="student-progress">
                                    {/* Thanh tìm kiếm */}
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên sinh viên..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="search-bar"
                                    />

                                    {progressLoading ? (
                                        <p>Đang tải tiến độ...</p>
                                    ) : quizProgress[quiz._id] &&
                                        quizProgress[quiz._id].length > 0 ? (
                                        <>
                                            <ul className="progress-list">
                                                {quizProgress[quiz._id].map((progress, index) => (
                                                    <li key={index} className="progress-item">
                                                        <p>
                                                            <strong>Sinh viên:</strong> {progress.student || 'Không rõ'}
                                                        </p>
                                                        <p>
                                                            <strong>Email:</strong> {progress.email || 'Không rõ'}
                                                        </p>
                                                        <p>
                                                            <strong>Điểm đạt được:</strong> {progress.scoreAchieved || 0}
                                                        </p>
                                                        <p>
                                                            <strong>Trạng thái:</strong>{' '}
                                                            {progress.checkPassed ? 'Đã đạt' : 'Chưa đạt'}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                            {/* Pagination controls */}
                                            {renderPagination()}
                                        </>
                                    ) : (
                                        <p>Không có tiến độ nào để hiển thị.</p>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có quiz nào để hiển thị.</p>
            )}
        </div>
    );
};

export default Progress;
