// API Configuration and Helper Functions
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000/api/v1'
    : 'https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app/api/v1';

// API Client
class API {
    static getHeaders(skipAuth = false) {
        const token = localStorage.getItem('access_token');
        return {
            'Content-Type': 'application/json',
            ...(!skipAuth && token && { 'Authorization': `Bearer ${token}` })
        };
    }

    static async request(endpoint, options = {}) {
        const { skipAuth = false, ...fetchOptions } = options;
        const url = `${API_BASE_URL}${endpoint}`;

        const headers = {
            ...this.getHeaders(skipAuth),
            ...fetchOptions.headers
        };

        const config = {
            ...fetchOptions,
            headers
        };

        try {
            const response = await fetch(url, config);

            // Handle 204 No Content (DELETE successful) - no JSON to parse
            if (response.status === 204) {
                return null;
            }

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);

            // Handle 401 Unauthorized
            if (error.status === 401 || error.detail === 'Authentication credentials were not provided.' || error.code === 'token_not_valid') {
                // Only redirect if we're not already on the login page and it wasn't a login attempt
                if (!window.location.pathname.endsWith('index.html') && !endpoint.includes('/auth/login/')) {
                    localStorage.clear();
                    window.location.href = 'index.html';
                }
            }

            throw error;
        }
    }

    // Auth
    static async login(email, password) {
        return this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuth: true
        });
    }

    static async getProfile() {
        return this.request('/auth/profile/');
    }

    // Categories
    static async getCategories() {
        return this.request('/admin/categories/');
    }

    static async createCategory(data) {
        return this.request('/admin/categories/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async updateCategory(id, data) {
        return this.request(`/admin/categories/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async deleteCategory(id) {
        return this.request(`/admin/categories/${id}/`, {
            method: 'DELETE'
        });
    }

    // Products
    static async getProducts(params = {}) {
        const query = new URLSearchParams(params).toString();
        const endpoint = query ? `/admin/products/?${query}` : '/admin/products/';
        return this.request(endpoint);
    }

    static async getProduct(id) {
        return this.request(`/admin/products/${id}/`);
    }

    static async createProduct(data) {
        return this.request('/admin/products/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async updateProduct(id, data) {
        return this.request(`/admin/products/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async deleteProduct(id) {
        return this.request(`/admin/products/${id}/`, {
            method: 'DELETE'
        });
    }

    // Variations
    static async getVariations(productId) {
        return this.request(`/admin/variations/?product=${productId}`);
    }

    static async createVariation(data) {
        return this.request('/admin/variations/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async deleteVariation(id) {
        return this.request(`/admin/variations/${id}/`, {
            method: 'DELETE'
        });
    }

    // Orders
    static async getOrders(params = {}) {
        const query = new URLSearchParams(params).toString();
        const endpoint = query ? `/admin/orders/?${query}` : '/admin/orders/';
        return this.request(endpoint);
    }

    static async getOrder(id) {
        return this.request(`/admin/orders/${id}/`);
    }

    static async updateOrderStatus(id, status) {
        return this.request(`/admin/orders/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }
}

// Utility Functions
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

function showSuccess(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'success-message';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (!token && !window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Initialize auth check on protected pages
if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
    checkAuth();

    // Set up logout button
    window.addEventListener('DOMContentLoaded', () => {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }

        // Load user email
        API.getProfile().then(user => {
            const emailElem = document.getElementById('user-email');
            if (emailElem) {
                emailElem.textContent = user.email;
            }
        }).catch(() => { });
    });
}
