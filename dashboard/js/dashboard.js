// Dashboard Overview Logic
let statsData = {
    products: 0,
    categories: 0,
    orders: 0,
    pendingOrders: 0
};

async function loadDashboardStats() {
    try {
        // Load products count
        const products = await API.getProducts();
        statsData.products = products.count || products.results?.length || 0;
        document.getElementById('total-products').textContent = statsData.products;

        // Load categories count
        const categories = await API.getCategories();
        statsData.categories = categories.count || categories.results?.length || 0;
        document.getElementById('total-categories').textContent = statsData.categories;

        // Load orders
        const orders = await API.getOrders();
        statsData.orders = orders.count || orders.results?.length || 0;
        document.getElementById('total-orders').textContent = statsData.orders;

        // Count pending orders
        const ordersList = orders.results || orders;
        statsData.pendingOrders = ordersList.filter(o => o.status === 'pending').length;
        document.getElementById('pending-orders').textContent = statsData.pendingOrders;

        // Load recent orders
        await loadRecentOrders(ordersList.slice(0, 5));
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadRecentOrders(orders) {
    const container = document.getElementById('recent-orders-list');

    if (!orders || orders.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent orders</p>';
        return;
    }

    const html = `
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>#${order.id.substring(0, 8)}</td>
                        <td>${order.customer_email || 'N/A'}</td>
                        <td><span class="badge badge-${order.status}">${order.status}</span></td>
                        <td>${formatCurrency(order.total_amount)}</td>
                        <td>${new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
});
