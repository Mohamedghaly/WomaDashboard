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

            // Check content type
            const contentType = response.headers.get('content-type');

            // If response is HTML (error page), handle it
            if (contentType && contentType.includes('text/html')) {
                const htmlText = await response.text();
                console.error('Server returned HTML error:', htmlText.substring(0, 500));
                throw {
                    status: response.status,
                    message: `Server error (${response.status}). Check Django console for details.`,
                    detail: 'The server returned an error page instead of JSON. This usually means a server-side error occurred.'
                };
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

    // Dashboard Stats
    static async getDashboardStats() {
        return this.request('/stats/');
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

    static async updateVariation(id, data) {
        return this.request(`/admin/variations/${id}/`, {
            method: 'PUT',
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

    // Utilities: Colors
    static async getColors() {
        return this.request('/colors/');
    }

    static async createColor(data) {
        return this.request('/colors/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async updateColor(id, data) {
        return this.request(`/colors/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async deleteColor(id) {
        return this.request(`/colors/${id}/`, {
            method: 'DELETE'
        });
    }

    // Utilities: Sizes
    static async getSizes() {
        return this.request('/sizes/');
    }

    static async createSize(data) {
        return this.request('/sizes/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async updateSize(id, data) {
        return this.request(`/sizes/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async deleteSize(id) {
        return this.request(`/sizes/${id}/`, {
            method: 'DELETE'
        });
    }

    // Utilities: Delivery Locations
    static async getDeliveryLocations() {
        return this.request('/delivery-locations/');
    }

    static async createDeliveryLocation(data) {
        return this.request('/delivery-locations/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async updateDeliveryLocation(id, data) {
        return this.request(`/delivery-locations/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async deleteDeliveryLocation(id) {
        return this.request(`/delivery-locations/${id}/`, {
            method: 'DELETE'
        });
    }
}

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Add icon based on type
    const icon = type === 'success' ? '✅' : '⚠️';

    toast.innerHTML = `
        <span style="font-size: 18px;">${icon}</span>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    // Also support legacy error div if present on login page
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.className = 'error-message'; // Ensure it has style
        return;
    }
    showToast(message, 'error');
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
