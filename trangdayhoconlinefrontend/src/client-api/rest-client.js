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
}

export default RestClient;
