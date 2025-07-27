# ProjectAlgo - Docker Setup Guide

This guide explains how to run the ProjectAlgo Online Judge Platform using Docker with MongoDB Atlas (cloud database).

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose
- MongoDB Atlas account (cloud database)
- Git

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ProjectAlgo
   ```

2. **Ensure environment files exist:**
   - `server/.env` - Contains MongoDB Atlas connection and JWT secrets
   - `client/.env` - Contains frontend environment variables
   
3. **Build and run with Docker Compose:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - Database: MongoDB Atlas (cloud)

## Architecture

The application consists of 2 main containerized services + MongoDB Atlas:

### 1. Backend Server (`server`)
- **Technology:** Node.js + Express
- **Port:** 5000
- **Database:** MongoDB Atlas (cloud)
- **Environment:** Uses `server/.env` file
- **Features:**
  - RESTful API
  - JWT Authentication
  - Multi-language code execution (C, C++, Python, Java)
  - File generation and execution
  - Health check endpoint
- **Health Check:** http://localhost:5000/health

### 2. Frontend Client (`client`)
- **Technology:** React + Vite + Nginx
- **Port:** 80
- **Environment:** Uses `client/.env` file
- **Features:**
  - Modern React UI with Tailwind CSS
  - Code editor with syntax highlighting
  - Admin and user dashboards
  - Problem management and submissions
  - API proxying to backend

### 3. Database (MongoDB Atlas)
- **Type:** Cloud database (not containerized)
- **Connection:** Via MONGO_URI in server/.env
- **Benefits:** Managed, scalable, production-ready

## Docker Commands

### Development Commands

```bash
# Build and start all services
docker compose up --build

# Start services in background
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f server
docker compose logs -f client

# Rebuild specific service
docker compose build server
docker compose up -d server

# Check container status
docker compose ps

# Test health endpoints
curl http://localhost:5000/health
```

### Database Management (MongoDB Atlas)

Since we're using MongoDB Atlas (cloud database), database management is done through:

```bash
# Database is managed via MongoDB Atlas dashboard
# Connection string is in server/.env as MONGO_URI

# To backup/restore, use MongoDB Atlas built-in tools:
# 1. Atlas Dashboard > Clusters > ... > Create Backup
# 2. Atlas Dashboard > Clusters > ... > Restore from Backup

# For local development/testing with MongoDB tools:
mongodump --uri="<your-atlas-connection-string>" --db=projectalgo
mongorestore --uri="<your-atlas-connection-string>" --db=projectalgo dump/projectalgo
```

### Maintenance Commands

```bash
# Remove all containers and volumes (CAUTION: This will delete all data)
docker-compose down -v

# Remove unused Docker images
docker image prune -a

# View container status
docker-compose ps

# Execute commands in running containers
docker-compose exec server npm run test
docker-compose exec client npm run lint
```

## Environment Variables

### Server Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret

### Client Environment Variables
- `VITE_REACT_URL`: Backend API URL

## End-to-End Implementation Process

This section documents the complete Docker implementation process we followed:

### Phase 1: Initial Docker Setup
1. **Created server Dockerfile** - Node.js 18 Alpine with multi-language support
2. **Created client Dockerfile** - Multi-stage build (React build + Nginx serving)
3. **Created docker-compose.yml** - Initially with local MongoDB container
4. **Added Nginx configuration** - API proxying and client-side routing
5. **Created MongoDB init script** - Database initialization with indexes

### Phase 2: Environment Configuration
1. **Created .dockerignore files** - For both client and server
2. **Added health check endpoint** - `/health` route in server.js
3. **Created root-level .env files** - Initial environment setup
4. **Added comprehensive documentation** - README-Docker.md

### Phase 3: Production Optimization (User Feedback)
1. **Identified MongoDB Atlas preference** - User already had cloud database
2. **Removed local MongoDB container** - Simplified architecture
3. **Updated docker-compose.yml** - Use existing server/.env and client/.env
4. **Removed unnecessary root .env files** - Cleaner project structure
5. **Updated documentation** - Reflect MongoDB Atlas usage

### Key Decisions Made:
- ✅ **MongoDB Atlas over local container** - Better for production
- ✅ **Existing .env files** - Respect user's current setup
- ✅ **Multi-stage builds** - Optimized image sizes
- ✅ **Health checks** - Production monitoring ready
- ✅ **Nginx proxy** - Single entry point for frontend

## File Structure

```
ProjectAlgo/
├── client/
│   ├── Dockerfile              # Multi-stage React + Nginx build
│   ├── nginx.conf              # Nginx configuration with API proxy
│   ├── .dockerignore           # Exclude unnecessary files
│   ├── .env                    # Frontend environment variables
│   └── src/                    # React application source
├── server/
│   ├── Dockerfile              # Node.js with compilation tools
│   ├── .dockerignore           # Exclude node_modules, logs
│   ├── .env                    # Backend env (MongoDB Atlas, JWT)
│   ├── init-mongo.js           # Database indexes (reference)
│   └── ...                     # Server source code
├── docker-compose.yml          # Orchestration (2 services)
└── README-Docker.md            # This documentation
```

## Production Deployment

For production deployment:

1. **Update environment variables:**
   - Change MongoDB credentials
   - Use strong JWT secret
   - Set NODE_ENV=production

2. **Use production Docker Compose:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Enable SSL/HTTPS:**
   - Configure reverse proxy (nginx/traefik)
   - Add SSL certificates
   - Update CORS settings

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :80
   netstat -tulpn | grep :5000
   netstat -tulpn | grep :27017
   ```

2. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER ./codes ./inputs ./outputs
   ```

3. **Database connection issues:**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

4. **Build failures:**
   ```bash
   # Clean build
   docker-compose down
   docker system prune -a
   docker-compose up --build
   ```

### Health Checks

All services include health checks:
- **Server:** http://localhost:5000/health
- **Client:** http://localhost
- **MongoDB:** Internal ping command

### Logs and Monitoring

```bash
# Real-time logs for all services
docker-compose logs -f

# Check service health
docker-compose ps
```

## Development vs Production

### Development Mode
- Hot reload enabled
- Debug logs
- Development database
- Source maps included

### Production Mode
- Optimized builds
- Compressed assets
- Production database
- Security headers
- Health monitoring

## Security Considerations

1. **Change default passwords**
2. **Use environment-specific secrets**
3. **Enable firewall rules**
4. **Regular security updates**
5. **Monitor logs for suspicious activity**

## Support

For issues and questions:
1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Ensure all ports are available
4. Check Docker and Docker Compose versions
