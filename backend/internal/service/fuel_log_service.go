package service

import (
	"errors"

	"github.com/google/uuid"
	"github.com/omnikam04/bike-health-tracker/internal/dto"
	"github.com/omnikam04/bike-health-tracker/internal/logger"
	"github.com/omnikam04/bike-health-tracker/internal/models"
	"github.com/omnikam04/bike-health-tracker/internal/repository"
	"gorm.io/gorm"
)

// FuelLogService defines the interface for fuel log business logic
type FuelLogService interface {
	CreateFuelLog(userID uuid.UUID, bikeID uuid.UUID, req *dto.CreateFuelLogRequest) (*dto.FuelLogResponse, error)
	GetFuelLog(userID uuid.UUID, bikeID uuid.UUID, fuelLogID uuid.UUID) (*dto.FuelLogResponse, error)
	ListBikeFuelLogs(userID uuid.UUID, bikeID uuid.UUID) (*dto.FuelLogListResponse, error)
	UpdateFuelLog(userID uuid.UUID, bikeID uuid.UUID, fuelLogID uuid.UUID, req *dto.UpdateFuelLogRequest) (*dto.FuelLogResponse, error)
	DeleteFuelLog(userID uuid.UUID, bikeID uuid.UUID, fuelLogID uuid.UUID) error
	GetFuelStats(userID uuid.UUID, bikeID uuid.UUID) (*dto.FuelStatsResponse, error)
}

// fuelLogService implements FuelLogService
type fuelLogService struct {
	fuelLogRepository repository.FuelLogRepository
	bikeRepository    repository.BikeRepository
}

// NewFuelLogService creates a new fuel log service
func NewFuelLogService(fuelLogRepository repository.FuelLogRepository, bikeRepository repository.BikeRepository) *fuelLogService {
	return &fuelLogService{
		fuelLogRepository: fuelLogRepository,
		bikeRepository:    bikeRepository,
	}
}

// CreateFuelLog creates a new fuel log entry
func (s *fuelLogService) CreateFuelLog(userID uuid.UUID, bikeID uuid.UUID, req *dto.CreateFuelLogRequest) (*dto.FuelLogResponse, error) {
	// Validate bike ownership
	bike, err := s.bikeRepository.FindByID(bikeID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("bike not found")
		}
		logger.Error().Err(err).Msg("Failed to find bike")
		return nil, err
	}

	if bike.UserID != userID {
		logger.Warn().Str("bike_id", bikeID.String()).Str("user_id", userID.String()).Msg("Unauthorized fuel log creation attempt")
		return nil, errors.New("unauthorized access to bike")
	}

	// Validate odometer reading
	if req.OdometerReading < bike.InitialOdometer {
		return nil, errors.New("odometer reading cannot be less than bike's initial odometer")
	}

	// Calculate total cost
	totalCost := req.Liters * req.PricePerLiter

	// Create fuel log
	fuelLog := &models.FuelLog{
		BikeID:          bikeID,
		Date:            req.Date,
		OdometerReading: req.OdometerReading,
		Liters:          req.Liters,
		PricePerLiter:   req.PricePerLiter,
		TotalCost:       totalCost,
		FuelType:        req.FuelType,
		IsFullTank:      req.IsFullTank,
		Location:        req.Location,
		Notes:           req.Notes,
	}

	// Find previous fuel log to calculate mileage
	dateStr := req.Date.Format("2006-01-02")
	previousLog, err := s.fuelLogRepository.FindPreviousLog(bikeID, dateStr, req.OdometerReading)
	
	if err == nil && previousLog != nil {
		// Calculate distance covered and mileage for the previous log
		distanceCovered := req.OdometerReading - previousLog.OdometerReading
		if distanceCovered > 0 && previousLog.Liters > 0 {
			mileage := float64(distanceCovered) / previousLog.Liters
			previousLog.Mileage = &mileage
			previousLog.DistanceCovered = &distanceCovered
			
			// Update previous log with calculated mileage
			if err := s.fuelLogRepository.Update(previousLog); err != nil {
				logger.Error().Err(err).Msg("Failed to update previous fuel log mileage")
				// Don't fail the creation, just log the error
			}
		}
	} else if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		logger.Error().Err(err).Msg("Failed to find previous fuel log")
		// Don't fail the creation, continue without mileage calculation
	}

	// Create the new fuel log
	if err := s.fuelLogRepository.Create(fuelLog); err != nil {
		logger.Error().Err(err).Msg("Failed to create fuel log")
		return nil, err
	}

	// Update bike's current odometer
	bike.CurrentOdometer = req.OdometerReading
	if err := s.bikeRepository.Update(bike); err != nil {
		logger.Error().Err(err).Msg("Failed to update bike odometer")
		// Don't fail the creation, just log the error
	}

	logger.Info().Str("fuel_log_id", fuelLog.ID.String()).Str("bike_id", bikeID.String()).Msg("Fuel log created successfully")

	return s.toFuelLogResponse(fuelLog), nil
}

// GetFuelLog retrieves a fuel log by ID (with ownership validation)
func (s *fuelLogService) GetFuelLog(userID uuid.UUID, bikeID uuid.UUID, fuelLogID uuid.UUID) (*dto.FuelLogResponse, error) {
	// Validate bike ownership
	if err := s.validateBikeOwnership(userID, bikeID); err != nil {
		return nil, err
	}

	fuelLog, err := s.fuelLogRepository.FindByID(fuelLogID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("fuel log not found")
		}
		logger.Error().Err(err).Msg("Failed to find fuel log")
		return nil, err
	}

	// Validate that fuel log belongs to the bike
	if fuelLog.BikeID != bikeID {
		return nil, errors.New("fuel log does not belong to this bike")
	}

	return s.toFuelLogResponse(fuelLog), nil
}

// ListBikeFuelLogs retrieves all fuel logs for a bike (with ownership validation)
func (s *fuelLogService) ListBikeFuelLogs(userID uuid.UUID, bikeID uuid.UUID) (*dto.FuelLogListResponse, error) {
	// Validate bike ownership
	if err := s.validateBikeOwnership(userID, bikeID); err != nil {
		return nil, err
	}

	fuelLogs, err := s.fuelLogRepository.FindByBikeID(bikeID)
	if err != nil {
		logger.Error().Err(err).Str("bike_id", bikeID.String()).Msg("Failed to list fuel logs")
		return nil, err
	}

	fuelLogResponses := make([]dto.FuelLogResponse, 0, len(fuelLogs))
	for _, fuelLog := range fuelLogs {
		fuelLogResponses = append(fuelLogResponses, *s.toFuelLogResponse(&fuelLog))
	}

	return &dto.FuelLogListResponse{
		FuelLogs: fuelLogResponses,
		Total:    len(fuelLogResponses),
	}, nil
}

// UpdateFuelLog updates a fuel log (with ownership validation and mileage recalculation)
func (s *fuelLogService) UpdateFuelLog(userID uuid.UUID, bikeID uuid.UUID, fuelLogID uuid.UUID, req *dto.UpdateFuelLogRequest) (*dto.FuelLogResponse, error) {
	// Validate bike ownership
	bike, err := s.bikeRepository.FindByID(bikeID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("bike not found")
		}
		return nil, err
	}

	if bike.UserID != userID {
		return nil, errors.New("unauthorized access to bike")
	}

	fuelLog, err := s.fuelLogRepository.FindByID(fuelLogID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("fuel log not found")
		}
		return nil, err
	}

	if fuelLog.BikeID != bikeID {
		return nil, errors.New("fuel log does not belong to this bike")
	}

	// Track if odometer or date changed (need to recalculate mileage chain)
	needsRecalculation := false

	// Update fields if provided
	if req.Date != nil {
		fuelLog.Date = *req.Date
		needsRecalculation = true
	}
	if req.OdometerReading != nil {
		if *req.OdometerReading < bike.InitialOdometer {
			return nil, errors.New("odometer reading cannot be less than bike's initial odometer")
		}
		fuelLog.OdometerReading = *req.OdometerReading
		needsRecalculation = true
	}
	if req.Liters != nil {
		fuelLog.Liters = *req.Liters
		fuelLog.TotalCost = *req.Liters * fuelLog.PricePerLiter
	}
	if req.PricePerLiter != nil {
		fuelLog.PricePerLiter = *req.PricePerLiter
		fuelLog.TotalCost = fuelLog.Liters * *req.PricePerLiter
	}
	if req.FuelType != "" {
		fuelLog.FuelType = req.FuelType
	}
	if req.IsFullTank != nil {
		fuelLog.IsFullTank = *req.IsFullTank
	}
	if req.Location != "" {
		fuelLog.Location = req.Location
	}
	if req.Notes != "" {
		fuelLog.Notes = req.Notes
	}

	// If odometer or date changed, recalculate mileage
	if needsRecalculation {
		// Reset mileage fields
		fuelLog.Mileage = nil
		fuelLog.DistanceCovered = nil

		// Recalculate for this log and next log
		s.recalculateMileageChain(fuelLog)
	}

	if err := s.fuelLogRepository.Update(fuelLog); err != nil {
		logger.Error().Err(err).Msg("Failed to update fuel log")
		return nil, err
	}

	logger.Info().Str("fuel_log_id", fuelLogID.String()).Msg("Fuel log updated successfully")

	return s.toFuelLogResponse(fuelLog), nil
}

// DeleteFuelLog deletes a fuel log (with ownership validation and mileage recalculation)
func (s *fuelLogService) DeleteFuelLog(userID uuid.UUID, bikeID uuid.UUID, fuelLogID uuid.UUID) error {
	// Validate bike ownership
	if err := s.validateBikeOwnership(userID, bikeID); err != nil {
		return err
	}

	fuelLog, err := s.fuelLogRepository.FindByID(fuelLogID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("fuel log not found")
		}
		return err
	}

	if fuelLog.BikeID != bikeID {
		return errors.New("fuel log does not belong to this bike")
	}

	// Before deleting, recalculate mileage for the next log
	dateStr := fuelLog.Date.Format("2006-01-02")
	nextLog, err := s.fuelLogRepository.FindNextLog(bikeID, dateStr, fuelLog.OdometerReading)
	if err == nil && nextLog != nil {
		// Reset next log's mileage (will be recalculated when user adds another log)
		nextLog.Mileage = nil
		nextLog.DistanceCovered = nil
		_ = s.fuelLogRepository.Update(nextLog)
	}

	if err := s.fuelLogRepository.Delete(fuelLogID); err != nil {
		logger.Error().Err(err).Msg("Failed to delete fuel log")
		return err
	}

	logger.Info().Str("fuel_log_id", fuelLogID.String()).Msg("Fuel log deleted successfully")

	return nil
}

// GetFuelStats retrieves fuel statistics for a bike
func (s *fuelLogService) GetFuelStats(userID uuid.UUID, bikeID uuid.UUID) (*dto.FuelStatsResponse, error) {
	// Validate bike ownership
	if err := s.validateBikeOwnership(userID, bikeID); err != nil {
		return nil, err
	}

	stats, err := s.fuelLogRepository.GetStats(bikeID)
	if err != nil {
		logger.Error().Err(err).Str("bike_id", bikeID.String()).Msg("Failed to get fuel stats")
		return nil, err
	}

	response := &dto.FuelStatsResponse{
		BikeID:         bikeID,
		TotalFuelLogs:  int(stats.TotalLogs),
		TotalLiters:    stats.TotalLiters,
		TotalCost:      stats.TotalCost,
		TotalDistance:  stats.TotalDistance,
		AverageMileage: stats.AverageMileage,
		LatestMileage:  stats.LatestMileage,
		BestMileage:    stats.BestMileage,
		WorstMileage:   stats.WorstMileage,
	}

	// Calculate average cost per km
	if stats.TotalDistance > 0 {
		avgCostPerKm := stats.TotalCost / float64(stats.TotalDistance)
		response.AverageCostPerKm = &avgCostPerKm
	}

	return response, nil
}

// Helper functions

func (s *fuelLogService) validateBikeOwnership(userID uuid.UUID, bikeID uuid.UUID) error {
	bike, err := s.bikeRepository.FindByID(bikeID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("bike not found")
		}
		return err
	}

	if bike.UserID != userID {
		logger.Warn().Str("bike_id", bikeID.String()).Str("user_id", userID.String()).Msg("Unauthorized bike access attempt")
		return errors.New("unauthorized access to bike")
	}

	return nil
}

func (s *fuelLogService) recalculateMileageChain(currentLog *models.FuelLog) {
	// Find previous log and calculate mileage for it
	dateStr := currentLog.Date.Format("2006-01-02")
	previousLog, err := s.fuelLogRepository.FindPreviousLog(currentLog.BikeID, dateStr, currentLog.OdometerReading)
	
	if err == nil && previousLog != nil {
		distanceCovered := currentLog.OdometerReading - previousLog.OdometerReading
		if distanceCovered > 0 && previousLog.Liters > 0 {
			mileage := float64(distanceCovered) / previousLog.Liters
			previousLog.Mileage = &mileage
			previousLog.DistanceCovered = &distanceCovered
			_ = s.fuelLogRepository.Update(previousLog)
		}
	}
}

func (s *fuelLogService) toFuelLogResponse(fuelLog *models.FuelLog) *dto.FuelLogResponse {
	return &dto.FuelLogResponse{
		ID:              fuelLog.ID,
		BikeID:          fuelLog.BikeID,
		Date:            fuelLog.Date,
		OdometerReading: fuelLog.OdometerReading,
		Liters:          fuelLog.Liters,
		PricePerLiter:   fuelLog.PricePerLiter,
		TotalCost:       fuelLog.TotalCost,
		FuelType:        fuelLog.FuelType,
		Mileage:         fuelLog.Mileage,
		DistanceCovered: fuelLog.DistanceCovered,
		IsFullTank:      fuelLog.IsFullTank,
		Location:        fuelLog.Location,
		Notes:           fuelLog.Notes,
		CreatedAt:       fuelLog.CreatedAt,
		UpdatedAt:       fuelLog.UpdatedAt,
	}
}

