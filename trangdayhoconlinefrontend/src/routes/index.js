import HomePage from "../pages/HomePage/HomePage";
import CoursePage from "../pages/TeacherPage/CoursePage";
import CreateCourse from "../pages/TeacherPage/CreateCourse";
import LoadEditCourse from "../pages/TeacherPage/EditCourse";
import OverViewExamPage from "../pages/StudentPage/OverViewExamPage";
import Quiz from "../pages/StudentPage/Quiz";
import Timeline from "../pages/StudentPage/Timeline";
import Progress from "../pages/TeacherPage/Progress";
import STProgress from "../pages/StudentPage/Progress";
import CoursePageSt from "../pages/StudentPage/CoursePageStudent";
import CreateQuestionAndAnswer from "../pages/TeacherPage/CreateQuestionAndAnswer";
import NotFoundPage from "../pages/ErrorsPage/NotFoundPage";
import RegisterPage from "../pages/AuthPage/RegisterPage";
import LoginPage from "../pages/AuthPage/LoginPage";
import LogOut from "../pages/AuthPage/LogOut"
import ResetPasswordPage from "../pages/AuthPage/ResetPasswordPage";
import Cookies from "js-cookie";

// Kiểm tra trạng thái đăng nhập
export const isLoggedIn = () => {
    const token = Cookies.get("access_token"); // Đọc cookie với key là 'access_token'
    console.log(token)
    return !!token; // Trả về true nếu token tồn tại
};

// AuthGuard: Bảo vệ route yêu cầu đăng nhập
export const AuthGuard = (Component) => {
    return (props) => {
        if (!isLoggedIn()) {
            window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
            return null;
        }
        return <Component {...props} />;
    };
};

// GuestGuard: Bảo vệ route không cho phép truy cập khi đã đăng nhập
export const GuestGuard = (Component) => {
    return (props) => {
        if (isLoggedIn()) {
            window.location.href = "/mycourses"; // Chuyển hướng đến trang chính nếu đã đăng nhập
            return null;
        }
        return <Component {...props} />;
    };
};

// Routes được bảo vệ
export const routes = [
    {
        path: "/mycourses",
        page: AuthGuard(HomePage), // Chỉ truy cập được khi đã đăng nhập
    },
    {
        path: "/mycourses/lecturer/:courseId",
        page: AuthGuard(CoursePage), // Chỉ truy cập được khi đã đăng nhập
    },
    {
        path: "/mycourses/student/:courseId",
        page: AuthGuard(CoursePageSt), // Chỉ truy cập được khi đã đăng nhập
    },
    {
        path: "/createcourse",
        page: AuthGuard(CreateCourse), // Chỉ truy cập được khi đã đăng nhập
    },
    {
        path: "/updatecourses/:courseId",
        page: AuthGuard(LoadEditCourse), // Chỉ truy cập được khi đã đăng nhập
    },
    {
        path: "/quizzes/:quizid",
        page: AuthGuard(OverViewExamPage), // Chỉ truy cập được khi đã đăng nhập
    },
    {
        path: "/quizzes/start/:quizid",
        page: AuthGuard(Quiz), // Chỉ truy cập được khi đã đăng nhập
    },
    {
        path: "/notify/timeline",
        page: AuthGuard(Timeline), // Chỉ truy cập được khi đã đăng nhập
    },
    {
        path: "/QuestionAndAnswer/:quizid",
        page: AuthGuard(CreateQuestionAndAnswer), // Chỉ truy cập được khi đã đăng nhập
    },
    {
        path: "/progress/:courseId",
        page: AuthGuard(Progress), // Chỉ truy cập được khi đã đăng nhập
    },
    {
        path: "/stprogress/:courseId",
        page: AuthGuard(STProgress), // Chỉ truy cập được khi đã đăng nhập
    },
    {
        path: "/register",
        page: GuestGuard(RegisterPage), // Chỉ truy cập được khi chưa đăng nhập
    },
    {
        path: "/login",
        page: GuestGuard(LoginPage), // Chỉ truy cập được khi chưa đăng nhập
    },
    {
        path: "/reset-password/:reset_token",
        page: GuestGuard(ResetPasswordPage), // Chỉ truy cập được khi chưa đăng nhập
    },
    {
        path: "*",
        page: AuthGuard(NotFoundPage), // Trang lỗi
    },
    {
        path: "/logout",
        page: LogOut, // Trang lỗi
    },
];

// Hàm logout
export const logout = () => {
    Cookies.remove("access_token"); // Xóa cookie access_token
    window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
};
