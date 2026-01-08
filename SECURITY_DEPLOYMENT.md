# 🔒 Docker Security & Production Deployment Checklist

## ⚠️ Current Status: DEVELOPMENT BUILD (⚠️ NOT Production Ready)

### Critical Issues Found ❌

#### 1. **Hardcoded Credentials** 🔴 CRITICAL
```yaml
# ❌ INSECURE - Passwords exposed in code
MYSQL_ROOT_PASSWORD: root_password
MYSQL_USER: otobook_user
MYSQL_PASSWORD: otobook_password
```

**Risk**: Credentials visible in Git, Docker images, logs
**Fix**: Use environment variables or secrets manager

#### 2. **Direct Database Port Exposed** 🔴 CRITICAL
```yaml
ports:
  - "3306:3306"  # ❌ MySQL exposed to world
```

**Risk**: Direct database access from internet
**Fix**: Remove port binding OR restrict to localhost only

#### 3. **No SSL/TLS Encryption** 🔴 CRITICAL
- Frontend served on HTTP (port 80), not HTTPS
- No certificate management
- No encrypted communication

#### 4. **Missing Environment Variable Management**
- No `.env.production` file
- No secrets injection mechanism
- Database credentials hardcoded

#### 5. **No Container Security Options**
- Missing `read-only` filesystem
- No resource limits
- Missing security capabilities drop

---

## ✅ What's Good (Development Ready)

| Feature | Status | Details |
|---------|--------|---------|
| Health Checks | ✅ | MySQL & Backend monitored |
| Restart Policy | ✅ | `unless-stopped` enabled |
| Volume Persistence | ✅ | MySQL data preserved |
| Alpine Base Images | ✅ | Smaller attack surface |
| Service Dependencies | ✅ | Proper startup order |
| Network Isolation | ✅ | Custom bridge network |

---

## 🛡️ Production Deployment Checklist

### Phase 1: Secrets Management (MUST DO FIRST)

```bash
# Create .env.production file (DO NOT COMMIT)
cp .env .env.production

# Edit with strong passwords
MYSQL_ROOT_PASSWORD=<generate-secure-password>
MYSQL_PASSWORD=<generate-secure-password>
DB_PASSWORD=<generate-secure-password>
JWT_SECRET=<generate-secure-key>
```

**Add to .gitignore:**
```
.env
.env.production
.env.local
```

### Phase 2: Update docker-compose.yml for Production

```yaml
# ✅ Use environment variables
environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
  MYSQL_PASSWORD: ${MYSQL_PASSWORD}

# ✅ Remove or restrict port binding
ports:
  - "127.0.0.1:3306:3306"  # Localhost only
  # OR use private network only (recommended)

# ✅ Add resource limits
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

  mysql:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

### Phase 3: SSL/TLS Certificate Setup

**Option 1: Nginx Reverse Proxy (Recommended)**
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf
      - /path/to/certs:/etc/nginx/certs
    depends_on:
      - frontend
      - backend
```

**Option 2: Let's Encrypt with Certbot**
```bash
docker run --rm -it -v /path/to/certs:/etc/letsencrypt certbot/certbot certonly --standalone -d yourdomain.com
```

### Phase 4: Hardened Dockerfile

```dockerfile
# ✅ Use specific version
FROM node:18.17.1-alpine3.18

# ✅ Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# ✅ Install security tools
RUN npm install -g npm-audit-fix

# ✅ Read-only filesystem
COPY --chown=nodejs:nodejs Backend/ .
```

### Phase 5: Database Hardening

```sql
-- Create limited user (not root)
CREATE USER 'app_user'@'%' IDENTIFIED BY '<strong-password>';
GRANT SELECT, INSERT, UPDATE, DELETE ON otobook_saas.* TO 'app_user'@'%';
FLUSH PRIVILEGES;

-- Disable remote root login
DELETE FROM mysql.user WHERE User='root' AND Host='%';
```

### Phase 6: Monitoring & Logging

Add to docker-compose:
```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=backend"
```

### Phase 7: Environment-Specific Configs

Create three compose files:
```
docker-compose.yml           # Base config
docker-compose.dev.yml       # Development overrides
docker-compose.prod.yml      # Production overrides
```

Usage:
```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 🚀 Production Deployment Steps

### Step 1: Prepare Secrets
```bash
# Generate secure passwords
openssl rand -base64 32  # For MySQL root
openssl rand -base64 32  # For app user
openssl rand -base64 64  # For JWT secret
```

### Step 2: Secure .env Files
```bash
# Create .env.production (DO NOT COMMIT)
export MYSQL_ROOT_PASSWORD="$(openssl rand -base64 32)"
export MYSQL_PASSWORD="$(openssl rand -base64 32)"
export JWT_SECRET="$(openssl rand -base64 64)"

# Store securely (not in repo)
# Use: AWS Secrets Manager, Docker Secrets, Vault, etc.
```

### Step 3: Update Firewall Rules

```bash
# Allow only HTTPS and SSH
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 80/tcp      # HTTP redirect to HTTPS
sudo ufw deny 3306/tcp     # Block MySQL
sudo ufw deny 3001/tcp     # Block Backend
```

### Step 4: Set Up Reverse Proxy

Production architecture:
```
Internet (User)
    ↓ HTTPS:443
[Nginx Reverse Proxy]
    ↓ HTTP
[Frontend Container:80]  [Backend Container:3001]
    ↓
[MySQL Container:3306 - Internal Only]
```

### Step 5: Enable TLS/SSL

```bash
# Option A: Self-signed (Development)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Option B: Let's Encrypt (Recommended)
certbot certonly --standalone -d yourdomain.com
```

### Step 6: Docker Image Registry

Push to Docker Hub or private registry:
```bash
# Tag images
docker tag otobook_backend:latest yourusername/otobook_backend:v1.0.0
docker tag otobook_frontend:latest yourusername/otobook_frontend:v1.0.0

# Push
docker push yourusername/otobook_backend:v1.0.0
docker push yourusername/otobook_frontend:v1.0.0
```

---

## 📊 Security Comparison

| Aspect | Development | Production |
|--------|-------------|-----------|
| **SSL/TLS** | ❌ HTTP | ✅ HTTPS |
| **Secrets** | Hardcoded | Environment/Vault |
| **Database Access** | Public | Private network |
| **Root User** | Exposed | Limited user |
| **Logs** | Console | Aggregated |
| **Resource Limits** | None | CPU/Memory caps |
| **Restart Policy** | unless-stopped | unless-stopped |
| **Security Scanning** | None | Regular scans |

---

## 🔍 Security Scanning Commands

```bash
# Scan for vulnerabilities
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image otobook_backend:latest

# Check image layers
docker history otobook_backend:latest

# Run security tests
docker run --rm -it -v $(pwd):/app node:18-alpine npm audit

# Container scanning
docker scan otobook_backend:latest
```

---

## 🚨 Pre-Deployment Security Checklist

- [ ] Remove hardcoded credentials from docker-compose.yml
- [ ] Use environment variables for all secrets
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (Nginx)
- [ ] Restrict database port (no public access)
- [ ] Set resource limits for containers
- [ ] Create non-root user in Dockerfile
- [ ] Enable logging with retention policy
- [ ] Set up monitoring and alerting
- [ ] Create database backup strategy
- [ ] Document security procedures
- [ ] Test disaster recovery plan
- [ ] Scan images for vulnerabilities
- [ ] Set up firewall rules
- [ ] Enable container restart policies
- [ ] Configure health checks for all services

---

## 📋 Summary

### Current State: ⚠️ Development Only
✅ Works great for local development  
❌ NOT safe for production

### To Deploy Safely:
1. **Immediately**: Move credentials to `.env` files
2. **Soon**: Set up SSL/TLS with reverse proxy
3. **Essential**: Remove exposed database ports
4. **Best Practice**: Use secrets manager
5. **Recommended**: Add monitoring and logging

### Estimated Effort:
- **Basic Safety**: 1-2 hours
- **Production Grade**: 4-8 hours
- **Enterprise Grade**: 16+ hours

---

## 🔗 Resources

- **Docker Security**: https://docs.docker.com/engine/security/
- **OWASP Container Security**: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- **CIS Docker Benchmark**: https://www.cisecurity.org/benchmark/docker/
- **Let's Encrypt**: https://letsencrypt.org/
- **Nginx Reverse Proxy**: https://nginx.org/en/docs/

