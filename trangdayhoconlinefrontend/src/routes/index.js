import HomePage from "../pages/HomePage/HomePage"
import CoursePage from "../pages/CoursePage/CoursePage"
import HeaderAdmin from "../components/Header/HeaderAdmin"
export const routes = [
    {
        path: '/',
        page: HeaderAdmin
    },
    {
        path: '/homepage',
        page: HomePage
    },
    {
        path: '/coursepage',
        page: CoursePage
    }

]