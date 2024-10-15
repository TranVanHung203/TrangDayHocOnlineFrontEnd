import HomePage from "../pages/HomePage/HomePage"
import CoursePage from "../pages/CoursePage/CoursePage"
import OverviewMyCourse from "../pages/HomePage/OverviewMyCourse"
import CreateCourse from "../pages/TeacherPage/CreateCourse"
export const routes = [
    {
        path: '/mycourses',
        page: OverviewMyCourse
    },
    {
        path: '/homepage',
        page: HomePage
    },
    {
        path: '/coursepage',
        page: CoursePage
    },
    {
        path: '/createcourse',
        page: CreateCourse
    }

]