class RestClient {
    constructor(baseUrl = "http://localhost:5000") {
        this.baseUrl = baseUrl;
        this.path = "";
    }

    service(path) {
        this.path = path;
        return this;
    }

    async config(url) {
        this.baseUrl = url;
    }

    async find(query = {}) {
        try {
            const url = new URL(`${this.baseUrl}/${this.path}`);
            Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async create(data) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating data:', error);
        }
    }

    async patch(data) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.path}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }
    async findCourseById(courseId) {
        try {
            const url = `${this.baseUrl}/courses/${courseId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching course data:', error);
        }
    }
    async findCourseStudents(courseId, page = 1, limit = 10) {
        try {
            const url = new URL(`${this.baseUrl}/courses/students/${courseId}`);
            url.searchParams.append('page', page); url.searchParams.append('limit', limit);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching course students:', error);
        }
    }

    async addModule(courseId, data) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/modules/${courseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding module:', error);
        }
    }

    async deleteModule(moduleId) {
        const response = await fetch(`${this.baseUrl}/courses/modules/${moduleId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Nếu cần gửi cookie hoặc token
        });

        if (!response.ok) {
            throw new Error(`Failed to delete module: ${response.statusText}`);
        }

        return response.json();
    }


    async addQuiz(courseId, data) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/quizzes/${courseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding quiz:', error);
        }
    }

    async deleteQuiz(quizId) {
        try {
            const response = await fetch(`${this.baseUrl}/quizzes/${quizId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Thêm các header khác nếu cần thiết, như Authorization
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to delete quiz');
            }
            return await response.json();
        } catch (error) {
            console.error('Error deleting quiz:', error);
            return { success: false, message: error.message };
        }
    }

    async addLesson(moduleId, formData) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/lessons/${moduleId}`, {
                method: 'POST',
                credentials: 'include',
                body: formData, // Gửi formData
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding lesson:', error);
        }
    }

}
export default RestClient;
