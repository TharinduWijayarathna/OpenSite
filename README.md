# OpenSite

**Transform your static sites into dynamic content management experiences.**

OpenSite is a modern web application built with Laravel and React that empowers users to create and manage dynamic content for static websites through an intuitive web interface.

## 🚀 Quick Setup

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ and npm

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/TharinduWijayarathna/OpenSite.git
   cd OpenSite
   composer install
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   touch database/database.sqlite
   php artisan migrate
   ```

3. **Start development**
   ```bash
   composer dev
   ```

This starts the complete development stack at http://localhost:8000

### Alternative Development Commands

```bash
# Backend only
php artisan serve

# Frontend only  
npm run dev

# Run tests
composer test

# Build for production
npm run build
```

## 🛠️ Tech Stack

- **Backend**: Laravel 12, Inertia.js
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Database**: SQLite (default)

---

Built with ❤️ using Laravel and React
