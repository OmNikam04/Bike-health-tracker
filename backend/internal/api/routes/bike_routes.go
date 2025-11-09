package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/omnikam04/bike-health-tracker/internal/api/middleware"
	"github.com/omnikam04/bike-health-tracker/internal/config"
)

// SetupBikeRoutes sets up all bike-related routes
func SetupBikeRoutes(router fiber.Router, h *Handlers, cfg *config.Config) {
	bikes := router.Group("/bikes")

	// All bike routes require authentication
	bikes.Use(middleware.Auth(cfg))

	// Bike CRUD operations
	bikes.Post("/", h.BikeHandler.CreateBike)
	bikes.Get("/", h.BikeHandler.ListMyBikes)
	bikes.Get("/:id", h.BikeHandler.GetBike)
	bikes.Put("/:id", h.BikeHandler.UpdateBike)
	bikes.Delete("/:id", h.BikeHandler.DeleteBike)
}

