// Products Management Logic
let allProducts = [];
let allCategories = [];
let currentProduct = null;
let currentProductForVariations = null;
let attributeCounter = 0;

async function loadProducts() {
    const container = document.getElementById('products-table');
    container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading products...</p></div>';

    try {
        const response = await API.getProducts();
        allProducts = response.results || response;

        if (allProducts.length === 0) {
            container.innerHTML = '<p class="text-muted" style="text-align:center;padding:40px;">No products found. Click "Add Product" to create one.</p>';
            return;
        }

        renderProducts(allProducts);
    } catch (error) {
        container.innerHTML = '<p style="color:var(--danger);text-align:center;padding:40px;">Error loading products</p>';
        console.error('Error:', error);
    }
}

function renderProducts(products) {
    const container = document.getElementById('products-table');

    const html = `
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Base Price</th>
                    <th>Total Stock</th>
                    <th>Variations</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>
                            <strong>${product.name}</strong><br>
                            <small style="color:var(--text-light)">${product.slug}</small>
                        </td>
                        <td>${product.category_name || 'N/A'}</td>
                        <td>${formatCurrency(product.price)}</td>
                        <td>${product.total_stock || 0}</td>
                        <td>
                            ${product.variation_count || 0}
                            ${product.variation_count > 0 ?
            `<button class="btn btn-sm" onclick="manageVariations('${product.id}')" style="margin-left: 8px;">Manage</button>` :
            `<button class="btn btn-sm btn-primary" onclick="manageVariations('${product.id}')" style="margin-left: 8px;">Add</button>`
        }
                        </td>
                        <td><span class="badge badge-${product.is_active ? 'active' : 'inactive'}">${product.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="editProduct('${product.id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

async function loadCategories() {
    try {
        const response = await API.getCategories();
        allCategories = response.results || response;

        const categoryFilter = document.getElementById('category-filter');
        const productCategory = document.getElementById('product-category');

        const options = allCategories.map(cat =>
            `<option value="${cat.id}">${cat.name}</option>`
        ).join('');

        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>' + options;
        }

        if (productCategory) {
            productCategory.innerHTML = '<option value="">Select category</option>' + options;
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function openProductModal(product = null) {
    currentProduct = product;
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('modal-title');

    if (product) {
        title.textContent = 'Edit Product';
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-image').value = product.image_url || '';
        document.getElementById('product-active').checked = product.is_active;
    } else {
        title.textContent = 'Add Product';
        form.reset();
        document.getElementById('product-active').checked = true;
    }

    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
    currentProduct = null;
}

async function editProduct(id) {
    try {
        const product = await API.getProduct(id);
        openProductModal(product);
    } catch (error) {
        showError('Error loading product');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        await API.deleteProduct(id);
        showSuccess('Product deleted successfully');
        loadProducts();
    } catch (error) {
        showError('Error deleting product');
    }
}

// Variations Management
async function manageVariations(productId) {
    try {
        const product = await API.getProduct(productId);
        currentProductForVariations = product;

        document.getElementById('product-name-display').textContent = `Product: ${product.name} (Base price: ${formatCurrency(product.price)})`;
        document.getElementById('variations-modal').classList.add('active');

        await loadVariations(productId);
    } catch (error) {
        showError('Error loading product');
    }
}

async function loadVariations(productId) {
    const container = document.getElementById('variations-list');
    container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading variations...</p></div>';

    try {
        const response = await API.getVariations(productId);
        const variations = response.results || response;

        if (variations.length === 0) {
            container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light);">No variations yet. Click "Add Variation" to create one.</p>';
            return;
        }

        renderVariations(variations);
    } catch (error) {
        container.innerHTML = '<p style="color:var(--danger);text-align:center;padding:20px;">Error loading variations</p>';
    }
}

function renderVariations(variations) {
    const container = document.getElementById('variations-list');

    const html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Attributes</th>
                    <th>SKU</th>
                    <th>Price Adj.</th>
                    <th>Final Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${variations.map(v => `
                    <tr>
                        <td><strong>${v.display_name || v.name}</strong></td>
                        <td><small>${v.attributes_display || '-'}</small></td>
                        <td><small>${v.sku}</small></td>
                        <td>${v.price_adjustment >= 0 ? '+' : ''}${formatCurrency(v.price_adjustment)}</td>
                        <td><strong>${formatCurrency(v.final_price)}</strong></td>
                        <td>${v.stock_quantity}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="deleteVariation('${v.id}')">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
    container.innerHTML = html;
}

// Multi-Attribute Management
function addAttributeField() {
    const container = document.getElementById('attributes-container');

    const fieldHTML = `
        <div class="form-row attr-field" style="margin-bottom: 8px;">
            <div class="form-group" style="flex: 1; margin-bottom: 0;">
                <input type="text" class="attr-name" placeholder="Name (e.g., Color, Size)" required>
            </div>
            <div class="form-group" style="flex: 1; margin-bottom: 0;">
                <input type="text" class="attr-value" placeholder="Value (e.g., Red, Large)" required>
            </div>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeAttributeField(this)" style="height: 42px; margin: 0;">Remove</button>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', fieldHTML);
}

function removeAttributeField(button) {
    const container = document.getElementById('attributes-container');
    // Don't remove if it's the only field
    if (container.querySelectorAll('.attr-field').length > 1) {
        button.closest('.attr-field').remove();
    } else {
        showError('At least one attribute is required');
    }
}

function getAttributesFromForm() {
    const attributes = {};
    const container = document.getElementById('attributes-container');
    const fields = container.querySelectorAll('.attr-field');

    fields.forEach(field => {
        const name = field.querySelector('.attr-name').value.trim();
        const value = field.querySelector('.attr-value').value.trim();

        if (name && value) {
            attributes[name] = value;
        }
    });

    return attributes;
}

function clearAttributeFields() {
    const container = document.getElementById('attributes-container');
    // Keep one empty field
    container.innerHTML = `
        <div class="form-row attr-field" style="margin-bottom: 8px;">
            <div class="form-group" style="flex: 1; margin-bottom: 0;">
                <input type="text" class="attr-name" placeholder="Name (e.g., Color, Size)" required>
            </div>
            <div class="form-group" style="flex: 1; margin-bottom: 0;">
                <input type="text" class="attr-value" placeholder="Value (e.g., Red, Large)" required>
            </div>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeAttributeField(this)" style="height: 42px; margin: 0;">Remove</button>
        </div>
    `;
}

function openAddVariationForm() {
    document.getElementById('add-variation-form').style.display = 'block';
    document.getElementById('variation-form').reset();
    clearAttributeFields();
}

function closeAddVariationForm() {
    document.getElementById('add-variation-form').style.display = 'none';
    clearAttributeFields();
}

function closeVariationsModal() {
    document.getElementById('variations-modal').classList.remove('active');
    closeAddVariationForm();
    currentProductForVariations = null;
    loadProducts(); // Refresh to show updated variation count
}

async function deleteVariation(id) {
    if (!confirm('Are you sure you want to delete this variation?')) return;

    try {
        await API.deleteVariation(id);
        showSuccess('Variation deleted successfully');
        await loadVariations(currentProductForVariations.id);
    } catch (error) {
        showError('Error deleting variation');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCategories();

    document.getElementById('add-product-btn').addEventListener('click', () => openProductModal());

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeProductModal);
    });

    document.getElementById('product-modal').addEventListener('click', (e) => {
        if (e.target.id === 'product-modal') closeProductModal();
    });

    document.getElementById('variations-modal').addEventListener('click', (e) => {
        if (e.target.id === 'variations-modal') closeVariationsModal();
    });

    document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            category: document.getElementById('product-category').value,
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: document.getElementById('product-price').value,
            stock_quantity: 0, // Always 0, stock managed through variations
            image_url: document.getElementById('product-image').value,
            is_active: document.getElementById('product-active').checked
        };

        try {
            if (currentProduct) {
                await API.updateProduct(currentProduct.id, data);
                showSuccess('Product updated successfully');
            } else {
                await API.createProduct(data);
                showSuccess('Product created successfully');
            }

            closeProductModal();
            loadProducts();
        } catch (error) {
            showError(error.error || error.name?.[0] || 'Error saving product');
        }
    });

    // Variation form submit - MULTI-ATTRIBUTE COMBINATIONS
    document.getElementById('variation-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const imageUrl = document.getElementById('var-image').value;
        const attributes = getAttributesFromForm();

        // Validate that we have at least one attribute
        if (Object.keys(attributes).length === 0) {
            showError('Please add at least one attribute');
            return;
        }

        // Auto-generate variation name from attribute values
        // Example: {Color: "Red", Size: "Large"} → "Red Large"
        const variationName = Object.values(attributes).join(' ');

        const data = {
            product: currentProductForVariations.id,
            name: variationName,
            attributes: attributes,
            price_adjustment: document.getElementById('var-price-adj').value || "0.00",
            stock_quantity: parseInt(document.getElementById('var-stock').value),
            is_active: true,
            images: imageUrl ? [{
                image_url: imageUrl,
                is_primary: true,
                display_order: 0
            }] : []
        };

        try {
            await API.createVariation(data);
            showSuccess('Variation added successfully');
            closeAddVariationForm();
            await loadVariations(currentProductForVariations.id);
        } catch (error) {
            showError(error.error || error.name?.[0] || 'Error creating variation');
        }
    });

    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        const search = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p =>
            p.name.toLowerCase().includes(search) ||
            (p.description && p.description.toLowerCase().includes(search))
        );
        renderProducts(filtered);
    });

    // Category filter
    document.getElementById('category-filter').addEventListener('change', (e) => {
        const categoryId = e.target.value;
        if (categoryId) {
            const filtered = allProducts.filter(p => p.category === categoryId);
            renderProducts(filtered);
        } else {
            renderProducts(allProducts);
        }
    });
});
