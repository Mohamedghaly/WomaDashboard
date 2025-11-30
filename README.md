# Woma Dashboard

Admin dashboard for Woma E-commerce platform.

## 🚀 Live Demo

- **Backend API**: https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app
- **Dashboard**: Deploy to Netlify

## 📦 What's Included

- Login/Authentication
- Dashboard Overview
- Products Management
- Categories Management
- Orders Management
- Responsive Design

## 🔧 Configuration

The dashboard is pre-configured to connect to the production backend:
- Production API: `https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app/api/v1`
- Local API: `http://localhost:8000/api/v1` (auto-detected)

## 🚀 Deploy to Netlify

### Quick Deploy (3 Steps)

1. **Go to Netlify**
   - Visit: https://app.netlify.com

2. **Import from GitHub**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select: `Mohamedghaly/WomaDashboard`

3. **Configure & Deploy**
   - **Base directory**: `dashboard`
   - **Build command**: (leave empty)
   - **Publish directory**: `.`
   - Click "Deploy site"

### Configuration

The `netlify.toml` file is already configured with:
- Publish directory: `dashboard`
- Redirect rules for SPA behavior
- Security headers

## 🔐 Login

Use your backend admin credentials created via:
```bash
python manage.py createsuperuser
```

## 📁 Project Structure

```
WomaDashboard/
├── dashboard/
│   ├── index.html          # Login page
│   ├── dashboard.html      # Main dashboard
│   ├── products.html       # Products management
│   ├── categories.html     # Categories management
│   ├── orders.html         # Orders management
│   ├── css/
│   │   └── style.css       # Styles
│   └── js/
│       ├── api.js          # API client
│       ├── auth.js         # Authentication
│       ├── dashboard.js    # Dashboard logic
│       ├── products.js     # Products logic
│       ├── categories.js   # Categories logic
│       └── orders.js       # Orders logic
└── netlify.toml            # Netlify configuration
```

## 🌐 Backend Repository

https://github.com/Mohamedghaly/WomaBackend

## 📚 Documentation

- See `dashboard/README.md` for detailed dashboard documentation
- See `dashboard/TROUBLESHOOTING.md` for common issues
- See `dashboard/VARIATIONS_GUIDE.md` for product variations guide

## 🎯 Features

- ✅ User Authentication (JWT)
- ✅ Dashboard Analytics
- ✅ Product Management (CRUD)
- ✅ Category Management (CRUD)
- ✅ Order Management
- ✅ Product Variations Support
- ✅ Responsive Design
- ✅ Real-time API Integration

## 🔄 Continuous Deployment

Once deployed to Netlify:
- Every push to `main` branch automatically deploys
- No manual steps needed
- Instant updates

## 📞 Support

For issues or questions, check the troubleshooting guide or create an issue on GitHub.

---

**Ready to deploy?** Go to https://app.netlify.com and follow the steps above! 🚀
