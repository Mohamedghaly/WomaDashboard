# Woma Admin Dashboard

A modern, responsive admin dashboard for the Woma E-commerce backend.

## Features

### 📊 Dashboard Overview
- Quick statistics (products, categories, orders)
- Recent orders list
- Quick actions

### 📦 Product Management
- List all products with search and filtering
- Create/Edit/Delete products
- View product variations
- Category assignment

### 📁 Category Management
- Grid view of all categories
- Create/Edit/Delete categories
- Product count tracking

### 🛒 Order Management
- List all orders with status filtering
- View detailed order information
- Update order status
- View order items with variations

## Getting Started

### 1. Start the Backend Server
```bash
cd /Users/mohamedghaly/Desktop/WomaBackend
source venv/bin/activate
python manage.py runserver
```

### 2. Open the Dashboard
Simply open `index.html` in your browser or use a local server:

```bash
# Option 1: Open directly
open dashboard/index.html

# Option 2: Use Python's built-in server
cd dashboard
python3 -m http.server 8080
# Then visit: http://localhost:8080
```

### 3. Login
Default credentials:
- **Email**: admin@woma.com
- **Password**: admin123

## Project Structure

```
dashboard/
├── index.html           # Login page
├── dashboard.html       # Dashboard overview
├── products.html        # Products management
├── categories.html      # Categories management
├── orders.html          # Orders management
├── css/
│   └── style.css       # All styles
└── js/
    ├── api.js          # API client & utilities
    ├── auth.js         # Authentication logic
    ├── dashboard.js    # Dashboard page logic
    ├── products.js     # Products page logic
    ├── categories.js   # Categories page logic
    └── orders.js       # Orders page logic
```

## Features Detail

### Authentication
- JWT token-based authentication
- Automatic token storage in localStorage
- Auto-redirect to login if not authenticated
- Logout functionality

### Product Management
- View all products in a table
- Search products by name/description
- Filter by category
- Add/Edit products with full details:
  - Name, category, description
  - Price, stock quantity
  - Image URL
  - Active/inactive status
- Delete products
- View variation count

### Category Management
- Grid view of categories
- See product count per category
- Add/Edit categories
- Delete categories (with validation)

### Order Management
- View all orders in a table
- Filter by status (pending, processing, completed, cancelled)
- View detailed order information:
  - Customer details
  - Order items with variations
  - Shipping address
  - Order total
- Update order status

## Design Features

- **Modern UI**: Clean, professional design with gradient colors
- **Responsive**: Works on desktop, tablet, and mobile
- **Dark Sidebar**: Sleek navigation with active states
- **Loading States**: Spinners while data loads
- **Modals**: For adding/editing items
- **Toast Notifications**: Success/error messages
- **Status Badges**: Color-coded order/product statuses
- **Hover Effects**: Interactive buttons and cards

## API Integration

The dashboard connects to your backend API at:
- **Base URL**: `http://localhost:8000/api/v1`
- **Authentication**: Bearer token in Authorization header
- **Endpoints Used**:
  - `/auth/login/` - Login
  - `/auth/profile/` - Get user profile
  - `/admin/categories/` - Categories CRUD
  - `/admin/products/` - Products CRUD
  - `/admin/orders/` - Orders management
  - `/admin/variations/` - Variations (future feature)

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Notes

- Make sure CORS is enabled in your backend (already configured)
- Backend must be running on `localhost:8000`
- All API calls require admin authentication
- Images are shown via URL (no file uploads in this version)

## Future Enhancements

- Variation management UI
- Customer management
- Analytics/Charts
- File upload for images
- Bulk operations
- Export data (CSV/Excel)
- Real-time updates
- Dark mode toggle

---

**Built with**: Vanilla JavaScript, CSS3, HTML5
**Backend**: Django REST Framework
**Authentication**: JWT
