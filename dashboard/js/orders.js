// Orders Management Logic
let allOrders = [];

async function loadOrders(status = '') {
    const container = document.getElementById('orders-table');
    container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading orders...</p></div>';

    try {
        const params = status ? { status } : {};
        const response = await API.getOrders(params);
        allOrders = response.results || response;

        if (allOrders.length === 0) {
            container.innerHTML = '<p class="text-muted" style="text-align:center;padding:40px;">No orders found.</p>';
            return;
        }

        renderOrders(allOrders);
    } catch (error) {
        container.innerHTML = '<p style="color:var(--danger);text-align:center;padding:40px;">Error loading orders</p>';
        console.error('Error:', error);
    }
}

function renderOrders(orders) {
    const container = document.getElementById('orders-table');

    const html = `
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>
                            <strong>#${order.id.substring(0, 8)}</strong>
                        </td>
                        <td>${order.customer_email || 'N/A'}</td>
                        <td>${order.item_count || '0'}</td>
                        <td><strong>${formatCurrency(order.total_amount)}</strong></td>
                        <td><span class="badge badge-${order.status}">${order.status}</span></td>
                        <td>${formatDate(order.created_at)}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="viewOrder('${order.id}')">View</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

async function viewOrder(id) {
    try {
        const order = await API.getOrder(id);
        showOrderDetails(order);
    } catch (error) {
        showError('Error loading order details');
    }
}

function showOrderDetails(order) {
    const modal = document.getElementById('order-modal');
    const detailsContainer = document.getElementById('order-details');

    const html = `
        <div style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px;">Order #${order.id.substring(0, 8)}</h3>
            <p><strong>Customer:</strong> ${order.customer_email}</p>
            <p><strong>Status:</strong> <span class="badge badge-${order.status}">${order.status}</span></p>
            <p><strong>Total:</strong> ${formatCurrency(order.total_amount)}</p>
            <p><strong>Date:</strong> ${formatDate(order.created_at)}</p>
            <p><strong>Shipping Address:</strong><br>${order.shipping_address}</p>
        </div>

        <div style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px;">Order Items</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Variation</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.product_name}</td>
                            <td>
                                ${item.variation_details ? `
                                    ${item.variation_details.color || ''} 
                                    ${item.variation_details.size || ''}
                                    ${item.variation_details.material || ''}
                                    <br><small style="color:var(--text-light)">SKU: ${item.variation_details.sku}</small>
                                ` : 'Base Product'}
                            </td>
                            <td>${item.quantity}</td>
                            <td>${formatCurrency(item.price_at_purchase)}</td>
                            <td><strong>${formatCurrency(item.subtotal)}</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px;">Update Status</h3>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn btn-sm btn-secondary" onclick="updateStatus('${order.id}', 'pending')">Pending</button>
                <button class="btn btn-sm btn-primary" onclick="updateStatus('${order.id}', 'processing')">Processing</button>
                <button class="btn btn-sm btn-success" onclick="updateStatus('${order.id}', 'completed')">Completed</button>
                <button class="btn btn-sm btn-danger" onclick="updateStatus('${order.id}', 'cancelled')">Cancelled</button>
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn btn-secondary modal-close" onclick="closeOrderModal()">Close</button>
        </div>
    `;

    detailsContainer.innerHTML = html;
    modal.classList.add('active');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
}

async function updateStatus(orderId, status) {
    try {
        await API.updateOrderStatus(orderId, status);
        showSuccess('Order status updated successfully');
        closeOrderModal();
        loadOrders();
    } catch (error) {
        showError('Error updating order status');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();

    document.getElementById('status-filter').addEventListener('change', (e) => {
        loadOrders(e.target.value);
    });

    document.querySelector('#order-modal .modal-close')?.addEventListener('click', closeOrderModal);

    document.getElementById('order-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'order-modal') closeOrderModal();
    });
});
