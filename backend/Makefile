# make run	Start (no rebuild)	⚡ Fast
# make rebuild	Force rebuild	🐢 Slow
# make restart	Restart API only	⚡⚡ Super fast
# make logs	View API logs	-
# make logs-db	View DB logs	-
# make shell	Access API shell	-
# make db-shell	Access DB shell	-
# make clean	Clean everything	-
# Start containers (fast - no rebuild unless necessary)
run:
	docker-compose up

# Force rebuild and start (use when dependencies change)
rebuild:
	docker-compose up --build

# Stop and remove containers
down:
	docker-compose down

# Stop, remove containers and volumes (clean slate)
clean:
	docker-compose down -v

# Restart just the API service (useful for quick restart)
restart:
	docker-compose restart api

# View logs (follow mode)
logs:
	docker-compose logs -f api

# View database logs
logs-db:
	docker-compose logs -f db

# Run tests
test:
	go test ./internal/tests/...

# Access API container shell
shell:
	docker exec -it bike_tracker_api sh

# Access database shell
db-shell:
	docker exec -it bike_tracker_db psql -U postgres -d biketracker