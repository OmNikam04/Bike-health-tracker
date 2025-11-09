package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnikam04/bike-health-tracker/internal/dto"
	"github.com/omnikam04/bike-health-tracker/internal/logger"
	"github.com/omnikam04/bike-health-tracker/internal/service"
)

type FuelLogHandler struct {
	fuelLogService service.FuelLogService
}

func NewFuelLogHandler(fuelLogService service.FuelLogService) *FuelLogHandler {
	return &FuelLogHandler{
		fuelLogService: fuelLogService,
	}
}

// CreateFuelLog godoc
// @Summary Add a fuel log entry
// @Tags fuel-logs
// @Accept json
// @Produce json
// @Param bike_id path string true "Bike ID"
// @Param fuel_log body dto.CreateFuelLogRequest true "Fuel log data"
// @Success 201 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Router /bikes/{bike_id}/fuel-logs [post]
// @Security BearerAuth
func (h *FuelLogHandler) CreateFuelLog(c *fiber.Ctx) error {
	bikeIDStr := c.Params("bike_id")
	bikeID, err := uuid.Parse(bikeIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_bike_id",
			Message: "Invalid bike ID format",
		})
	}

	var req dto.CreateFuelLogRequest
	if err := c.BodyParser(&req); err != nil {
		logger.Error().Err(err).Msg("Invalid request body for fuel log creation")
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request body",
		})
	}

	if err := ValidateStruct(c, &req); err != nil {
		return err
	}

	userID := c.Locals("userID").(uuid.UUID)

	fuelLog, err := h.fuelLogService.CreateFuelLog(userID, bikeID, &req)
	if err != nil {
		logger.Error().Err(err).Str("bike_id", bikeIDStr).Msg("Failed to create fuel log")
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "fuel_log_creation_failed",
			Message: err.Error(),
		})
	}

	logger.Info().Str("fuel_log_id", fuelLog.ID.String()).Str("bike_id", bikeIDStr).Msg("Fuel log created successfully")

	return c.Status(fiber.StatusCreated).JSON(dto.SuccessResponse{
		Success: true,
		Data:    fuelLog,
		Message: "Fuel log added successfully",
	})
}

// GetFuelLog godoc
// @Summary Get fuel log details
// @Tags fuel-logs
// @Produce json
// @Param bike_id path string true "Bike ID"
// @Param id path string true "Fuel Log ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /bikes/{bike_id}/fuel-logs/{id} [get]
// @Security BearerAuth
func (h *FuelLogHandler) GetFuelLog(c *fiber.Ctx) error {
	bikeIDStr := c.Params("bike_id")
	bikeID, err := uuid.Parse(bikeIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_bike_id",
			Message: "Invalid bike ID format",
		})
	}

	fuelLogIDStr := c.Params("id")
	fuelLogID, err := uuid.Parse(fuelLogIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_fuel_log_id",
			Message: "Invalid fuel log ID format",
		})
	}

	userID := c.Locals("userID").(uuid.UUID)

	fuelLog, err := h.fuelLogService.GetFuelLog(userID, bikeID, fuelLogID)
	if err != nil {
		logger.Error().Err(err).Str("fuel_log_id", fuelLogIDStr).Msg("Failed to get fuel log")
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Error:   "fuel_log_not_found",
			Message: err.Error(),
		})
	}

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Data:    fuelLog,
	})
}

// ListBikeFuelLogs godoc
// @Summary List all fuel logs for a bike
// @Tags fuel-logs
// @Produce json
// @Param bike_id path string true "Bike ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Router /bikes/{bike_id}/fuel-logs [get]
// @Security BearerAuth
func (h *FuelLogHandler) ListBikeFuelLogs(c *fiber.Ctx) error {
	bikeIDStr := c.Params("bike_id")
	bikeID, err := uuid.Parse(bikeIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_bike_id",
			Message: "Invalid bike ID format",
		})
	}

	userID := c.Locals("userID").(uuid.UUID)

	fuelLogs, err := h.fuelLogService.ListBikeFuelLogs(userID, bikeID)
	if err != nil {
		logger.Error().Err(err).Str("bike_id", bikeIDStr).Msg("Failed to list fuel logs")
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "fuel_logs_list_failed",
			Message: err.Error(),
		})
	}

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Data:    fuelLogs,
	})
}

// UpdateFuelLog godoc
// @Summary Update fuel log details
// @Tags fuel-logs
// @Accept json
// @Produce json
// @Param bike_id path string true "Bike ID"
// @Param id path string true "Fuel Log ID"
// @Param fuel_log body dto.UpdateFuelLogRequest true "Updated fuel log data"
// @Success 200 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /bikes/{bike_id}/fuel-logs/{id} [put]
// @Security BearerAuth
func (h *FuelLogHandler) UpdateFuelLog(c *fiber.Ctx) error {
	bikeIDStr := c.Params("bike_id")
	bikeID, err := uuid.Parse(bikeIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_bike_id",
			Message: "Invalid bike ID format",
		})
	}

	fuelLogIDStr := c.Params("id")
	fuelLogID, err := uuid.Parse(fuelLogIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_fuel_log_id",
			Message: "Invalid fuel log ID format",
		})
	}

	var req dto.UpdateFuelLogRequest
	if err := c.BodyParser(&req); err != nil {
		logger.Error().Err(err).Msg("Invalid request body for fuel log update")
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request body",
		})
	}

	if err := ValidateStruct(c, &req); err != nil {
		return err
	}

	userID := c.Locals("userID").(uuid.UUID)

	fuelLog, err := h.fuelLogService.UpdateFuelLog(userID, bikeID, fuelLogID, &req)
	if err != nil {
		logger.Error().Err(err).Str("fuel_log_id", fuelLogIDStr).Msg("Failed to update fuel log")
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "fuel_log_update_failed",
			Message: err.Error(),
		})
	}

	logger.Info().Str("fuel_log_id", fuelLogIDStr).Msg("Fuel log updated successfully")

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Data:    fuelLog,
		Message: "Fuel log updated successfully",
	})
}

// DeleteFuelLog godoc
// @Summary Delete a fuel log
// @Tags fuel-logs
// @Produce json
// @Param bike_id path string true "Bike ID"
// @Param id path string true "Fuel Log ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /bikes/{bike_id}/fuel-logs/{id} [delete]
// @Security BearerAuth
func (h *FuelLogHandler) DeleteFuelLog(c *fiber.Ctx) error {
	bikeIDStr := c.Params("bike_id")
	bikeID, err := uuid.Parse(bikeIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_bike_id",
			Message: "Invalid bike ID format",
		})
	}

	fuelLogIDStr := c.Params("id")
	fuelLogID, err := uuid.Parse(fuelLogIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_fuel_log_id",
			Message: "Invalid fuel log ID format",
		})
	}

	userID := c.Locals("userID").(uuid.UUID)

	if err := h.fuelLogService.DeleteFuelLog(userID, bikeID, fuelLogID); err != nil {
		logger.Error().Err(err).Str("fuel_log_id", fuelLogIDStr).Msg("Failed to delete fuel log")
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "fuel_log_delete_failed",
			Message: err.Error(),
		})
	}

	logger.Info().Str("fuel_log_id", fuelLogIDStr).Msg("Fuel log deleted successfully")

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Message: "Fuel log deleted successfully",
	})
}

// GetFuelStats godoc
// @Summary Get fuel statistics for a bike
// @Tags fuel-logs
// @Produce json
// @Param bike_id path string true "Bike ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Router /bikes/{bike_id}/fuel-stats [get]
// @Security BearerAuth
func (h *FuelLogHandler) GetFuelStats(c *fiber.Ctx) error {
	bikeIDStr := c.Params("bike_id")
	bikeID, err := uuid.Parse(bikeIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "invalid_bike_id",
			Message: "Invalid bike ID format",
		})
	}

	userID := c.Locals("userID").(uuid.UUID)

	stats, err := h.fuelLogService.GetFuelStats(userID, bikeID)
	if err != nil {
		logger.Error().Err(err).Str("bike_id", bikeIDStr).Msg("Failed to get fuel stats")
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "fuel_stats_failed",
			Message: err.Error(),
		})
	}

	return c.JSON(dto.SuccessResponse{
		Success: true,
		Data:    stats,
	})
}

