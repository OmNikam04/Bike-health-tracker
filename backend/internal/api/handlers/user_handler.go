package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnikam04/bike-health-tracker/internal/config"
	"github.com/omnikam04/bike-health-tracker/internal/dto"
	"github.com/omnikam04/bike-health-tracker/internal/logger"
	"github.com/omnikam04/bike-health-tracker/internal/service"
	"github.com/omnikam04/bike-health-tracker/internal/utils"
)

type UserHandler struct {
	userService service.UserService
	config      *config.Config
}

func NewUserHandler(userService service.UserService, cfg *config.Config) *UserHandler {
	return &UserHandler{
		userService: userService,
		config:      cfg,
	}
}

// CreateUser godoc
// @Summary Create a new user
// @Tags users
// @Accept json
// @Produce json
// @Param user body dto.CreateUserRequest true "User data"
// @Success 201 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Router /users [post]
func (h *UserHandler) CreateUser(c *fiber.Ctx) error {
	var req dto.CreateUserRequest

	if err := c.BodyParser(&req); err != nil {
		logger.Error().Err(err).Msg("Invalid request body")
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request body",
		})
	}

	// Validate request
	if err := ValidateStruct(c, &req); err != nil {
		return err
	}

	user, err := h.userService.CreateUser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "creation_failed",
			Message: err.Error(),
		})
	}

	logger.Info().Interface("user", user).Msg("User created via API")

	return c.Status(fiber.StatusCreated).JSON(dto.SuccessResponse{
		Success: true,
		Data:    user,
		Message: "User created successfully",
	})
}

// GetCurrentUser godoc
// @Summary Get current user profile
// @Tags users
// @Produce json
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /users/me [get]
func (h *UserHandler) GetCurrentUser(c *fiber.Ctx) error {
	// Extract authenticated user ID from JWT context (set by Auth middleware)
	userID, ok := c.Locals("userID").(uuid.UUID)
	if !ok {
		logger.Error().Msg("Failed to extract userID from context")
		return c.Status(fiber.StatusUnauthorized).JSON(dto.ErrorResponse{
			Error:   "unauthorized",
			Message: "Invalid user context",
		})
	}

	user, err := h.userService.GetUser(userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Error:   "not_found",
			Message: err.Error(),
		})
	}

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Data:    user,
	})
}

// UpdateCurrentUser godoc
// @Summary Update current user profile
// @Tags users
// @Accept json
// @Produce json
// @Param user body dto.UpdateUserRequest true "User data to update"
// @Success 200 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /users/me [put]
func (h *UserHandler) UpdateCurrentUser(c *fiber.Ctx) error {
	// Extract authenticated user ID from JWT context (set by Auth middleware)
	userID, ok := c.Locals("userID").(uuid.UUID)
	if !ok {
		logger.Error().Msg("Failed to extract userID from context")
		return c.Status(fiber.StatusUnauthorized).JSON(dto.ErrorResponse{
			Error:   "unauthorized",
			Message: "Invalid user context",
		})
	}

	var req dto.UpdateUserRequest
	if err := c.BodyParser(&req); err != nil {
		logger.Error().Err(err).Msg("Invalid request body")
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request body",
		})
	}

	// Validate request
	if err := ValidateStruct(c, &req); err != nil {
		return err
	}

	user, err := h.userService.UpdateUser(userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "update_failed",
			Message: err.Error(),
		})
	}

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Data:    user,
		Message: "User updated successfully",
	})
}

// DeleteCurrentUser godoc
// @Summary Delete current user account
// @Tags users
// @Produce json
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /users/me [delete]
func (h *UserHandler) DeleteCurrentUser(c *fiber.Ctx) error {
	// Extract authenticated user ID from JWT context (set by Auth middleware)
	userID, ok := c.Locals("userID").(uuid.UUID)
	if !ok {
		logger.Error().Msg("Failed to extract userID from context")
		return c.Status(fiber.StatusUnauthorized).JSON(dto.ErrorResponse{
			Error:   "unauthorized",
			Message: "Invalid user context",
		})
	}

	if err := h.userService.DeleteUser(userID); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Error:   "delete_failed",
			Message: err.Error(),
		})
	}

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Message: "User deleted successfully",
	})
}

// Login godoc
// @Summary User login
// @Tags users
// @Accept json
// @Produce json
// @Param credentials body dto.LoginRequest true "Login credentials"
// @Success 200 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Router /users/login [post]
func (h *UserHandler) Login(c *fiber.Ctx) error {
	var req dto.LoginRequest

	if err := c.BodyParser(&req); err != nil {
		logger.Error().Err(err).Msg("Invalid request body")
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request body",
		})
	}

	// Validate request
	if err := ValidateStruct(c, &req); err != nil {
		return err
	}

	user, err := h.userService.Login(&req)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(dto.ErrorResponse{
			Error:   "login_failed",
			Message: err.Error(),
		})
	}

	// Generate JWT token
	token, err := utils.GenerateToken(user.ID, user.Email, h.config.JWTSecret)
	if err != nil {
		logger.Error().Err(err).Msg("Failed to generate JWT token")
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "token_generation_failed",
			Message: "Failed to generate authentication token",
		})
	}

	logger.Info().Str("user_id", user.ID.String()).Msg("User logged in successfully")

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Data: dto.LoginResponse{
			Token: token,
			User: dto.UserResponse{
				ID:        user.ID,
				Name:      user.Name,
				Email:     user.Email,
				CreatedAt: user.CreatedAt,
				UpdatedAt: user.UpdatedAt,
			},
		},
		Message: "Login successful",
	})
}
