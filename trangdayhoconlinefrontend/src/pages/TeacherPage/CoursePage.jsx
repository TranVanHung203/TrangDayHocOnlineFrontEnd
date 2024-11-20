import React, { useEffect, useState, useRef } from 'react';
import RestClient from '../../client-api/rest-client.js';
import '../../css/CoursePage.css';
import { useParams } from 'react-router-dom';
import HeaderTeacher from '../../components/Header/HeaderTeacher';
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
    const [isEditingQuiz, setIsEditingQuiz] = useState(false);
    const [editingQuizId, setEditingQuizId] = useState(null); // ID của quiz đang chỉnh sửa
    const [editingModule, setEditingModule] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isAuthorized, setIsAuthorized] = useState(false); // Kiểm tra quyền truy cập
    


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


    const handleBellClick = async () => {
        try {
            const client = new RestClient();
            // Sử dụng RestClient để gửi yêu cầu GET
            const response = await client.service(`notify/send-reminder/${courseId}`).find();

            // Kiểm tra kết quả phản hồi
            if (response?.message === "Reminders sent successfully!") {
                // Success notification using SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.message, // Sử dụng câu trả lời từ API
                    confirmButtonText: 'OK',
                });
            } else if(response?.message === "No assignments are expiring within the next 7 days.") {
                // Failure notification using SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.message, // Sử dụng câu trả lời từ API
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Error sending reminder:', error);
            // Error notification using SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Network Error!',
                text: 'Please try again later.',
                confirmButtonText: 'Close',
            });
        }
    };




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
    const spinnerRef = useRef(null); // Tham chiếu đến hiệu ứng xoay vòng
    const handleAddLesson = async (e, moduleId) => {
        e.preventDefault();
        // Hiển thị spinner
        if (spinnerRef.current) {
            spinnerRef.current.style.display = 'inline-block';
        }

        try {
            const formData = new FormData();
            formData.append('name', newLesson.name);
            formData.append('number', '10');
            formData.append('lesson_details', newLesson.lesson_details);
            formData.append('type', newLesson.type);
            if (newLesson.file) {
                formData.append('file', newLesson.file); // Đính kèm file
            }

            const client = new RestClient();
            const result = await client.addLesson(moduleId, formData); // Gửi formData

            if (result.message === 'Lesson created successfully') {
                Swal.fire('Thành công!', 'Bài học đã được thêm.', 'success').then(() => {
                    window.location.reload();
                });
            }
            else if (result.error.message === 'File too large') {
                Swal.fire('Lỗi!', 'File quá lớn, vui lòng chọn file nhỏ hơn.', 'error')
                    .then(() => {
                        window.location.reload();
                    });
            }
        } catch (error) {
            console.error('Error adding lesson:', error);

        } finally {
            // Ẩn spinner
            if (spinnerRef.current) {
                spinnerRef.current.style.display = 'none';
            }
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

            date.setHours(date.getHours() - 7);
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
        // Kiểm tra vai trò người dùng
        const checkRole = async () => {
            try {
                const restClient = new RestClient();
                const result = await restClient.service('getRole').find(); // Gọi API kiểm tra vai trò

                if (result.role === 'Lecturer') {
                    setIsAuthorized(true); // Nếu role là Lecturer, cho phép truy cập
                } else {

                    navigate('/mycourses'); // Điều hướng đến trang không được phép
                }
            } catch (error) {

                navigate('/mycourses'); // Điều hướng đến trang không được phép
            }
        };

        checkRole();
    }, [navigate]);

    useEffect(() => {
        // Fetch dữ liệu khóa học chỉ khi đã xác nhận quyền truy cập
        const fetchCourseData = async () => {
            if (!isAuthorized) return; // Không thực hiện nếu không được phép

            try {
                const client = new RestClient();
                const data = await client.findCourseById(courseId);
                console.log('Dữ liệu khóa học:', data);
                setCourseData(data);
            } catch (error) {
                console.error('Error fetching course data:', error);
                toast.error('Không thể tải dữ liệu khóa học.');
            } finally {
                setLoading(false); // Dừng trạng thái loading
            }
        };

        fetchCourseData();
    }, [isAuthorized, courseId]);

    // Nếu đang loading, hiển thị thông báo
    if (loading) {
        return <p>Đang kiểm tra quyền truy cập và tải dữ liệu...</p>;
    }

    // Nếu không được phép, hiển thị thông báo (phòng khi `navigate` không kích hoạt kịp)
    if (!isAuthorized) {
        return <p>Bạn không được phép truy cập trang này.</p>;
    }


    const toggleQuizSection = () => {
        setExpandedQuizSection((prev) => !prev);
    };

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
                <HeaderTeacher />

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
                                navigate(`/progress/${courseId}`); // Điều hướng bằng React Router
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
                                                            <div ref={spinnerRef} className="spinner" style={{ display: 'none' }}>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                    width="50"
                                                                    height="50"
                                                                    className="loading-icon"
                                                                >
                                                                    <circle
                                                                        cx="50"
                                                                        cy="50"
                                                                        r="45"
                                                                        stroke="#3498db"
                                                                        strokeWidth="10"
                                                                        fill="none"
                                                                        strokeDasharray="283"
                                                                        strokeDashoffset="75"
                                                                    >
                                                                        <animateTransform
                                                                            attributeName="transform"
                                                                            type="rotate"
                                                                            from="0 50 50"
                                                                            to="360 50 50"
                                                                            dur="1s"
                                                                            repeatCount="indefinite"
                                                                        />
                                                                    </circle>
                                                                </svg>
                                                            </div>
                                                        </form>
                                                    )}



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

                                        {/* Nút hình chuông */}
                                        <button
                                            className="quiz-bell-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBellClick();
                                            }}
                                        >
                                            🔔
                                        </button>

                                        {/* Nút thêm quiz */}
                                        <button
                                            className="quiz-add-button"
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
                                                                (window.location.href = `/QuestionAndAnswer/${quiz._id}`)
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
