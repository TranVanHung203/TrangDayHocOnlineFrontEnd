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

    // Tạm thời không sử dụng token trong quá trình xác thực
    async authentication(strategy, email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/${strategy}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Authentication failed:', error);
        }
    }

    async reAuthentication() {
        console.warn('Re-authentication is not implemented without a token.');
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
                credentials: 'include'  // Thêm dòng này để gửi cookie cùng request
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
                credentials: 'include',  // Thêm dòng này để gửi cookie cùng request
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating data:', error);
        }
    }
    
}
export default RestClient;