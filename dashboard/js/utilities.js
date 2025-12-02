// Utilities Management Logic

// State
let colors = [];
let sizes = [];
let locations = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAllUtilities();
    setupEventListeners();
});

function setupEventListeners() {
    // Color Form
    document.getElementById('color-form').addEventListener('submit', handleColorSubmit);
    document.getElementById('color-hex').addEventListener('input', (e) => {
        document.getElementById('color-hex-text').value = e.target.value.toUpperCase();
    });

    // Size Form
    document.getElementById('size-form').addEventListener('submit', handleSizeSubmit);

    // Location Form
    document.getElementById('location-form').addEventListener('submit', handleLocationSubmit);

    // Modal Closers
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        });
    });

    // Close on click outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });
}

async function loadAllUtilities() {
    await Promise.all([loadColors(), loadSizes(), loadLocations()]);
}

// ================= COLORS =================

async function loadColors() {
    const container = document.getElementById('colors-list');
    try {
        const response = await API.getColors();
        colors = response.results || response;
        renderColors();
    } catch (error) {
        console.error('Error loading colors:', error);
        container.innerHTML = '<p class="text-danger">Failed to load colors</p>';
    }
}

function renderColors() {
    const container = document.getElementById('colors-list');
    if (colors.length === 0) {
        container.innerHTML = '<p class="text-muted">No colors added yet.</p>';
        return;
    }

    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Color</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${colors.map(c => `
                    <tr>
                        <td>
                            <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${c.hex_code}; border: 1px solid #ddd;"></div>
                        </td>
                        <td>${c.name}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="editColor(${c.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteColor(${c.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function openColorModal(id = null) {
    const modal = document.getElementById('color-modal');
    const form = document.getElementById('color-form');
    const title = document.getElementById('color-modal-title');

    form.reset();
    document.getElementById('color-id').value = '';
    document.getElementById('color-hex').value = '#000000';
    document.getElementById('color-hex-text').value = '#000000';

    if (id) {
        const color = colors.find(c => c.id === id);
        if (color) {
            title.textContent = 'Edit Color';
            document.getElementById('color-id').value = color.id;
            document.getElementById('color-name').value = color.name;
            document.getElementById('color-hex').value = color.hex_code;
            document.getElementById('color-hex-text').value = color.hex_code;
        }
    } else {
        title.textContent = 'Add Color';
    }

    modal.classList.add('active');
}

window.editColor = openColorModal; // Expose to global scope

async function handleColorSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('color-id').value;
    const data = {
        name: document.getElementById('color-name').value,
        hex_code: document.getElementById('color-hex').value
    };

    try {
        if (id) {
            await API.updateColor(id, data);
            showSuccess('Color updated');
        } else {
            await API.createColor(data);
            showSuccess('Color created');
        }
        document.getElementById('color-modal').classList.remove('active');
        loadColors();
    } catch (error) {
        showError('Failed to save color');
    }
}

window.deleteColor = async function (id) {
    if (!confirm('Are you sure you want to delete this color?')) return;
    try {
        await API.deleteColor(id);
        showSuccess('Color deleted');
        loadColors();
    } catch (error) {
        showError('Failed to delete color');
    }
};

// ================= SIZES =================

async function loadSizes() {
    const container = document.getElementById('sizes-list');
    try {
        const response = await API.getSizes();
        sizes = response.results || response;
        renderSizes();
    } catch (error) {
        console.error('Error loading sizes:', error);
        container.innerHTML = '<p class="text-danger">Failed to load sizes</p>';
    }
}

function renderSizes() {
    const container = document.getElementById('sizes-list');
    if (sizes.length === 0) {
        container.innerHTML = '<p class="text-muted">No sizes added yet.</p>';
        return;
    }

    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Order</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${sizes.map(s => `
                    <tr>
                        <td><strong>${s.name}</strong></td>
                        <td>${s.sort_order}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="editSize(${s.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteSize(${s.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function openSizeModal(id = null) {
    const modal = document.getElementById('size-modal');
    const form = document.getElementById('size-form');
    const title = document.getElementById('size-modal-title');

    form.reset();
    document.getElementById('size-id').value = '';
    document.getElementById('size-order').value = '0';

    if (id) {
        const size = sizes.find(s => s.id === id);
        if (size) {
            title.textContent = 'Edit Size';
            document.getElementById('size-id').value = size.id;
            document.getElementById('size-name').value = size.name;
            document.getElementById('size-order').value = size.sort_order;
        }
    } else {
        title.textContent = 'Add Size';
    }

    modal.classList.add('active');
}

window.editSize = openSizeModal;

async function handleSizeSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('size-id').value;
    const data = {
        name: document.getElementById('size-name').value,
        sort_order: parseInt(document.getElementById('size-order').value) || 0
    };

    try {
        if (id) {
            await API.updateSize(id, data);
            showSuccess('Size updated');
        } else {
            await API.createSize(data);
            showSuccess('Size created');
        }
        document.getElementById('size-modal').classList.remove('active');
        loadSizes();
    } catch (error) {
        showError('Failed to save size');
    }
}

window.deleteSize = async function (id) {
    if (!confirm('Are you sure you want to delete this size?')) return;
    try {
        await API.deleteSize(id);
        showSuccess('Size deleted');
        loadSizes();
    } catch (error) {
        showError('Failed to delete size');
    }
};

// ================= LOCATIONS =================

async function loadLocations() {
    const container = document.getElementById('locations-list');
    try {
        const response = await API.getDeliveryLocations();
        locations = response.results || response;
        renderLocations();
    } catch (error) {
        console.error('Error loading locations:', error);
        container.innerHTML = '<p class="text-danger">Failed to load locations</p>';
    }
}

function renderLocations() {
    const container = document.getElementById('locations-list');
    if (locations.length === 0) {
        container.innerHTML = '<p class="text-muted">No locations added yet.</p>';
        return;
    }

    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${locations.map(l => `
                    <tr>
                        <td>${l.name}</td>
                        <td>${formatCurrency(l.price)}</td>
                        <td>
                            <span class="badge badge-${l.is_active ? 'active' : 'inactive'}">
                                ${l.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="editLocation(${l.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteLocation(${l.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function openLocationModal(id = null) {
    const modal = document.getElementById('location-modal');
    const form = document.getElementById('location-form');
    const title = document.getElementById('location-modal-title');

    form.reset();
    document.getElementById('location-id').value = '';
    document.getElementById('location-active').checked = true;

    if (id) {
        const loc = locations.find(l => l.id === id);
        if (loc) {
            title.textContent = 'Edit Location';
            document.getElementById('location-id').value = loc.id;
            document.getElementById('location-name').value = loc.name;
            document.getElementById('location-price').value = loc.price;
            document.getElementById('location-active').checked = loc.is_active;
        }
    } else {
        title.textContent = 'Add Location';
    }

    modal.classList.add('active');
}

window.editLocation = openLocationModal;

async function handleLocationSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('location-id').value;
    const data = {
        name: document.getElementById('location-name').value,
        price: parseFloat(document.getElementById('location-price').value),
        is_active: document.getElementById('location-active').checked
    };

    try {
        if (id) {
            await API.updateDeliveryLocation(id, data);
            showSuccess('Location updated');
        } else {
            await API.createDeliveryLocation(data);
            showSuccess('Location created');
        }
        document.getElementById('location-modal').classList.remove('active');
        loadLocations();
    } catch (error) {
        showError('Failed to save location');
    }
}

window.deleteLocation = async function (id) {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
        await API.deleteDeliveryLocation(id);
        showSuccess('Location deleted');
        loadLocations();
    } catch (error) {
        showError('Failed to delete location');
    }
};

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(amount);
}
