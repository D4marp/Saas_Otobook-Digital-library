# Colima Setup Guide (Lightweight Container Runtime)

Colima is a lightweight container runtime for macOS that uses less memory and CPU than Docker Desktop. It's ideal for development on resource-constrained machines.

## Prerequisites

- **macOS** (Intel or Apple Silicon)
- **Colima** (~100MB lightweight)
- **Docker CLI** (lightweight binary, not the full Desktop app)

## Installation

### 1. Install Colima (via Homebrew)

```bash
brew install colima
```

### 2. Install Docker CLI (lightweight)

```bash
brew install docker
```

### 3. Verify Installation

```bash
colima version
docker version
```

## Quick Start

### Start Colima

```bash
# Start Colima with 4 CPUs and 6GB RAM
colima start --cpu 4 --memory 6

# Or use defaults:
colima start
```

### Run Docker Compose

```bash
cd "SAAS Otobook"
docker-compose up -d
```

### Verify Containers

```bash
docker-compose ps
docker-compose logs
```

### Access Applications

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001/api
- **MySQL**: localhost:3306

## Colima Commands

```bash
# Start Colima
colima start

# Stop Colima
colima stop

# Check status
colima status

# View configuration
colima config

# SSH into VM
colima ssh

# Remove Colima (full cleanup)
colima delete

# Restart with different resources
colima restart --cpu 8 --memory 12
```

## Advantages Over Docker Desktop

| Aspect | Colima | Docker Desktop |
|--------|--------|----------------|
| **Memory Usage** | ~500MB | ~2.5GB |
| **CPU Overhead** | Minimal | Moderate |
| **Startup Time** | 5-10s | 30-60s |
| **Cost** | Free, Open Source | Paid (Enterprise) |
| **File Sharing** | VirtioFS (fast) | Slow on Intel Mac |
| **Virtualization** | Hypervisor (VZ/QEMU) | HyperKit |

## Troubleshooting

### Port Already Allocated

```bash
# Stop all containers
docker-compose down -v

# Stop Colima
colima stop

# Restart fresh
colima start
docker-compose up -d
```

### Cannot Connect to Docker Daemon

```bash
# Verify Colima is running
colima status

# Reconnect Docker to Colima socket
export DOCKER_HOST=unix:///Users/$(whoami)/.colima/default/docker.sock
docker ps
```

### Out of Memory

```bash
# Increase Colima memory allocation
colima stop
colima start --memory 8  # 8GB
```

### Slow Performance

```bash
# Check CPU allocation
colima status

# Increase CPUs if needed
colima stop
colima start --cpu 8
```

## Docker Compose Integration

Your `docker-compose.yml` works seamlessly with Colima. No changes needed!

```bash
docker-compose build     # Build images
docker-compose up -d     # Start all services
docker-compose logs -f   # Follow logs
docker-compose down      # Stop all services
```

## Tips for macOS

1. **Reduce Colima Resources When Not Needed**:
   ```bash
   colima stop  # Frees all allocated memory/CPU
   ```

2. **Monitor Colima Performance**:
   ```bash
   colima ssh
   top -b -n 1
   ```

3. **Persistent Data**:
   - Database volumes are automatically persisted
   - Data survives `colima stop` and `restart`

4. **Use `docker ps` Instead of Docker Desktop**:
   - Much lighter weight
   - All same Docker commands work

## Learning Resources

- **Colima GitHub**: https://github.com/abiosoft/colima
- **Lima Project**: https://github.com/lima-vm/lima (underlying technology)
- **Docker Docs**: https://docs.docker.com/

## Next Steps

1. ✅ **Install Colima**: `brew install colima docker`
2. ✅ **Start Colima**: `colima start`
3. ✅ **Run Docker Compose**: `cd SAAS\ Otobook && docker-compose up -d`
4. ✅ **Access Services**: http://localhost, http://localhost:3001

---

**Memory Comparison**:
- Colima: ~500MB footprint
- Docker Desktop: ~2.5GB footprint
- **Savings: 2GB+ RAM** ✨
