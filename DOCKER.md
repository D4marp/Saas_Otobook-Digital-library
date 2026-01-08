# Docker Setup Guide - OTobook SaaS

Complete guide to run OTobook SaaS using Docker containers.

## 📋 Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)

### Install Docker & Docker Compose

**macOS:**
```bash
brew install docker docker-compose
# or install Docker Desktop
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

**Windows:**
Download and install Docker Desktop from https://www.docker.com/products/docker-desktop

## 🚀 Quick Start

### Option 1: Using docker-compose (Recommended)

```bash
# Navigate to project root
cd /path/to/SAAS\ Otobook

# Start all containers (builds if needed)
docker-compose up -d

# Wait for services to be ready (10-15 seconds)
sleep 15

# Access the application
# Frontend: http://localhost
# Backend: http://localhost:3001
```

### Option 2: Using Helper Script

```bash
# Make script executable
chmod +x docker-helper.sh

# Run helper menu
./docker-helper.sh

# Select option 1 to start
```

## 📦 Container Architecture

```
┌─────────────────────────────────────────┐
│       OTobook SaaS (Docker Compose)     │
├─────────────────────────────────────────┤
│  Frontend (Nginx + React)               │
│  - Port: 80                             │
│  - Proxies /api to backend              │
├─────────────────────────────────────────┤
│  Backend (Node.js + Express)            │
│  - Port: 3001                           │
│  - Database: MySQL                      │
├─────────────────────────────────────────┤
│  MySQL Database                         │
│  - Port: 3306                           │
│  - Database: otobook_saas               │
└─────────────────────────────────────────┘
```

## 🛠️ Common Commands

### Start Services
```bash
# Start all containers in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Build and start
docker-compose up -d --build
```

### Stop Services
```bash
# Stop all containers
docker-compose down

# Stop without removing volumes
docker-compose stop

# Restart all containers
docker-compose restart
```

### View Logs
```bash
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Last 50 lines
docker-compose logs --tail=50
```

### Container Status
```bash
# Show running containers
docker-compose ps

# Show container details
docker ps -a

# Show volumes
docker volume ls | grep otobook

# Show networks
docker network ls | grep otobook
```

### Database Access
```bash
# Access MySQL directly
docker exec -it otobook_mysql mysql -u otobook_user -p otobook_saas

# Or use root password:
docker exec -it otobook_mysql mysql -u root -p root_password -D otobook_saas

# View database
USE otobook_saas;
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

### Clean Up
```bash
# Remove containers (keep volumes)
docker-compose down

# Remove containers and volumes (WARNING: data loss!)
docker-compose down -v

# Remove all (containers, volumes, networks)
docker-compose down -v --remove-orphans
```

## 🔧 Environment Configuration

### Backend Environment (.env)
The backend automatically uses these default values in docker-compose:

```
PORT=3001
DB_HOST=mysql          # Container name (DNS resolution)
DB_USER=otobook_user   # From docker-compose
DB_PASSWORD=otobook_password
DB_NAME=otobook_saas
```

### Frontend Configuration
Frontend proxy is configured in `Frontend/nginx.conf`:
- API calls to `/api/*` are proxied to `http://backend:3001/api/`

## 📊 Ports & Services

| Service | Port | URL |
|---------|------|-----|
| Frontend | 80 | http://localhost |
| Backend | 3001 | http://localhost:3001 |
| MySQL | 3306 | localhost:3306 |

## 🔍 Troubleshooting

### "Port already in use"
```bash
# Find and kill process using port
lsof -i :80
lsof -i :3001
lsof -i :3306

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### "Cannot connect to Docker daemon"
```bash
# Start Docker service
sudo systemctl start docker

# Or check Docker Desktop is running on macOS/Windows
```

### "Backend connection refused"
```bash
# Check backend logs
docker-compose logs backend

# Check if container is running
docker-compose ps

# Wait longer for MySQL to start
docker-compose logs mysql
```

### "Database errors"
```bash
# Check MySQL logs
docker-compose logs mysql

# Verify database exists
docker exec otobook_mysql mysql -u root -p root_password -e "SHOW DATABASES;"

# Reinitialize database
docker-compose down -v
docker-compose up -d
```

### "Frontend shows blank page"
```bash
# Check frontend logs
docker-compose logs frontend

# Check nginx configuration
docker exec otobook_frontend cat /etc/nginx/conf.d/default.conf

# Test backend connectivity
docker exec otobook_frontend curl http://backend:3001/api/users
```

## 📈 Performance Tips

1. **Use named volumes** - Better performance than bind mounts
2. **Multi-stage builds** - Frontend uses multi-stage to reduce image size
3. **Health checks** - Services wait for dependencies to be ready
4. **Nginx caching** - Static assets cached with proper headers
5. **Gzip compression** - Enabled for all text responses

## 🔐 Security Notes

⚠️ **Development Only** - This setup uses hardcoded credentials!

For production:
- Use environment variables from secure sources
- Use strong passwords
- Enable SSL/TLS (HTTPS)
- Use secrets management (Docker Secrets, Vault, etc.)
- Restrict network access
- Run containers with non-root users

## 📚 Docker Best Practices Applied

✅ Multi-stage build (Frontend)
✅ Health checks
✅ Proper logging
✅ Network isolation
✅ Volume persistence for database
✅ Environment variables for configuration
✅ .dockerignore files for smaller images
✅ Alpine base images (smaller, faster)
✅ Non-root users in production images

## 🚀 Advanced Usage

### Custom Build Arguments
```bash
docker-compose build --build-arg NODE_ENV=production
```

### Scale Services
```bash
# Run multiple backend instances (requires load balancer)
docker-compose up -d --scale backend=3
```

### Override Configuration
```bash
# Create docker-compose.override.yml for local changes
cat > docker-compose.override.yml << EOF
version: '3.9'
services:
  backend:
    environment:
      DEBUG: "true"
EOF
```

## 📖 Additional Resources

- Docker Documentation: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Nginx Documentation: https://nginx.org/en/docs/
- Node.js Docker: https://hub.docker.com/_/node

## ✅ Verification Checklist

After starting containers:

- [ ] Frontend accessible at http://localhost
- [ ] Backend responding at http://localhost:3001/api/users
- [ ] Database populated with demo data
- [ ] All containers showing healthy status
- [ ] No error messages in logs
- [ ] Can perform CRUD operations on users
- [ ] Documentation pages loading correctly

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs`
2. Check status: `docker-compose ps`
3. Verify connectivity: `docker network inspect otobook-network`
4. Review Docker documentation
5. Check GitHub issues: https://github.com/D4marp/Saas_Otobook-Digital-library/issues
