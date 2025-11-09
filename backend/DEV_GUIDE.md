# 🚀 Development Guide - Bike Health Tracker

## Quick Start

### First Time Setup
```bash
# 1. Build and start all services
make rebuild

# 2. Watch the logs
make logs
```

### Daily Development Workflow
```bash
# Start services (fast - uses cache)
make run

# That's it! Now just edit your code and save.
# Air will automatically detect changes and reload the server.
```

---

## 📝 How Auto-Reload Works

1. **Edit any `.go` file** in your project
2. **Save the file** (Cmd+S / Ctrl+S)
3. **Air detects the change** (within 500ms)
4. **Air runs** `go mod tidy && go build`
5. **Air restarts** the server automatically
6. **Test your changes** immediately!

**Total time: 2-3 seconds** ⚡

---

## 🛠️ Available Make Commands

### Development
| Command | Description | When to Use |
|---------|-------------|-------------|
| `make run` | Start services (fast) | Daily development |
| `make rebuild` | Force rebuild | After changing dependencies |
| `make restart` | Restart API only | Quick restart without rebuild |
| `make down` | Stop services | End of day |
| `make clean` | Stop + remove volumes | Fresh start needed |

### Debugging
| Command | Description |
|---------|-------------|
| `make logs` | View API logs (live) |
| `make logs-db` | View database logs |
| `make shell` | Access API container shell |
| `make db-shell` | Access PostgreSQL shell |

### Testing
| Command | Description |
|---------|-------------|
| `make test` | Run all tests |

---

## 🔄 Common Scenarios

### Scenario 1: Adding a New Route
```bash
# 1. Edit internal/api/routes/user_routes.go
# 2. Save the file
# 3. Watch terminal - Air will reload
# 4. Test immediately: curl http://localhost:8080/api/v1/users
```

**No need to restart!** ✅

---

### Scenario 2: Adding a New Package/Dependency
```bash
# 1. Add import in your .go file
# 2. Save the file
# 3. Air will run `go mod tidy` automatically
# 4. Server restarts with new dependency
```

**No need to run `make run` again!** ✅

---

### Scenario 3: Database Schema Change
```bash
# 1. Edit internal/models/users.go
# 2. Save the file
# 3. Air reloads and runs migrations automatically
# 4. Check logs to verify migration
```

**No need to manually run migrations!** ✅

---

### Scenario 4: Something Went Wrong
```bash
# View logs to see the error
make logs

# If you need a fresh start
make clean
make rebuild
```

---

## 🐛 Troubleshooting

### Air Not Detecting Changes?
```bash
# 1. Check if Air is running
make logs

# 2. Restart the API service
make restart

# 3. If still not working, rebuild
make rebuild
```

### Port Already in Use?
```bash
# Stop all services
make down

# Start again
make run
```

### Database Connection Issues?
```bash
# Check database logs
make logs-db

# Access database shell to verify
make db-shell
# Then run: \dt (to list tables)
```

### Build Errors?
```bash
# View build errors
cat tmp/build-errors.log

# Or check live logs
make logs
```

---

## 📊 Air Configuration (`.air.toml`)

Key settings for auto-reload:
- `rerun = true` - Auto-restart on file changes
- `send_interrupt = true` - Properly kill old process
- `delay = 500` - Wait 500ms before rebuild (debounce)
- `include_ext = ["go"]` - Watch `.go` files
- `exclude_dir = ["tmp", "vendor"]` - Ignore these directories

---

## 🧪 Testing Your API

### Health Check
```bash
curl http://localhost:8080/health
```

### Create User
```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get User
```bash
curl http://localhost:8080/api/v1/users/{user-id}
```

---

## 💡 Pro Tips

1. **Keep `make logs` running** in a separate terminal to see live updates
2. **Use `make restart`** for quick restarts without full rebuild
3. **Use `make clean`** when you want to reset the database
4. **Check `tmp/build-errors.log`** if build fails
5. **Air runs `go mod tidy`** automatically, so just add imports and save!

---

## 🎯 Development Workflow Example

```bash
# Terminal 1: Start services
make run

# Terminal 2: Watch logs
make logs

# Now edit your code in your IDE
# Save files
# Watch Terminal 2 for auto-reload
# Test your changes immediately!
```

---

## 📁 Project Structure

```
bike-health-tracker/
├── cmd/server/          # Application entry point
├── internal/
│   ├── api/
│   │   ├── handlers/    # HTTP handlers
│   │   ├── middleware/  # Middleware (auth, etc.)
│   │   └── routes/      # Route definitions
│   ├── config/          # Configuration
│   ├── db/              # Database connection & migrations
│   ├── dto/             # Data Transfer Objects
│   ├── logger/          # Logging utilities
│   ├── models/          # Database models
│   ├── repository/      # Data access layer
│   └── service/         # Business logic layer
├── tmp/                 # Air build artifacts (auto-generated)
├── .air.toml            # Air configuration
├── docker-compose.yml   # Docker services
├── Dockerfile           # Docker image definition
└── Makefile             # Development commands
```

---

**Happy Coding! 🚀**

