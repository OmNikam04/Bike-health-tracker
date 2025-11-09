package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/omnikam04/bike-health-tracker/internal/api/middleware"
	"github.com/omnikam04/bike-health-tracker/internal/config"
)

// SetupFuelLogRoutes sets up all fuel log-related routes
func SetupFuelLogRoutes(router fiber.Router, h *Handlers, cfg *config.Config) {
	// All fuel log routes require authentication
	// Routes are nested under /bikes/:bike_id/fuel-logs
	bikes := router.Group("/bikes")
	bikes.Use(middleware.Auth(cfg))

	// Fuel log CRUD operations
	bikes.Post("/:bike_id/fuel-logs", h.FuelLogHandler.CreateFuelLog)
	bikes.Get("/:bike_id/fuel-logs", h.FuelLogHandler.ListBikeFuelLogs)
	bikes.Get("/:bike_id/fuel-logs/:id", h.FuelLogHandler.GetFuelLog)
	bikes.Put("/:bike_id/fuel-logs/:id", h.FuelLogHandler.UpdateFuelLog)
	bikes.Delete("/:bike_id/fuel-logs/:id", h.FuelLogHandler.DeleteFuelLog)

	// Fuel statistics
	bikes.Get("/:bike_id/fuel-stats", h.FuelLogHandler.GetFuelStats)
}

