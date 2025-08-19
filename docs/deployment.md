# Deployment Guide

This guide covers deploying Campus Syllabus Hub to various cloud platforms and production environments.

## 🚀 Production Deployment Options

### Quick Deploy Options

#### 1. **Railway** (Recommended for beginners)
- **Cost**: Free tier available, $5/month for production
- **Features**: Automatic deployments, managed database, SSL certificates
- **Setup Time**: 10-15 minutes

#### 2. **Render**
- **Cost**: Free tier available, $7/month for web services
- **Features**: Auto-deploy from Git, managed PostgreSQL/MongoDB
- **Setup Time**: 15-20 minutes

#### 3. **DigitalOcean App Platform**
- **Cost**: $5-12/month depending on resources
- **Features**: Managed infrastructure, auto-scaling, monitoring
- **Setup Time**: 20-30 minutes

#### 4. **Self-Hosted (VPS)**
- **Cost**: $5-20/month for VPS
- **Features**: Full control, custom configuration
- **Setup Time**: 1-2 hours

---

## 🛠️ Pre-Deployment Checklist

### Environment Preparation
- [ ] MongoDB database (Atlas or self-hosted)
- [ ] Domain name configured
- [ ] SSL certificate ready
- [ ] Environment variables prepared
- [ ] Build process tested locally

### Security Configuration
- [ ] JWT secrets generated (64+ characters)
- [ ] Database credentials secured
- [ ] CORS origins configured
- [ ] Rate limiting configured
- [ ] Security headers enabled

### Performance Optimization
- [ ] Database indexes created
- [ ] Image assets optimized
- [ ] Bundle size analyzed
- [ ] CDN configured (optional)

---

## 🔥 Railway Deployment (Recommended)

Railway provides the easiest deployment experience with zero-config deployments.

### Step 1: Prepare the Repository

Ensure your repository has the correct structure:

```
campus-syllabus-hub/
├── apps/
│   ├── api/
│   └── web/
├── package.json
├── pnpm-workspace.yaml
└── railway.json (we'll create this)
```

Create `railway.json` in the root:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Step 2: Configure Railway Projects

#### API Service Configuration

Create `apps/api/railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd ../.. && pnpm install && pnpm --filter api build"
  },
  "deploy": {
    "startCommand": "cd apps/api && pnpm start",
    "healthcheckPath": "/healthz",
    "healthcheckTimeout": 100
  }
}
```

#### Web Service Configuration

Create `apps/web/railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd ../.. && pnpm install && pnpm --filter web build"
  },
  "deploy": {
    "startCommand": "cd apps/web && pnpm preview --host 0.0.0.0 --port $PORT"
  }
}
```

### Step 3: Deploy Services

1. **Create Railway Account**: Sign up at [railway.app](https://railway.app)

2. **Deploy Database**:
   ```bash
   # In Railway dashboard
   # New Project → Add MongoDB → Note connection string
   ```

3. **Deploy API**:
   ```bash
   # Connect GitHub repository
   # Select apps/api folder as root
   # Configure environment variables:
   ```
   
   Environment Variables for API:
   ```env
   NODE_ENV=production
   PORT=8080
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campus_syllabus_hub
   JWT_ACCESS_SECRET=your-super-secure-access-secret-64-chars-minimum
   JWT_REFRESH_SECRET=your-super-secure-refresh-secret-64-chars-minimum
   ACCESS_TOKEN_TTL=15m
   REFRESH_TOKEN_TTL=7d
   CORS_ORIGIN=https://your-frontend-domain.railway.app
   COOKIE_SECURE=true
   ```

4. **Deploy Frontend**:
   ```bash
   # Create new service
   # Connect same repository
   # Select apps/web folder as root
   ```
   
   Environment Variables for Web:
   ```env
   VITE_API_URL=https://your-api-domain.railway.app/api/v1
   ```

### Step 4: Seed Database

```bash
# After API is deployed, seed the database
railway run --service your-api-service pnpm seed
```

---

## 🌊 Render Deployment

Render offers similar managed hosting with excellent documentation.

### Step 1: Database Setup

1. Create MongoDB database (Atlas recommended)
2. Note connection string and credentials

### Step 2: API Deployment

1. **Create Web Service** on Render
2. **Connect Repository** and select `apps/api` folder
3. **Configure Build & Deploy**:

```yaml
# render.yaml (place in repository root)
services:
  - type: web
    name: campus-syllabus-hub-api
    env: node
    region: oregon
    plan: starter
    buildCommand: cd apps/api && pnpm install && pnpm build
    startCommand: cd apps/api && pnpm start
    healthCheckPath: /healthz
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false
      - key: JWT_ACCESS_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        value: https://your-frontend-url.onrender.com
      - key: COOKIE_SECURE
        value: true

  - type: web
    name: campus-syllabus-hub-web
    env: static
    region: oregon
    plan: starter
    buildCommand: cd apps/web && pnpm install && pnpm build
    staticPublishPath: apps/web/dist
    envVars:
      - key: VITE_API_URL
        value: https://your-api-url.onrender.com/api/v1
```

---

## ☁️ DigitalOcean App Platform

Excellent for production workloads with auto-scaling capabilities.

### Step 1: App Specification

Create `.do/app.yaml`:

```yaml
name: campus-syllabus-hub
region: nyc
services:
  - name: api
    source_dir: apps/api
    github:
      repo: your-username/campus-syllabus-hub
      branch: main
    run_command: pnpm start
    build_command: pnpm install && pnpm build
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    routes:
      - path: /api
    envs:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        type: SECRET
      - key: JWT_ACCESS_SECRET
        type: SECRET
      - key: JWT_REFRESH_SECRET
        type: SECRET
      - key: CORS_ORIGIN
        value: ${web.DEPLOYED_URL}
    health_check:
      http_path: /healthz

  - name: web
    source_dir: apps/web
    github:
      repo: your-username/campus-syllabus-hub
      branch: main
    build_command: pnpm install && pnpm build
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    routes:
      - path: /
    envs:
      - key: VITE_API_URL
        value: ${api.DEPLOYED_URL}/api/v1

databases:
  - name: mongodb
    engine: MONGODB
    version: "6"
    size: basic-xs
```

### Step 2: Deploy

```bash
# Install DigitalOcean CLI
brew install doctl  # macOS
# or download from https://github.com/digitalocean/doctl

# Authenticate
doctl auth init

# Deploy
doctl apps create --spec .do/app.yaml
```

---

## 🖥️ Self-Hosted VPS Deployment

For maximum control and cost optimization.

### Prerequisites

- Ubuntu 20.04+ or CentOS 8+ VPS
- Domain name pointed to VPS IP
- SSH access to server

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2 for process management
npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### Step 2: MongoDB Setup

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Secure MongoDB
sudo mongo
> use admin
> db.createUser({user: "admin", pwd: "secure_password", roles: ["root"]})
> exit

# Enable authentication
sudo sed -i 's/#security:/security:\n  authorization: enabled/' /etc/mongod.conf
sudo systemctl restart mongod
```

### Step 3: Application Deployment

```bash
# Create deployment user
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo su - deploy

# Clone repository
git clone https://github.com/your-username/campus-syllabus-hub.git
cd campus-syllabus-hub

# Install dependencies
pnpm install

# Build applications
pnpm -r build

# Configure environment
cp apps/api/.env.sample apps/api/.env
cp apps/web/.env.sample apps/web/.env

# Edit environment files with production values
nano apps/api/.env
nano apps/web/.env
```

### Step 4: PM2 Process Management

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'campus-api',
      cwd: './apps/api',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '/var/log/pm2/campus-api-error.log',
      out_file: '/var/log/pm2/campus-api-out.log',
      log_file: '/var/log/pm2/campus-api.log',
    },
    {
      name: 'campus-web',
      cwd: './apps/web',
      script: 'npx',
      args: 'serve -s dist -p 3000',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/pm2/campus-web-error.log',
      out_file: '/var/log/pm2/campus-web-out.log',
      log_file: '/var/log/pm2/campus-web.log',
    }
  ]
};
```

```bash
# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 5: Nginx Configuration

Create `/etc/nginx/sites-available/campus-syllabus-hub`:

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

# Upstream servers
upstream api_backend {
    server 127.0.0.1:4000;
}

upstream web_backend {
    server 127.0.0.1:3000;
}

# HTTP redirect to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL configuration (Certbot will handle this)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # API routes
    location /api/ {
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Auth routes with stricter rate limiting
    location /api/v1/auth/ {
        limit_req zone=auth burst=5 nodelay;
        
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend routes
    location / {
        proxy_pass http://web_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Health check endpoint
    location /healthz {
        proxy_pass http://api_backend;
        access_log off;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/campus-syllabus-hub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: SSL Certificate

```bash
# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6.0
        env:
          MONGO_INITDB_ROOT_USERNAME: admin
          MONGO_INITDB_ROOT_PASSWORD: password
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Type check
        run: pnpm -r typecheck
      
      - name: Lint
        run: pnpm -r lint
      
      - name: Test API
        run: pnpm --filter api test
        env:
          MONGO_URI: mongodb://admin:password@localhost:27017/test?authSource=admin
          JWT_ACCESS_SECRET: test-secret
          JWT_REFRESH_SECRET: test-refresh-secret
      
      - name: Test Web
        run: pnpm --filter web test
      
      - name: Build
        run: pnpm -r build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        uses: railwayapp/railway-deploy@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE }}
```

---

## 📊 Monitoring & Maintenance

### Application Monitoring

#### Health Check Endpoints

```typescript
// apps/api/src/routes/health.ts
export const healthCheck = (req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  };

  res.status(200).json(health);
};
```

#### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart all

# Reload with zero downtime
pm2 reload all
```

### Database Monitoring

```bash
# MongoDB status
sudo systemctl status mongod

# Database statistics
mongo admin -u admin -p
> db.stats()
> db.runCommand({dbStats: 1})

# Connection monitoring
> db.serverStatus().connections
```

### Log Management

```bash
# Rotate logs with logrotate
sudo nano /etc/logrotate.d/campus-syllabus-hub
```

```
/var/log/pm2/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 deploy deploy
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Backup Strategy

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/campus-syllabus-hub"
DB_NAME="campus_syllabus_hub"

# Create backup directory
mkdir -p $BACKUP_DIR

# MongoDB backup
mongodump --db $DB_NAME --out $BACKUP_DIR/mongodb_$DATE

# Compress backup
tar -czf $BACKUP_DIR/mongodb_$DATE.tar.gz -C $BACKUP_DIR mongodb_$DATE
rm -rf $BACKUP_DIR/mongodb_$DATE

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_DIR/mongodb_$DATE.tar.gz s3://your-backup-bucket/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "mongodb_*.tar.gz" -mtime +30 -delete

echo "Backup completed: mongodb_$DATE.tar.gz"
```

```bash
# Schedule daily backups
crontab -e
# Add line: 0 2 * * * /home/deploy/backup.sh
```

---

## 🚨 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs campus-api
pm2 logs campus-web

# Check environment variables
pm2 env 0

# Restart services
pm2 restart all
```

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
mongo "mongodb://localhost:27017/campus_syllabus_hub"

# Check network connectivity
telnet localhost 27017
```

#### High Memory Usage
```bash
# Check process memory
pm2 monit

# Restart application
pm2 restart all

# Check system memory
free -h
top
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect yourdomain.com:443
```

### Performance Optimization

#### Database Indexing
```javascript
// Create production indexes
db.resources.createIndex({ "subjectRef": 1, "isApproved": 1, "qualityScore": -1 })
db.resources.createIndex({ "title": "text", "description": "text", "topics": "text" })
db.roadmaps.createIndex({ "subjectRef": 1, "averageRating": -1 })
```

#### Application Caching
```bash
# Install Redis for caching
sudo apt install redis-server
sudo systemctl enable redis-server
```

#### CDN Setup (Optional)
Consider using CloudFlare, AWS CloudFront, or similar CDN for static assets.

---

## 📋 Deployment Checklist

### Pre-Deploy
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] SSL certificates ready
- [ ] Domain DNS configured
- [ ] Backup strategy implemented

### Deploy
- [ ] Application builds successfully
- [ ] All tests pass
- [ ] Database seeded (if needed)
- [ ] Health checks pass
- [ ] SSL certificate active

### Post-Deploy
- [ ] Application accessible via domain
- [ ] All features working
- [ ] Monitoring configured
- [ ] Backup tested
- [ ] Performance verified

### Security
- [ ] Firewall configured
- [ ] Database secured
- [ ] SSH keys configured
- [ ] Regular updates scheduled
- [ ] Log monitoring active

---

This deployment guide provides multiple options from beginner-friendly managed solutions to advanced self-hosted setups. Choose the option that best fits your technical expertise and requirements!
