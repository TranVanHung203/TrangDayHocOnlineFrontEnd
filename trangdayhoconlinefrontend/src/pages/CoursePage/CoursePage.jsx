import React, { useEffect, useState } from 'react';
import RestClient from '../../client-api/rest-client.js';
import '../../css/CoursePage.css';
import { useParams } from 'react-router-dom';
import HeaderStudent from '../../components/Header/HeaderStudent';
import Swal from 'sweetalert2';

const CoursePage = () => {
    const { courseId } = useParams();

    const [courseData, setCourseData] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [expandedModule, setExpandedModule] = useState(null);
    const [expandedModulesSection, setExpandedModulesSection] = useState(false);
    const [activeTab, setActiveTab] = useState('course'); // state to manage active tab
    const [isEditingQuiz, setIsEditingQuiz] = useState(false);
    const [editingQuizId, setEditingQuizId] = useState(null); // ID của quiz đang chỉnh sửa
    const [editingModule, setEditingModule] = useState(null);

    const [showAddQuizForm, setShowAddQuizForm] = useState(false);
    const [newQuiz, setNewQuiz] = useState({
        name: '',
        number: '',
        min_pass_score: '',
        start_deadline: '',
        end_deadline: '',
    });




    const [showAddLessonForm, setShowAddLessonForm] = useState(null);
    const [newLesson, setNewLesson] = useState({
        name: '',
        number: '',
        lesson_details: '',
        type: '',
        file: null, // Thêm trường file
    });


    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Lấy file từ input
        setNewLesson((prev) => ({ ...prev, file }));
    };

    const handleShowAddLessonForm = (moduleId) => {
        setShowAddLessonForm(moduleId);
    };

    const handleLessonChange = (e) => {
        const { name, value } = e.target;
        setNewLesson((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddLesson = async (e, moduleId) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newLesson.name);
            formData.append('number', "10");
            formData.append('lesson_details', newLesson.lesson_details);
            formData.append('type', newLesson.type);
            if (newLesson.file) {
                formData.append('file', newLesson.file); // Đính kèm file
            }

            const client = new RestClient();
            const result = await client.addLesson(moduleId, formData); // Gửi formData
            if (result) {
                Swal.fire('Thành công!', 'Bài học đã được thêm.', 'success').then(() => {
                    window.location.reload();
                });
            }
        } catch (error) {
            Swal.fire('Lỗi!', 'Không thể thêm bài học.', 'error');
        }
    };


    const toggleAddQuizForm = () => {
        setShowAddQuizForm((prev) => !prev);
        setIsEditingQuiz(false); // Reset trạng thái về thêm mới
        setNewQuiz({
            name: '',
            number: '',
            min_pass_score: '',
            start_deadline: '',
            end_deadline: '',
        });
    };

    const handleAddQuizChange = (e) => {
        const { name, value } = e.target;
        setNewQuiz((prev) => ({ ...prev, [name]: value }));
    };


    const [showAddModuleForm, setShowAddModuleForm] = useState(false);
    const [newModule, setNewModule] = useState({ name: '' });

    const toggleAddModuleForm = () => setShowAddModuleForm((prev) => !prev);


    const handleAddModuleChange = (e) => {
        const { name, value } = e.target;
        setNewModule((prev) => ({ ...prev, [name]: value }));
    };


    const [expandedQuizSection, setExpandedQuizSection] = useState(false);
    const handleAddQuiz = async () => {
        const client = new RestClient();
        const result = await client.addQuiz(courseId, newQuiz);

        if (result && result.quiz) {
            setCourseData((prev) => ({
                ...prev,
                quiz: [...prev.quiz, result.quiz],
            }));
            toggleAddQuizForm(); // Đóng form sau khi thêm thành công

            // Thông báo thành công
            Swal.fire({
                icon: 'success',
                title: 'Thêm Quiz thành công!',
                text: `Quiz "${result.quiz.name}" đã được thêm.`,
            });
        } else {
            console.error('Failed to add quiz');

            // Thông báo thất bại
            Swal.fire({
                icon: 'error',
                title: 'Thêm Quiz thất bại!',
                text: 'Có lỗi xảy ra khi thêm quiz. Vui lòng thử lại.',
            });
        }
    };
    const handleEditQuiz = (quiz) => {
        setIsEditingQuiz(true);
        setEditingQuizId(quiz._id);

        // Hàm chuyển đổi ngày giờ sang định dạng phù hợp với <input type="datetime-local">
        const formatDateForInput = (dateString) => {
            // Chuyển đổi từ ISO string thành Date object
            const date = new Date(dateString);

            // Lấy các phần ngày tháng năm và giờ phút
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            // Trả về chuỗi theo định dạng yyyy-MM-ddTHH:mm
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        setNewQuiz({
            name: quiz.name,
            number: quiz.number,
            min_pass_score: quiz.min_pass_score,
            start_deadline: formatDateForInput(quiz.start_deadline), // Chuyển đổi start_deadline
            end_deadline: formatDateForInput(quiz.end_deadline),     // Chuyển đổi end_deadline
        });

        setShowAddQuizForm(true);
    };

    const handleUpdateQuiz = async () => {
        try {
            const client = new RestClient();
            const result = await client.updateQuiz(editingQuizId, newQuiz);

            if (result && result.message === 'Quiz updated successfully') {
                // Cập nhật dữ liệu quiz trong trạng thái
                setCourseData((prev) => ({
                    ...prev,
                    quiz: prev.quiz.map((q) =>
                        q._id === editingQuizId ? { ...q, ...newQuiz } : q
                    ),
                }));

                // Đóng form sau khi cập nhật thành công
                toggleAddQuizForm();

                // Hiển thị thông báo thành công
                Swal.fire(
                    'Cập nhật thành công!',
                    `Quiz "${result.quiz.name}" đã được cập nhật thành công.`,
                    'success'
                );
            } else {
                // Nếu có lỗi trong quá trình cập nhật
                throw new Error('Failed to update quiz');
            }
        } catch (error) {
            // Hiển thị thông báo lỗi
            Swal.fire(
                'Cập nhật thất bại!',
                'Có lỗi xảy ra khi cập nhật quiz. Vui lòng thử lại.',
                'error'
            );
            console.error(error);
        }
    };




    const handleDeleteQuiz = async (quizId) => {
        const client = new RestClient();

        try {
            const result = await client.deleteQuiz(quizId);
            if (result && result.success) {
                // Cập nhật lại dữ liệu khóa học sau khi xóa quiz
                setCourseData((prev) => ({
                    ...prev,
                    quiz: prev.quiz.filter((quiz) => quiz._id !== quizId),
                }));
                Swal.fire('Đã xóa!', 'Quiz đã được xóa.', 'success');
            } else {
                console.error("Failed to delete quiz:", result.message);
            }
        } catch (error) {
            console.error("Error deleting quiz:", error);
            Swal.fire('Lỗi!', 'Không thể xóa quiz.', 'error');
        }
    };

    useEffect(() => {
        const fetchCourseData = async () => {
            const client = new RestClient();
            const data = await client.findCourseById(courseId);
            console.log("du lieu nè:", data)
            setCourseData(data);
            setLoading(false);
        };

        fetchCourseData();
    }, [courseId]);


    const toggleQuizSection = () => {
        setExpandedQuizSection((prev) => !prev);
    };
    useEffect(() => {
        if (activeTab === 'members') {
            const fetchCourseStudents = async () => {
                const client = new RestClient();
                const data = await client.findCourseStudents(courseId);
                setStudents(data.students);
                console.log("Du lieu ne", data);
                setLoadingStudents(false);
            };

            fetchCourseStudents();
        }
    }, [activeTab, courseId]);

    const handleDeleteModule = async (moduleId) => {
        if (!moduleId) {
            console.error("Module ID is not provided");
            return;
        }

        const client = new RestClient();

        try {
            const result = await client.deleteModule(moduleId);
            if (result.success) {
                setCourseData((prev) => ({
                    ...prev,
                    modules: prev.modules.filter((module) => module._id !== moduleId),
                }));
            } else {
                console.error("Failed to delete module:", result.message);
            }
        } catch (error) {
            console.error("Error deleting module:", error);
        }
    };


    const handleDeleteLesson = async (lessonId, moduleId) => {


        if (!lessonId || !moduleId) {
            console.error("Lesson ID hoặc Module ID không được cung cấp");
            return;
        }

        const client = new RestClient();

        try {
            const result = await client.deleteLesson(lessonId); // Sử dụng hàm `deleteLesson` trong RestClient
            if (result.success) {
                setCourseData((prev) => ({
                    ...prev,
                    modules: prev.modules.map((module) =>
                        module._id === moduleId
                            ? {
                                ...module,
                                lessons: module.lessons.filter((lesson) => lesson._id !== lessonId),
                            }
                            : module
                    ),
                }));
            } else {
                console.error("Xóa bài học thất bại:", result.message);
            }
        } catch (error) {
            console.error("Lỗi khi xóa bài học:", error);
        }
    };


    const handleDownloadLesson = async (lessonId) => {
        try {
            const client = new RestClient();
            const result = await client.downloadLesson(lessonId);

            if (!result.success) {
                Swal.fire('Lỗi!', result.message, 'error');
            }
        } catch (error) {
            Swal.fire('Lỗi!', 'Không thể tải xuống file.', 'error');
            console.error('Download error:', error);
        }
    };





    const handleEditModule = (module) => {
        setEditingModule(module); // Lưu thông tin module cần chỉnh sửa
        setNewModule({ name: module.name }); // Đổ thông tin vào form
        setShowAddModuleForm(true); // Hiển thị form
    };
    const handleAddOrUpdateModule = async () => {
        const client = new RestClient();

        if (editingModule) {
            // Chỉnh sửa module
            const updatedModule = { ...newModule };
            const result = await client.updateModule(editingModule._id, updatedModule);

            if (result && result.module) {
                setCourseData((prev) => ({
                    ...prev,
                    modules: prev.modules.map((mod) =>
                        mod._id === result.module._id ? result.module : mod
                    ),
                }));
                setEditingModule(null); // Reset state chỉnh sửa
                setShowAddModuleForm(false); // Đóng form

                // Thông báo thành công
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công!',
                    text: `Module "${result.module.name}" đã được cập nhật.`,
                });
            } else {
                console.error('Failed to update module');
                // Thông báo thất bại
                Swal.fire({
                    icon: 'error',
                    title: 'Cập nhật thất bại!',
                    text: 'Có lỗi xảy ra khi cập nhật module. Vui lòng thử lại.',
                });
            }
        } else {
            // Thêm mới module
            const moduleToAdd = { ...newModule, number: 10 };
            const result = await client.addModule(courseId, moduleToAdd);

            if (result && result.module) {
                setCourseData((prev) => ({
                    ...prev,
                    modules: [...prev.modules, result.module],
                }));
                setNewModule({ name: '' });
                setShowAddModuleForm(false);

                // Thông báo thành công
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm mới thành công!',
                    text: `Module "${result.module.name}" đã được thêm.`,
                });
            } else {
                console.error('Failed to add module');
                // Thông báo thất bại
                Swal.fire({
                    icon: 'error',
                    title: 'Thêm mới thất bại!',
                    text: 'Có lỗi xảy ra khi thêm module. Vui lòng thử lại.',
                });
            }
        }
    };

    // Hủy chỉnh sửa
    const handleCancelEdit = () => {
        setEditingModule(null);
        setNewModule({ name: '' });
        setShowAddModuleForm(false);
    };
    const handleTimeChange = (e, field) => {
        const newValue = e.target.value;
        setNewQuiz((prevQuiz) => {
            const updatedQuiz = { ...prevQuiz, [field]: newValue };

            // Kiểm tra thời gian bắt đầu và kết thúc
            if (updatedQuiz.start_deadline && updatedQuiz.end_deadline) {
                const start = new Date(updatedQuiz.start_deadline);
                const end = new Date(updatedQuiz.end_deadline);

                // Nếu thời gian bắt đầu sau thời gian kết thúc, hiển thị lỗi và không cập nhật giá trị
                if (start >= end) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi thời gian',
                        text: 'Thời gian kết thúc phải sau thời gian bắt đầu!',
                    });
                    return prevQuiz; // Trả lại quiz không thay đổi
                }
            }
            return updatedQuiz;
        });
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
                            onClick={() => handleTabClick('progress')}
                        >
                            <h3>Tiến độ học tập</h3>
                        </div>

                    </div>

                    <div className="tab-content">
                        {activeTab === 'course' && (
                            <>
                                <p>Giới thiệu về khóa học: {courseData.description || "No description available."}</p>
                                <p>Số lượng Modules: {courseData.modules?.length || 0}</p>


                                <div className="section">
                                    <h4 className="section-header" onClick={toggleModulesSection}>
                                        Modules
                                        <span className={`arrow ${expandedModulesSection ? 'open' : ''}`}>
                                            {expandedModulesSection ? '▼' : '▶'}
                                        </span>
                                        <button
                                            className="add-module-button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền
                                                toggleAddModuleForm();
                                            }}
                                        >
                                            +
                                        </button>
                                    </h4>
                                    {showAddModuleForm && (
                                        <form
                                            className="add-module-form"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleAddOrUpdateModule();
                                            }}
                                        >
                                            <div>
                                                <label htmlFor="module-name">Tên Module:</label>
                                                <input
                                                    id="module-name"
                                                    type="text"
                                                    name="name"
                                                    placeholder="Tên Module"
                                                    value={newModule.name}
                                                    onChange={handleAddModuleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-actions">
                                                <button type="submit">
                                                    {editingModule ? 'Cập nhật' : 'Thêm'}
                                                </button>
                                                <button type="button" onClick={handleCancelEdit}>
                                                    Hủy
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                    {expandedModulesSection && (
                                        <ul>
                                            {courseData.modules?.map((module, index) => (
                                                <li key={module._id}>
                                                    <div className="module-title" onClick={() => toggleModule(module._id)}>
                                                        <span>{module.name}</span>
                                                        <span className={`arrow ${expandedModule === module._id ? 'open' : '▶'}`}>
                                                            {expandedModule === module._id ? '▼' : '▶'}
                                                        </span>

                                                        <button
                                                            className="add-lesson-button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleShowAddLessonForm(module._id);
                                                            }}
                                                        >
                                                            +
                                                        </button>

                                                        <button
                                                            className="edit-module-button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditModule(module);
                                                            }}
                                                        >
                                                            ✏️
                                                        </button>
                                                        <span
                                                            className="delete-module"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                Swal.fire({
                                                                    title: 'Xác nhận xóa',
                                                                    text: `Bạn có chắc chắn muốn xóa module "${module.name}" không?`,
                                                                    icon: 'warning',
                                                                    showCancelButton: true,
                                                                    confirmButtonText: 'Xóa',
                                                                    cancelButtonText: 'Hủy',
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        handleDeleteModule(module._id).then(() => {
                                                                            Swal.fire('Đã xóa!', 'Module đã được xóa thành công.', 'success').then(() => {
                                                                                window.location.reload();
                                                                            });
                                                                        });
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            ❌
                                                        </span>
                                                    </div>

                                                    {/* Form thêm bài học */}

                                                    {showAddLessonForm === module._id && (
                                                        <form
                                                            className="add-lesson-form"
                                                            onSubmit={(e) => handleAddLesson(e, module._id)}
                                                        >
                                                            <div>
                                                                <label htmlFor="lesson-name">Tên bài học:</label>
                                                                <input
                                                                    id="lesson-name"
                                                                    type="text"
                                                                    name="name"
                                                                    placeholder="Tên bài học"
                                                                    value={newLesson.name}
                                                                    onChange={handleLessonChange}
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label htmlFor="lesson-details">Chi tiết:</label>
                                                                <textarea
                                                                    id="lesson-details"
                                                                    name="lesson_details"
                                                                    placeholder="Mô tả bài học"
                                                                    value={newLesson.lesson_details}
                                                                    onChange={handleLessonChange}
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label htmlFor="lesson-type">Loại:</label>
                                                                <input
                                                                    id="lesson-type"
                                                                    type="text"
                                                                    name="type"
                                                                    placeholder="Loại bài học"
                                                                    value={newLesson.type}
                                                                    onChange={handleLessonChange}
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label htmlFor="lesson-file">Tải lên file:</label>
                                                                <input
                                                                    id="lesson-file"
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={handleFileChange} // Thêm sự kiện để xử lý file
                                                                />
                                                            </div>
                                                            <div className="form-actions">
                                                                <button type="submit">Thêm</button>
                                                                <button type="button" onClick={() => setShowAddLessonForm(null)}>Hủy</button>
                                                            </div>
                                                        </form>
                                                    )}



                                                    {/* Danh sách bài học */}
                                                    {expandedModule === module._id && (
                                                        <ul>
                                                            {module.lessons?.map((lesson, idx) => (
                                                                <li key={lesson._id}>
                                                                    <strong>{lesson.name}</strong> -{' '}
                                                                    <span
                                                                        className="download-lesson"
                                                                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                                                        onClick={() => handleDownloadLesson(lesson._id)} // Gọi hàm tải xuống
                                                                    >
                                                                        Tải xuống tài liệu
                                                                    </span>
                                                                    <span
                                                                        className="delete-lesson"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            Swal.fire({
                                                                                title: 'Xác nhận xóa',
                                                                                text: `Bạn có chắc chắn muốn xóa bài học "${lesson.name}" không?`,
                                                                                icon: 'warning',
                                                                                showCancelButton: true,
                                                                                confirmButtonText: 'Xóa',
                                                                                cancelButtonText: 'Hủy',
                                                                            }).then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    handleDeleteLesson(lesson._id, module._id).then(() => {
                                                                                        Swal.fire('Đã xóa!', 'Bài học đã được xóa thành công.', 'success').then(() => {
                                                                                            window.location.reload();
                                                                                        });
                                                                                    });
                                                                                }
                                                                            });
                                                                        }}
                                                                    >
                                                                        ❌
                                                                    </span>
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
                                <p>Số lượng Quiz: {courseData.quiz?.length || 0}</p>
                                <div className="section">
                                    <h4 className="section-header" onClick={toggleQuizSection}>
                                        Quiz
                                        <span className={`arrow ${expandedQuizSection ? 'open' : ''}`}>
                                            {expandedQuizSection ? '▼' : '▶'}
                                        </span>
                                        <button
                                            className="add-quiz-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleAddQuizForm();
                                            }}
                                        >
                                            +
                                        </button>
                                    </h4>
                                    {showAddQuizForm && (
                                        <form className={`add-quiz-form ${isEditingQuiz ? 'edit-mode' : ''}`} onSubmit={(e) => e.preventDefault()}>
                                            <div>
                                                <label htmlFor="quiz-name">Tên Quiz:</label>
                                                <input
                                                    id="quiz-name"
                                                    type="text"
                                                    name="name"
                                                    placeholder="Tên Quiz"
                                                    value={newQuiz.name}
                                                    onChange={handleAddQuizChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="quiz-number">Thời gian làm bài:</label>
                                                <input
                                                    id="quiz-number"
                                                    type="number"
                                                    name="number"
                                                    placeholder="Thời gian làm bài"
                                                    value={newQuiz.number}
                                                    onChange={handleAddQuizChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="quiz-min-pass-score">Điểm qua môn:</label>
                                                <input
                                                    id="quiz-min-pass-score"
                                                    type="number"
                                                    name="min_pass_score"
                                                    placeholder="Điểm qua môn"
                                                    value={newQuiz.min_pass_score}
                                                    onChange={handleAddQuizChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="quiz-start-deadline">Thời gian bắt đầu:</label>
                                                <input
                                                    id="quiz-start-deadline"
                                                    type="datetime-local"
                                                    name="start_deadline"
                                                    value={newQuiz.start_deadline}
                                                    onChange={(e) => handleTimeChange(e, 'start_deadline')}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="quiz-end-deadline">Thời gian kết thúc:</label>
                                                <input
                                                    id="quiz-end-deadline"
                                                    type="datetime-local"
                                                    name="end_deadline"
                                                    value={newQuiz.end_deadline}
                                                    onChange={(e) => handleTimeChange(e, 'end_deadline')}
                                                    required
                                                />
                                            </div>
                                            <div className="form-actions">
                                                {isEditingQuiz ? (
                                                    <button type="button" onClick={handleUpdateQuiz}>
                                                        Cập nhật
                                                    </button>
                                                ) : (
                                                    <button type="button" onClick={handleAddQuiz}>
                                                        Thêm
                                                    </button>
                                                )}
                                                <button type="button" onClick={toggleAddQuizForm}>
                                                    Hủy
                                                </button>
                                            </div>
                                        </form>
                                    )}


                                    {expandedQuizSection && (
                                        <ul>
                                            {courseData.quiz?.map((quiz, index) => (
                                                <li key={index}>
                                                    <div className="quiz-title">
                                                        <button
                                                            className="quiz-button"
                                                            onClick={() =>
                                                                (window.location.href = `/quiz/${quiz._id}`)
                                                            }
                                                        >
                                                            {quiz.name}
                                                        </button>
                                                        <button
                                                            className="edit-quiz-button"
                                                            onClick={() => handleEditQuiz(quiz)}
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="delete-quiz-button"
                                                            onClick={() => {
                                                                Swal.fire({
                                                                    title: `Xác nhận xóa`,
                                                                    text: `Bạn có chắc chắn muốn xóa quiz "${quiz.name}" không?`,
                                                                    icon: 'warning',
                                                                    showCancelButton: true,
                                                                    confirmButtonText: 'Xóa',
                                                                    cancelButtonText: 'Hủy',
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        handleDeleteQuiz(quiz._id).then(() => {
                                                                            Swal.fire(
                                                                                'Đã xóa!',
                                                                                'Quiz đã được xóa thành công.',
                                                                                'success'
                                                                            ).then(() => {
                                                                                window.location.reload();
                                                                            });
                                                                        });
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            ❌
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
                            <div>
                                <h4>Danh sách thành viên</h4>
                                {loadingStudents ? (
                                    <p>Loading students...</p>
                                ) : (
                                    <div className="students-grid">
                                        {students.map((student) => (
                                            <div className="student-card" key={student._id}>
                                                <h5>{student.user?.name || "Unknown"}</h5>
                                                <p>{student.user?.email || "No email"}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'progress' && (
                            <div>
                                <h4>Tiến độ học tập</h4>
                                {/* {loadingProgress ? (
                                    <p>Loading progress...</p>
                                ) : quizProgress ? (
                                    <div>
                                        <h5>{quizProgress.quizName}</h5>
                                        <ul>
                                            {quizProgress.studentProgress.map((student, index) => (
                                                <li key={index}>
                                                    <p><strong>{student.student}</strong></p>
                                                    <p>Email: {student.email}</p>
                                                    <p>Score: {student.scoreAchieved} / {quizProgress.quizId}</p>
                                                    <p>{student.checkPassed ? 'Passed' : 'Not Passed'}</p>
                                                    <p>Attempted on: {student.attemptDate || 'N/A'}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p>No progress data available.</p>
                                )} */}
                            </div>
                        )}



                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
