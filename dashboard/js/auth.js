// Authentication Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Show loading state
        loginBtn.disabled = true;
        loginBtn.querySelector('span').style.display = 'none';
        loginBtn.querySelector('.spinner').style.display = 'block';
        errorMessage.style.display = 'none';

        try {
            // Clear any existing tokens to prevent 401 errors from stale tokens
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            const response = await API.login(email, password);

            // Store tokens
            localStorage.setItem('access_token', response.tokens.access);
            localStorage.setItem('refresh_token', response.tokens.refresh);
            localStorage.setItem('user_email', response.user.email);
            localStorage.setItem('user_role', response.user.role);

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            errorMessage.textContent = error.error || 'Login failed. Please check your credentials.';
            errorMessage.style.display = 'block';

            loginBtn.disabled = false;
            loginBtn.querySelector('span').style.display = 'inline';
            loginBtn.querySelector('.spinner').style.display = 'none';
        }
    });
});
