import React, { useEffect, useState, useRef } from 'react';
import RestClient from '../../client-api/rest-client.js';
import '../../css/CoursePageStudent.css';
import { useParams } from 'react-router-dom';
import HeaderStudent from '../../components/Header/HeaderStudent';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify


const CoursePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [expandedModule, setExpandedModule] = useState(null);
    const [expandedModulesSection, setExpandedModulesSection] = useState(false);
    const [activeTab, setActiveTab] = useState('course'); // state to manage active tab
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);




    const fetchStudents = async (page = 1, limit = 10) => {
        setLoadingStudents(true);
        try {
            const client = new RestClient();
            const data = await client.findCourseStudents(courseId, page, limit);
            if (data && data.students) {
                setStudents(data.students);
                setTotalPages(data.totalPages || 1); // Cập nhật tổng số trang nếu server trả về
            } else {
                setStudents([]);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'members') {
            fetchStudents(currentPage);
        }
    }, [activeTab, currentPage]);

    const PAGE_GROUP_SIZE = 10; // Số trang hiển thị trong mỗi nhóm

    // Tính toán phạm vi trang
    const getPageGroupRange = (currentPage, pageGroupSize) => {
        const start = Math.floor((currentPage - 1) / pageGroupSize) * pageGroupSize + 1;
        const end = Math.min(start + pageGroupSize - 1, totalPages);
        return { start, end };
    };

    // Lấy nhóm trang hiện tại
    const { start: groupStart, end: groupEnd } = getPageGroupRange(currentPage, PAGE_GROUP_SIZE);






















    const [expandedQuizSection, setExpandedQuizSection] = useState(false);









    useEffect(() => {
        // Fetch dữ liệu khóa học chỉ khi đã xác nhận quyền truy cập
        const fetchCourseData = async () => {
            try {
                const client = new RestClient();
                const data = await client.findCourseById(courseId);

                if (data.error) {
                    window.location.href = "/notfound";
                }

                console.log('Dữ liệu khóa học nèeeee:');

                setCourseData(data);
            } catch (error) {
                console.error('Lỗi này nd3 đi po:', error);
                // Chuyển hướng đến trang "Not Found"
                window.location.href = "/notfound";
            } finally {
                setLoading(false); // Dừng trạng thái loading
            }
        };

        fetchCourseData();
    }, [courseId]);






    const toggleQuizSection = () => {
        setExpandedQuizSection((prev) => !prev);
    };






    const handleDownloadLesson = async (lessonId, name) => {
        try {
            const client = new RestClient();
            const result = await client.downloadLesson(lessonId, name);

            if (!result.success) {
                Swal.fire('Lỗi!', result.message, 'error');
            }
        } catch (error) {
            Swal.fire('Lỗi!', 'Không thể tải xuống file.', 'error');
            console.error('Download error:', error);
        }
    };


















    const toggleModule = (moduleId) => {
        setExpandedModule((prevModule) => (prevModule === moduleId ? null : moduleId));
    };

    const toggleModulesSection = () => {
        setExpandedModulesSection(!expandedModulesSection);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab); // Switch active tab
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!courseData) {
        return <div>No course data available.</div>;
    }

    return (
        <div className="container">
            <div className="content">
                <HeaderStudent />

                <div className="main-container">
                    <div className="header-section">
                        <h1>{courseData?.name || "Unknown Course"}</h1>
                        <div className="dates">
                            <p>Ngày bắt đầu: {courseData.start_day ? new Date(courseData.start_day).toLocaleDateString() : "N/A"}</p>
                            <p>Ngày kết thúc: {courseData.end_day ? new Date(courseData.end_day).toLocaleDateString() : "N/A"}</p>
                        </div>
                    </div>

                    <div className="tab-section">
                        <div
                            className={`tab ${activeTab === 'course' ? 'tab-active' : ''}`}
                            onClick={() => handleTabClick('course')}
                        >
                            <h3>Khóa học</h3>
                        </div>
                        <div
                            className={`tab ${activeTab === 'members' ? 'tab-active' : ''}`}
                            onClick={() => handleTabClick('members')}
                        >
                            <h3>Danh sách thành viên</h3>
                        </div>
                        <div
                            className={`tab ${activeTab === 'progress' ? 'tab-active' : ''}`}
                            onClick={() => {
                                handleTabClick('progress');
                                navigate(`/stprogress/${courseId}`); // Điều hướng bằng React Router
                            }}
                        >
                            <h3>Tiến độ học tập</h3>

                        </div>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'course' && (
                            <>
                                <div className="course-description">
                                    <strong>Giới thiệu về khóa học: </strong>
                                    {courseData.description || "No description available."}
                                </div>



                                <div className="section">
                                    <h4 className="section-header" onClick={toggleModulesSection}>
                                        <span className="title-module">
                                            Modules
                                        </span>


                                        <span className={`arrow ${expandedModulesSection ? 'open' : ''}`}>
                                            {expandedModulesSection ? '▼' : '▶'}
                                        </span>

                                    </h4>

                                    {expandedModulesSection && (
                                        <ul>
                                            {courseData.modules?.map((module, index) => (
                                                <li key={module._id}>
                                                    <div className="module-title" onClick={() => toggleModule(module._id)}>
                                                        <span>{module.name}</span>
                                                        <span className={`arrow ${expandedModule === module._id ? 'open' : '▶'}`}>
                                                            {expandedModule === module._id ? '▼' : '▶'}
                                                        </span>





                                                    </div>


                                                    {/* Danh sách bài học */}
                                                    {expandedModule === module._id && (
                                                        <ul className="lesson-list">
                                                            {module.lessons?.map((lesson, idx) => (
                                                                <li key={lesson._id}>
                                                                    <div className="details-lessson">
                                                                        <strong>Tên tài liệu: {lesson.name}</strong>
                                                                        <strong>Mô tả về bài học: {lesson.lesson_details}</strong>
                                                                        <strong>Loại tệp: {lesson.type}</strong>
                                                                    </div>
                                                                    <div className="actions">
                                                                        <span
                                                                            className="download-lesson"
                                                                            onClick={() => handleDownloadLesson(lesson._id, lesson.name)}
                                                                        >
                                                                            Tải xuống tài liệu
                                                                        </span>

                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>

                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {/* Quiz Section */}
                                {/* <p>Số lượng Quiz: {courseData.quiz?.length || 0}</p> */}
                                <div className="section">
                                    <h4 className="section-header" onClick={toggleQuizSection}>
                                        <span className="quiz-title">
                                            <span className="title">
                                                Quizzes
                                            </span>
                                            <span className={`arrow ${expandedQuizSection ? 'open' : ''}`}>
                                                {expandedQuizSection ? '▼' : '▶'}
                                            </span>
                                        </span>




                                    </h4>


                                    {expandedQuizSection && (
                                        <ul>
                                            {courseData.quiz?.map((quiz, index) => (
                                                <li key={index}>
                                                    <div className="quiz-title">
                                                        <button
                                                            className="quiz-button"
                                                            onClick={() =>
                                                                (window.location.href = `/quizzes/${quiz._id}`)
                                                            }
                                                        >
                                                            {quiz.name}
                                                        </button>


                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                            </>
                        )}
                        {activeTab === 'members' && (
                            <div className="members-tab">
                                {loadingStudents ? (
                                    <p>Loading students...</p>
                                ) : (
                                    <>
                                        <div className="students-grid">
                                            {students.map((student) => (
                                                <div className="student-card" key={student._id}>
                                                    <h5>{student.user?.name || "Unknown"}</h5>
                                                    <p>{student.user?.email || "No email"}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pagination-controls">
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="page-button"
                                            >
                                                Previous
                                            </button>

                                            {groupStart > 1 && (
                                                <button
                                                    onClick={() => setCurrentPage(groupStart - 1)}
                                                    className="page-button"
                                                >
                                                    ...
                                                </button>
                                            )}

                                            {Array.from({ length: groupEnd - groupStart + 1 }, (_, index) => {
                                                const page = groupStart + index;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`page-button ${currentPage === page ? "active" : ""}`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}

                                            {groupEnd < totalPages && (
                                                <button
                                                    onClick={() => setCurrentPage(groupEnd + 1)}
                                                    className="page-button"
                                                >
                                                    ...
                                                </button>
                                            )}

                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="page-button"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>




                </div>
            </div>

        </div >
    );
};

export default CoursePage;
