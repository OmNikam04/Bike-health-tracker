package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnikam04/bike-health-tracker/internal/dto"
	"github.com/omnikam04/bike-health-tracker/internal/logger"
	"github.com/omnikam04/bike-health-tracker/internal/service"
)

type BikeHandler struct {
	bikeService service.BikeService
}

func NewBikeHandler(bikeService service.BikeService) *BikeHandler {
	return &BikeHandler{
		bikeService: bikeService,
	}
}

// CreateBike godoc
// @Summary Register a new bike
// @Tags bikes
// @Accept json
// @Produce json
// @Param bike body dto.CreateBikeRequest true "Bike data"
// @Success 201 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Router /bikes [post]
// @Security BearerAuth
func (h *BikeHandler) CreateBike(c *fiber.Ctx) error {
	var req dto.CreateBikeRequest

	if err := c.BodyParser(&req); err != nil {
		logger.Error().Err(err).Msg("Invalid request body for bike creation")
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request body",
		})
	}

	if err := ValidateStruct(c, &req); err != nil {
		return err
	}

	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userID").(uuid.UUID)

	bike, err := h.bikeService.CreateBike(userID, &req)
	if err != nil {
		logger.Error().Err(err).Str("user_id", userID.String()).Msg("Failed to create bike")
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "bike_creation_failed",
			Message: err.Error(),
		})
	}

	logger.Info().Str("bike_id", bike.ID.String()).Str("user_id", userID.String()).Msg("Bike created successfully")

	return c.Status(fiber.StatusCreated).JSON(dto.SuccessResponse{
		Success: true,
		Data:    bike,
		Message: "Bike registered successfully",
	})
}

// GetBike godoc
// @Summary Get bike details
// @Tags bikes
// @Produce json
// @Param id path string true "Bike ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /bikes/{id} [get]
// @Security BearerAuth
func (h *BikeHandler) GetBike(c *fiber.Ctx) error {
	bikeIDStr := c.Params("id")
	bikeID, err := uuid.Parse(bikeIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_bike_id",
			Message: "Invalid bike ID format",
		})
	}

	userID := c.Locals("userID").(uuid.UUID)

	bike, err := h.bikeService.GetBike(userID, bikeID)
	if err != nil {
		logger.Error().Err(err).Str("bike_id", bikeIDStr).Msg("Failed to get bike")
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Error:   "bike_not_found",
			Message: err.Error(),
		})
	}

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Data:    bike,
	})
}

// ListMyBikes godoc
// @Summary List all bikes for current user
// @Tags bikes
// @Produce json
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Router /bikes [get]
// @Security BearerAuth
func (h *BikeHandler) ListMyBikes(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uuid.UUID)

	bikes, err := h.bikeService.ListUserBikes(userID)
	if err != nil {
		logger.Error().Err(err).Str("user_id", userID.String()).Msg("Failed to list bikes")
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "bikes_list_failed",
			Message: err.Error(),
		})
	}

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Data:    bikes,
	})
}

// UpdateBike godoc
// @Summary Update bike details
// @Tags bikes
// @Accept json
// @Produce json
// @Param id path string true "Bike ID"
// @Param bike body dto.UpdateBikeRequest true "Updated bike data"
// @Success 200 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /bikes/{id} [put]
// @Security BearerAuth
func (h *BikeHandler) UpdateBike(c *fiber.Ctx) error {
	bikeIDStr := c.Params("id")
	bikeID, err := uuid.Parse(bikeIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_bike_id",
			Message: "Invalid bike ID format",
		})
	}

	var req dto.UpdateBikeRequest
	if err := c.BodyParser(&req); err != nil {
		logger.Error().Err(err).Msg("Invalid request body for bike update")
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request body",
		})
	}

	if err := ValidateStruct(c, &req); err != nil {
		return err
	}

	userID := c.Locals("userID").(uuid.UUID)

	bike, err := h.bikeService.UpdateBike(userID, bikeID, &req)
	if err != nil {
		logger.Error().Err(err).Str("bike_id", bikeIDStr).Msg("Failed to update bike")
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "bike_update_failed",
			Message: err.Error(),
		})
	}

	logger.Info().Str("bike_id", bikeIDStr).Msg("Bike updated successfully")

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Data:    bike,
		Message: "Bike updated successfully",
	})
}

// DeleteBike godoc
// @Summary Delete a bike
// @Tags bikes
// @Produce json
// @Param id path string true "Bike ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /bikes/{id} [delete]
// @Security BearerAuth
func (h *BikeHandler) DeleteBike(c *fiber.Ctx) error {
	bikeIDStr := c.Params("id")
	bikeID, err := uuid.Parse(bikeIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_bike_id",
			Message: "Invalid bike ID format",
		})
	}

	userID := c.Locals("userID").(uuid.UUID)

	if err := h.bikeService.DeleteBike(userID, bikeID); err != nil {
		logger.Error().Err(err).Str("bike_id", bikeIDStr).Msg("Failed to delete bike")
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "bike_delete_failed",
			Message: err.Error(),
		})
	}

	logger.Info().Str("bike_id", bikeIDStr).Msg("Bike deleted successfully")

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Message: "Bike deleted successfully",
	})
}

