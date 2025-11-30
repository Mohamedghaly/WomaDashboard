// Categories Management Logic
let allCategories = [];
let currentCategory = null;

async function loadCategories() {
    const container = document.getElementById('categories-grid');
    container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading categories...</p></div>';

    try {
        const response = await API.getCategories();
        allCategories = response.results || response;

        if (allCategories.length === 0) {
            container.innerHTML = '<p class="text-muted" style="text-align:center;padding:40px;">No categories found. Click "Add Category" to create one.</p>';
            return;
        }

        renderCategories(allCategories);
    } catch (error) {
        container.innerHTML = '<p style="color:var(--danger);text-align:center;padding:40px;">Error loading categories</p>';
        console.error('Error:', error);
    }
}

function renderCategories(categories) {
    const container = document.getElementById('categories-grid');

    const html = `
        <div class="categories-grid">
            ${categories.map(category => `
                <div class="category-card">
                    <h3>${category.name}</h3>
                    <p>${category.description || 'No description'}</p>
                    <p style="color:var(--text-light);font-size:13px;">
                        ${category.product_count || 0} products • ${category.slug}
                    </p>
                    <div class="category-actions">
                        <button class="btn btn-sm btn-secondary" onclick="editCategory('${category.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category.id}')">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = html;
}

function openCategoryModal(category = null) {
    currentCategory = category;
    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form');
    const title = document.getElementById('modal-title');

    if (category) {
        title.textContent = 'Edit Category';
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-description').value = category.description || '';
    } else {
        title.textContent = 'Add Category';
        form.reset();
    }

    modal.classList.add('active');
}

function closeCategoryModal() {
    document.getElementById('category-modal').classList.remove('active');
    currentCategory = null;
}

async function editCategory(id) {
    const category = allCategories.find(c => c.id === id);
    if (category) {
        openCategoryModal(category);
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
        await API.deleteCategory(id);
        showSuccess('Category deleted successfully');
        loadCategories();
    } catch (error) {
        showError('Error deleting category. It may have products associated with it.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();

    document.getElementById('add-category-btn').addEventListener('click', () => openCategoryModal());

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeCategoryModal);
    });

    document.getElementById('category-modal').addEventListener('click', (e) => {
        if (e.target.id === 'category-modal') closeCategoryModal();
    });

    document.getElementById('category-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById('category-name').value,
            description: document.getElementById('category-description').value
        };

        try {
            if (currentCategory) {
                await API.updateCategory(currentCategory.id, data);
                showSuccess('Category updated successfully');
            } else {
                await API.createCategory(data);
                showSuccess('Category created successfully');
            }

            closeCategoryModal();
            loadCategories();
        } catch (error) {
            showError(error.name?.[0] || 'Error saving category');
        }
    });
});
