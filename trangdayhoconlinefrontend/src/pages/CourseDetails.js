import React from 'react';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
    const { id } = useParams();

    const courseInfo = {
        1: { name: 'Lập trình JavaScript', description: 'Khóa học cơ bản về JavaScript.' },
        2: { name: 'React Cơ bản', description: 'Tìm hiểu cách xây dựng giao diện với React.' },
        3: { name: 'Phát triển Web Fullstack', description: 'Học cách phát triển cả Frontend và Backend.' },
    };

    const course = courseInfo[id];

    return (
        <div className="course-details">
            <h1>{course.name}</h1>
            <p>{course.description}</p>
        </div>
    );
};

export default CourseDetails;
