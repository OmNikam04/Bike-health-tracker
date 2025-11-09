package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/omnikam04/bike-health-tracker/internal/api/middleware"
	"github.com/omnikam04/bike-health-tracker/internal/config"
)

// SetupUserRoutes sets up all user-related routes
func SetupUserRoutes(router fiber.Router, h *Handlers, cfg *config.Config) {
	users := router.Group("/user")

	// Public routes - no authentication required
	users.Post("/signup", h.UserHandler.CreateUser) // POST /api/v1/users - Register new user
	users.Post("/login", h.UserHandler.Login)       // POST /api/v1/users/login - Login

	// Protected routes - require authentication
	// Uses /me pattern - user can only access their own data
	users.Get("/me", middleware.Auth(cfg), h.UserHandler.GetCurrentUser)       // GET /api/v1/users/me - Get own profile
	users.Put("/me", middleware.Auth(cfg), h.UserHandler.UpdateCurrentUser)    // PUT /api/v1/users/me - Update own profile
	users.Delete("/me", middleware.Auth(cfg), h.UserHandler.DeleteCurrentUser) // DELETE /api/v1/users/me - Delete own account
}
