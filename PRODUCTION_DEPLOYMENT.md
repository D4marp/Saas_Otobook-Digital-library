# 🚀 Production Deployment Guide

## Overview

This guide covers deploying OTobook SaaS to production with full security hardening.

## Pre-Deployment Checklist ✅

- [ ] Review [SECURITY_DEPLOYMENT.md](./SECURITY_DEPLOYMENT.md)
- [ ] Generate strong passwords and secrets
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Test backup and recovery procedures

---

## Step 1: Prepare Environment

### 1.1 Generate Strong Credentials

```bash
# Generate passwords (save securely!)
DB_ROOT_PASS=$(openssl rand -base64 32)
DB_PASS=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)

echo "MYSQL_ROOT_PASSWORD=$DB_ROOT_PASS"
echo "DB_PASSWORD=$DB_PASS"
echo "JWT_SECRET=$JWT_SECRET"
```

### 1.2 Create Production Environment File

```bash
# Copy template
cp .env.example .env.production

# Edit with your values
nano .env.production
```

**Critical fields to change**:
```
DB_PASSWORD=<your-strong-password>
MYSQL_ROOT_PASSWORD=<your-strong-password>
JWT_SECRET=<your-strong-secret>
FRONTEND_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com
```

### 1.3 Secure .env Files

```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore
echo ".env.production" >> .gitignore
echo ".env.local" >> .gitignore

# Set file permissions
chmod 600 .env.production
chmod 600 .env
```

---

## Step 2: SSL/TLS Setup

### Option A: Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate (stops web service temporarily)
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# Certificates will be in: /etc/letsencrypt/live/yourdomain.com/
```

### Option B: Self-Signed (Testing Only)

```bash
# Create self-signed certificate
mkdir -p certs
openssl req -x509 -newkey rsa:4096 \
  -keyout certs/key.pem \
  -out certs/cert.pem \
  -days 365 -nodes
```

---

## Step 3: Configure Reverse Proxy (Nginx)

Create `nginx-prod.conf`:

```nginx
upstream backend {
    server backend:3001;
}

upstream frontend {
    server frontend:80;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com *.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL Certificates
    ssl_certificate /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/json;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://yourdomain.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    }

    # Deny admin paths
    location ~ ^/(admin|root)/ {
        deny all;
    }
}

# API subdomain (optional)
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Step 4: Deploy with Docker Compose

### 4.1 Build Images

```bash
# Build with production tag
docker-compose build --no-cache

# Or build specific services
docker-compose build backend frontend
```

### 4.2 Create Data Directory

```bash
# Create persistent volume directory
sudo mkdir -p /var/lib/otobook/mysql-data
sudo chown 999:999 /var/lib/otobook/mysql-data
```

### 4.3 Start Services with Production Config

```bash
# Use production docker-compose file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Or with env file
docker-compose --env-file .env.production -f docker-compose.prod.yml up -d
```

### 4.4 Verify Deployment

```bash
# Check services
docker-compose ps

# Check logs
docker-compose logs -f

# Test API
curl http://localhost:3001/api/health

# Test frontend
curl http://localhost/
```

---

## Step 5: Configure Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow SSH (CRITICAL!)
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Block database and backend ports
sudo ufw deny 3306/tcp
sudo ufw deny 3001/tcp

# Verify rules
sudo ufw status
```

---

## Step 6: Set Up Monitoring

### 6.1 Container Health

```bash
# Monitor container health
watch -n 5 'docker ps --format "table {{.Names}}\t{{.Status}}"'

# Check detailed logs
docker-compose logs --tail=50 backend
```

### 6.2 Log Aggregation (Optional)

Install ELK Stack, Loki, or similar for centralized logging.

### 6.3 Alerting

Set up alerts for:
- Container restarts
- High memory/CPU usage
- API errors
- Database connection failures

---

## Step 7: Backup Strategy

### 7.1 Database Backups

```bash
# Manual backup
docker-compose exec mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD otobook_saas > backup.sql

# Automated daily backup
0 2 * * * docker-compose exec mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD otobook_saas | gzip > /backups/otobook_$(date +\%Y\%m\%d).sql.gz
```

### 7.2 Full System Backup

```bash
# Backup everything
tar -czf otobook_backup_$(date +%Y%m%d).tar.gz \
  /var/lib/otobook/mysql-data \
  docker-compose*.yml \
  .env.production \
  certs/
```

### 7.3 Test Recovery

```bash
# Restore database
docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD otobook_saas < backup.sql

# Verify data
docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD otobook_saas -e "SELECT COUNT(*) FROM users;"
```

---

## Step 8: Performance Optimization

### 8.1 Enable HTTP/2 and Compression

```nginx
# Already configured in nginx-prod.conf
gzip on;
listen 443 ssl http2;
```

### 8.2 Configure Caching

```nginx
# Add to Nginx config
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 8.3 Database Connection Pooling

Verify in Backend/config/database.js:
```javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  ...
});
```

---

## Step 9: Domain Setup

### 9.1 DNS Records

Add to your DNS provider:
```
Type    Name              Value
A       yourdomain.com    your-server-ip
A       api.yourdomain.com your-server-ip
A       www.yourdomain.com your-server-ip
MX      yourdomain.com    mail.yourdomain.com
```

### 9.2 SSL Certificate Renewal

```bash
# Auto-renew (runs twice daily)
certbot renew --quiet

# Or manually
certbot renew
```

---

## Step 10: Post-Deployment Verification

```bash
# ✅ Check HTTPS
curl -I https://yourdomain.com

# ✅ Check API
curl https://yourdomain.com/api/users

# ✅ Check SSL certificate
openssl s_client -connect yourdomain.com:443

# ✅ Check security headers
curl -I https://yourdomain.com | grep -i "strict\|x-frame\|x-content"

# ✅ Check container health
docker-compose ps

# ✅ Check logs
docker-compose logs --tail=20
```

---

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Verify env variables
docker-compose config | grep -E "DB_|JWT_"
```

### Database connection errors
```bash
# Test MySQL connection
docker-compose exec backend node -e "
  const mysql = require('mysql2/promise');
  (async () => {
    try {
      const conn = await mysql.createConnection({
        host: 'mysql',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
      console.log('✅ Connected!');
      conn.end();
    } catch(e) { console.log('❌ Error:', e.message); }
  })();
"
```

### SSL certificate errors
```bash
# Check certificate expiry
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text -noout | grep -A 2 "Validity"

# Renew certificate
certbot renew --force-renewal
```

---

## Maintenance

### Monthly Tasks
- [ ] Review logs for errors
- [ ] Check certificate expiry
- [ ] Update Docker images
- [ ] Verify backups

### Quarterly Tasks
- [ ] Security audit
- [ ] Performance review
- [ ] Test disaster recovery

### Annually
- [ ] Full security assessment
- [ ] Capacity planning
- [ ] Budget review

---

## Security Reminders

🔒 **NEVER commit these files to Git:**
- `.env` (development)
- `.env.production`
- SSL private keys
- Database backups

✅ **Always use:**
- HTTPS (SSL/TLS)
- Strong passwords (32+ chars)
- Environment variables for secrets
- Firewall rules
- Regular backups
- Monitoring and alerting

---

## Support & Resources

- **Docker Production Best Practices**: https://docs.docker.com/develop/dev-best-practices/
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Let's Encrypt**: https://letsencrypt.org/
- **Nginx Security**: https://nginx.org/en/docs/http/server_names.html

