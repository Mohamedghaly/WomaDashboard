// Dashboard Overview Logic
let statsData = {
    products: 0,
    categories: 0,
    orders: 0,
    pendingOrders: 0
};

async function loadDashboardStats() {
    try {
        // Load stats from dedicated endpoint
        const stats = await API.getDashboardStats();

        document.getElementById('total-products').textContent = stats.total_products;
        document.getElementById('total-categories').textContent = stats.total_categories;
        document.getElementById('total-orders').textContent = stats.total_orders;
        document.getElementById('pending-orders').textContent = stats.pending_orders;

        // Update revenue and customers if elements exist
        const revenueEl = document.getElementById('total-revenue');
        if (revenueEl) revenueEl.textContent = formatCurrency(stats.total_revenue);

        const customersEl = document.getElementById('total-customers');
        if (customersEl) customersEl.textContent = stats.total_customers;

        // Load recent orders
        const ordersResponse = await API.getOrders({ page_size: 5 });
        const recentOrders = ordersResponse.results || ordersResponse;
        await loadRecentOrders(recentOrders);

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showError('Failed to load dashboard statistics');
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
