import HomePage from "../pages/HomePage/HomePage"
import CoursePage from "../pages/CoursePage/CoursePage"
import CreateCourse from "../pages/TeacherPage/CreateCourse"
import LoadEditCourse from "../pages/TeacherPage/EditCourse"
import OverViewExamPage from "../pages/StudentPage/OverViewExamPage"
import Quiz from "../pages/StudentPage/Quiz"
import Timeline from "../pages/StudentPage/Timeline"
import CreateQuestionAndAnswer from "../pages/TeacherPage/CreateQuestionAndAnswer"
export const routes = [
    {
        path: '/mycourses',
        page: HomePage
    },
    {
        path: '/mycourses/coursepage/:courseId',
        page: CoursePage
    },
    {
        path: '/createcourse',
        page: CreateCourse
    },
    {
        path: '/updatecourses/load-course/:courseId',  // Đường dẫn dynamic với :courseId
        page: LoadEditCourse  // Giả sử bạn có trang UpdateCourse để xử lý cập nhật khóa học
    }
    },
    {
        path: '/quizzes/:quizid',
        page: OverViewExamPage
    },
    {
        path: '/quizzes/start/:quizid',
        page: Quiz
    },
    {
        path: '/notify/timeline',
        page: Timeline
    },
    {
        path: '/QuestionAndAnswer/:quizid',
        page: CreateQuestionAndAnswer
    },
    


]