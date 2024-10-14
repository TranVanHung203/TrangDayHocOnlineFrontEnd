import React from 'react';
import { Link } from 'react-router-dom';

const Courses = () => {
    const courses = [
        { id: 1, name: 'Lập trình JavaScript' },
        { id: 2, name: 'React Cơ bản' },
        { id: 3, name: 'Phát triển Web Fullstack' },
    ];

    return (
        <div className="courses">
            <h1>Danh sách Khóa học</h1>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        <Link to={`/courses/${course.id}`}>{course.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Courses;
