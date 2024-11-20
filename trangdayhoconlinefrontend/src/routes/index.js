import HomePage from "../pages/HomePage/HomePage"
import CoursePage from "../pages/TeacherPage/CoursePage"
import CoursePageStudent from "../pages/StudentPage/CoursePageStudent"
import CreateCourse from "../pages/TeacherPage/CreateCourse"
import LoadEditCourse from "../pages/TeacherPage/EditCourse"
import OverViewExamPage from "../pages/StudentPage/OverViewExamPage"
import Quiz from "../pages/StudentPage/Quiz"
import Timeline from "../pages/StudentPage/Timeline"
import Progress from "../pages/TeacherPage/Progress"
import STProgress from "../pages/StudentPage/Progress"
import CoursePageSt from "../pages/StudentPage/CoursePageStudent"
import CreateQuestionAndAnswer from "../pages/TeacherPage/CreateQuestionAndAnswer"
import NotFoundPage from "../pages/ErrorsPage/NotFoundPage";

export const routes = [
    {
        path: '/mycourses',
        page: HomePage
    },
    {
        path: '/mycourses/lecturer/:courseId',
        page: CoursePage
    },
    {
        path: '/mycourses/student/:courseId',
        page: CoursePageStudent
    },
    {
        path: '/createcourse',
        page: CreateCourse
    },
    {
        path: '/updatecourses/:courseId',
        page: LoadEditCourse
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
    {
        path: '/progress/:courseId',
        page: Progress
    },
    {
        path: '*', // Bắt mọi đường dẫn không khớp
        page: NotFoundPage
    }
];
