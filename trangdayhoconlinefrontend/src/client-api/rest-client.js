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

    async findById(id) {
        try {
            const url = new URL(`${this.baseUrl}/${this.path}/${id}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching data by ID:', error);
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

    // Thêm phương thức delete
    async delete() {
        try {
            const url = `${this.baseUrl}/${this.path}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }

    // Thêm phương thức nộp bài kiểm tra
    async submitQuiz(data) {
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
            console.error('Error submitting quiz:', error);
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
    async deleteLesson(lessonId) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/lessons/${lessonId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Nếu cần gửi cookie hoặc token
            });

            if (!response.ok) {
                throw new Error(`Failed to delete lesson: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting lesson:', error);
            return { success: false, message: error.message };
        }
    }

    async downloadLesson(lessonId,name) {
        try {
            const url = `${this.baseUrl}/lessons/download/${lessonId}`;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include', // Bao gồm cookies nếu cần
            });

            if (!response.ok) {
                throw new Error(`Failed to download lesson: ${response.statusText}`);
            }

            // Lấy tên file từ header `Content-Disposition`
            const contentDisposition = response.headers.get('Content-Disposition');
            const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
            const filename = filenameMatch ? filenameMatch[1] : name;

            // Lấy dữ liệu file dưới dạng blob
            const blob = await response.blob();

            // Tạo URL blob để tải file
            const downloadUrl = window.URL.createObjectURL(blob);

            // Tạo thẻ <a> để tự động tải xuống
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename; // Sử dụng tên file từ header
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Hủy URL blob sau khi tải xong
            window.URL.revokeObjectURL(downloadUrl);

            return { success: true };
        } catch (error) {
            console.error('Error downloading lesson:', error);
            return { success: false, message: error.message };
        }
    }

    async updateQuiz(quizId, updatedQuizData) {
        try {
            const response = await fetch(`${this.baseUrl}/quizzes/${quizId}`, {
                method: 'PATCH', // Sử dụng PATCH cho cập nhật
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedQuizData),
            });

            if (!response.ok) {
                throw new Error('Failed to update quiz');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating quiz:', error);
            return null;
        }
    }
    async updateModule(moduleId, updatedData) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/modules/${moduleId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedData), // Gửi dữ liệu cập nhật
            });

            if (!response.ok) {
                throw new Error(`Failed to update module: ${response.statusText}`);
            }

            return await response.json(); // Trả về kết quả từ server
        } catch (error) {
            console.error('Error updating module:', error);
            return { success: false, message: error.message };
        }
    }


    async findQuizProgress(quizId) {
        try {
            const url = `${this.baseUrl}/quizzes/progress/${quizId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch quiz progress');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching quiz progress:', error);
            return { success: false, message: error.message };
        }
    }

}

export default RestClient;
