import HomePage from "../pages/HomePage/HomePage"
import CoursePage from "../pages/CoursePage/CoursePage"
import CreateCourse from "../pages/TeacherPage/CreateCourse"
import LoadEditCourse from "../pages/TeacherPage/EditCourse"
import OverViewExamPage from "../pages/StudentPage/OverViewExamPage"
export const routes = [
    {
        path: '/mycourses',
        page: HomePage
    },
    {
        path: '/coursepage',
        page: CoursePage
    },
    {
        path: '/createcourse',
        page: CreateCourse
    },
    {
        path: '/updatecourses/load-course/:courseId',  // Đường dẫn dynamic với :courseId
        page: LoadEditCourse  // Giả sử bạn có trang UpdateCourse để xử lý cập nhật khóa học
    },
    {
        path: '/quizzes',
        page: OverViewExamPage
    },

]