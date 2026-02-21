# 🚀 Hostinger + Vercel Deployment Guide

## Will Real-Time Tracking Work?

**YES!** ✅ The polling-based approach works perfectly with Hostinger + Vercel.

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                        │
│              https://your-app.vercel.app                    │
│                                                             │
│  Admin updates match → Polls every 2s → Viewers see live   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTPS API Calls
                   │ (Works across internet)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                 HOSTINGER (Backend)                         │
│            https://api.yourdomain.com                       │
│                                                             │
│  Laravel API → MySQL Database → Returns JSON                │
└─────────────────────────────────────────────────────────────┘
```

**Why it works:**
- ✅ Uses standard HTTPS requests (no WebSocket needed)
- ✅ Polling every 2 seconds is efficient enough
- ✅ Works across different domains with CORS
- ✅ No special server requirements
- ✅ Reliable and battle-tested approach

---

## 📋 Deployment Checklist

### Part 1: Hostinger (Laravel Backend)

#### Step 1: Prepare Laravel for Production

**1. Update `.env` for production:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

FRONTEND_URL=https://your-app.vercel.app

SESSION_DRIVER=database
CACHE_DRIVER=database
QUEUE_CONNECTION=database
```

**2. Update CORS configuration:**

Edit `config/cors.php`:
```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'https://your-app.vercel.app',
        'https://*.vercel.app', // For preview deployments
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => false,
];
```

**3. Optimize Laravel:**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Step 2: Deploy to Hostinger

**Option A: Using Git (Recommended)**

1. **Connect to Hostinger via SSH**
   ```bash
   ssh username@your-server-ip
   ```

2. **Navigate to public_html or your domain folder**
   ```bash
   cd public_html
   # or
   cd domains/api.yourdomain.com/public_html
   ```

3. **Clone your repository**
   ```bash
   git clone https://github.com/yourusername/handball-website.git .
   ```

4. **Install dependencies**
   ```bash
   composer install --optimize-autoloader --no-dev
   ```

5. **Set up environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your production settings
   php artisan key:generate
   ```

6. **Run migrations**
   ```bash
   php artisan migrate --force
   ```

7. **Set permissions**
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

**Option B: Using File Manager**

1. Zip your Laravel project locally
2. Upload via Hostinger File Manager
3. Extract in the correct directory
4. Follow steps 4-7 from Option A via SSH

#### Step 3: Configure Hostinger

**1. Point domain to Laravel public folder:**
   - In Hostinger control panel
   - Go to "Domains" → "Manage"
   - Set document root to: `/public_html/public` or `/domains/api.yourdomain.com/public_html/public`

**2. Create MySQL database:**
   - In Hostinger control panel
   - Go to "Databases" → "MySQL Databases"
   - Create database, user, and password
   - Update `.env` with these credentials

**3. Set up SSL:**
   - Hostinger provides free SSL
   - Enable it in control panel
   - Force HTTPS in `.htaccess` (already configured in Laravel)

#### Step 4: Test Backend

```bash
# Test API endpoint
curl https://api.yourdomain.com/api/games

# Should return JSON response
```

---

### Part 2: Vercel (Next.js Frontend)

#### Step 1: Prepare Next.js for Production

**1. Update environment variables:**

Create `.env.production`:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```

**2. Update `next.config.mjs`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.yourdomain.com'], // If you serve images from backend
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

#### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd handball-frontend
   vercel
   ```

4. **Set environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL production
   # Enter: https://api.yourdomain.com/api
   ```

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

**Option B: Using Vercel Dashboard (Easier)**

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select `handball-frontend` folder as root directory

3. **Configure:**
   - Framework Preset: Next.js
   - Root Directory: `handball-frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add environment variables:**
   - In project settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_BASE_URL` = `https://api.yourdomain.com/api`

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

#### Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain (e.g., `handball.yourdomain.com`)
3. Update DNS records as instructed by Vercel
4. Update CORS in Laravel to include new domain

---

## 🔧 Configuration Updates

### Update Laravel CORS for Vercel

Edit `handball-website/config/cors.php`:
```php
'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:3000'),
    'https://your-app.vercel.app',
    'https://*.vercel.app', // For preview deployments
],
```

### Update Frontend API URL

Edit `handball-frontend/.env.production`:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```

---

## 🧪 Testing Production Setup

### Test Backend (Hostinger)

```bash
# Test basic API
curl https://api.yourdomain.com/api/games

# Test live match endpoint
curl https://api.yourdomain.com/api/games/1/live

# Test CORS
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.yourdomain.com/api/games/1/live-update
```

### Test Frontend (Vercel)

1. Open `https://your-app.vercel.app/admin/games`
2. Click live tracking button
3. Check browser console for errors
4. Verify API calls are going to Hostinger

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors

**Symptom:** Browser console shows CORS error

**Solution:**
```php
// In Laravel config/cors.php
'allowed_origins' => [
    'https://your-app.vercel.app',
    'https://*.vercel.app',
],

'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
```

### Issue 2: 500 Internal Server Error

**Symptom:** API returns 500 error

**Solution:**
```bash
# Check Laravel logs
ssh username@your-server
tail -f storage/logs/laravel.log

# Common fixes:
php artisan config:clear
php artisan cache:clear
chmod -R 755 storage bootstrap/cache
```

### Issue 3: Database Connection Failed

**Symptom:** Can't connect to database

**Solution:**
```bash
# Check .env settings
DB_HOST=localhost  # Not 127.0.0.1 on some hosts
DB_PORT=3306
DB_DATABASE=correct_name
DB_USERNAME=correct_user
DB_PASSWORD=correct_password

# Test connection
php artisan tinker
DB::connection()->getPdo();
```

### Issue 4: Migrations Not Running

**Symptom:** Tables don't exist

**Solution:**
```bash
# SSH into Hostinger
php artisan migrate:status
php artisan migrate --force

# If issues persist:
php artisan migrate:fresh --force  # WARNING: Deletes all data!
```

### Issue 5: Slow API Response

**Symptom:** Live tracking is laggy

**Solution:**
```php
// Enable query caching in Laravel
// Add to .env
CACHE_DRIVER=database

// Optimize queries
php artisan optimize
```

---

## ⚡ Performance Optimization

### Laravel (Hostinger)

```bash
# Enable OPcache (ask Hostinger support if not enabled)
# Add to .htaccess or php.ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000

# Use database caching
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize composer autoloader
composer install --optimize-autoloader --no-dev
```

### Next.js (Vercel)

```javascript
// next.config.mjs
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

---

## 🔒 Security Checklist

### Laravel (Hostinger)

- [ ] `APP_DEBUG=false` in production
- [ ] Strong `APP_KEY` generated
- [ ] Database credentials secure
- [ ] CORS properly configured
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (use Eloquent)
- [ ] XSS protection enabled

### Next.js (Vercel)

- [ ] Environment variables set in Vercel
- [ ] No sensitive data in client-side code
- [ ] API calls use HTTPS only
- [ ] CORS headers properly set
- [ ] Content Security Policy configured

---

## 📊 Monitoring

### Laravel Logs (Hostinger)

```bash
# View logs in real-time
ssh username@your-server
tail -f storage/logs/laravel.log

# Or download and view locally
scp username@your-server:/path/to/storage/logs/laravel.log ./
```

### Vercel Logs

- Go to Vercel dashboard
- Select your project
- Click "Logs" tab
- View real-time deployment and runtime logs

---

## 🚀 Deployment Workflow

### For Updates

**Backend (Hostinger):**
```bash
# SSH into server
ssh username@your-server
cd /path/to/your/app

# Pull latest changes
git pull origin main

# Update dependencies
composer install --optimize-autoloader --no-dev

# Run migrations
php artisan migrate --force

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
```

**Frontend (Vercel):**
```bash
# Just push to GitHub
git add .
git commit -m "Update"
git push origin main

# Vercel auto-deploys!
```

---

## ✅ Final Checklist

### Before Going Live

- [ ] Laravel deployed to Hostinger
- [ ] Database created and migrated
- [ ] SSL enabled on backend
- [ ] CORS configured correctly
- [ ] Next.js deployed to Vercel
- [ ] Environment variables set
- [ ] Custom domains configured (if any)
- [ ] Test live tracking works
- [ ] Test from mobile device
- [ ] Check browser console for errors
- [ ] Verify API calls succeed
- [ ] Test finalize match flow
- [ ] Check rankings update correctly
- [ ] Monitor logs for errors

---

## 🎯 Summary

**Your Setup:**
- ✅ Laravel on Hostinger (Backend API)
- ✅ Next.js on Vercel (Frontend)
- ✅ Polling-based real-time (works perfectly!)
- ✅ Uses existing `rankings` table
- ✅ No WebSocket needed
- ✅ Production-ready

**Real-time works because:**
- Frontend polls backend every 2 seconds
- Standard HTTPS requests (no special requirements)
- CORS properly configured
- Reliable across internet

**You're all set!** 🎉

Just follow the deployment steps above and your live match tracking will work perfectly on Hostinger + Vercel.
