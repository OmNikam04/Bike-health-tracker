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

// BikeService defines the interface for bike business logic
type BikeService interface {
	CreateBike(userID uuid.UUID, req *dto.CreateBikeRequest) (*dto.BikeResponse, error)
	GetBike(userID uuid.UUID, bikeID uuid.UUID) (*dto.BikeResponse, error)
	ListUserBikes(userID uuid.UUID) (*dto.BikeListResponse, error)
	UpdateBike(userID uuid.UUID, bikeID uuid.UUID, req *dto.UpdateBikeRequest) (*dto.BikeResponse, error)
	DeleteBike(userID uuid.UUID, bikeID uuid.UUID) error
}

// bikeService implements BikeService
type bikeService struct {
	bikeRepository    repository.BikeRepository
	fuelLogRepository repository.FuelLogRepository
}

// NewBikeService creates a new bike service
func NewBikeService(bikeRepository repository.BikeRepository, fuelLogRepository repository.FuelLogRepository) *bikeService {
	return &bikeService{
		bikeRepository:    bikeRepository,
		fuelLogRepository: fuelLogRepository,
	}
}

// CreateBike creates a new bike for a user
func (s *bikeService) CreateBike(userID uuid.UUID, req *dto.CreateBikeRequest) (*dto.BikeResponse, error) {
	bike := &models.Bike{
		UserID:             userID,
		Brand:              req.Brand,
		Model:              req.Model,
		Year:               req.Year,
		RegistrationNumber: req.RegistrationNumber,
		PurchaseDate:       req.PurchaseDate,
		PurchasePrice:      req.PurchasePrice,
		InitialOdometer:    req.InitialOdometer,
		CurrentOdometer:    req.InitialOdometer, // Set current to initial on creation
		FuelType:           req.FuelType,
		PhotoURL:           req.PhotoURL,
		Notes:              req.Notes,
	}

	if err := s.bikeRepository.Create(bike); err != nil {
		logger.Error().Err(err).Msg("Failed to create bike")
		return nil, err
	}

	logger.Info().Str("bike_id", bike.ID.String()).Str("user_id", userID.String()).Msg("Bike created successfully")

	return s.toBikeResponse(bike), nil
}

// GetBike retrieves a bike by ID (with ownership validation)
func (s *bikeService) GetBike(userID uuid.UUID, bikeID uuid.UUID) (*dto.BikeResponse, error) {
	bike, err := s.bikeRepository.FindByID(bikeID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("bike not found")
		}
		logger.Error().Err(err).Msg("Failed to find bike")
		return nil, err
	}

	// Validate ownership
	if bike.UserID != userID {
		logger.Warn().Str("bike_id", bikeID.String()).Str("user_id", userID.String()).Msg("Unauthorized bike access attempt")
		return nil, errors.New("unauthorized access to bike")
	}

	return s.toBikeResponse(bike), nil
}

// ListUserBikes retrieves all bikes for a user
func (s *bikeService) ListUserBikes(userID uuid.UUID) (*dto.BikeListResponse, error) {
	bikes, err := s.bikeRepository.FindByUserID(userID)
	if err != nil {
		logger.Error().Err(err).Str("user_id", userID.String()).Msg("Failed to list user bikes")
		return nil, err
	}

	bikeResponses := make([]dto.BikeResponse, 0, len(bikes))
	for _, bike := range bikes {
		bikeResponses = append(bikeResponses, *s.toBikeResponse(&bike))
	}

	return &dto.BikeListResponse{
		Bikes: bikeResponses,
		Total: len(bikeResponses),
	}, nil
}

// UpdateBike updates a bike (with ownership validation)
func (s *bikeService) UpdateBike(userID uuid.UUID, bikeID uuid.UUID, req *dto.UpdateBikeRequest) (*dto.BikeResponse, error) {
	bike, err := s.bikeRepository.FindByID(bikeID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("bike not found")
		}
		logger.Error().Err(err).Msg("Failed to find bike")
		return nil, err
	}

	// Validate ownership
	if bike.UserID != userID {
		logger.Warn().Str("bike_id", bikeID.String()).Str("user_id", userID.String()).Msg("Unauthorized bike update attempt")
		return nil, errors.New("unauthorized access to bike")
	}

	// Update fields if provided
	if req.Brand != "" {
		bike.Brand = req.Brand
	}
	if req.Model != "" {
		bike.Model = req.Model
	}
	if req.Year != nil {
		bike.Year = req.Year
	}
	if req.RegistrationNumber != "" {
		bike.RegistrationNumber = req.RegistrationNumber
	}
	if req.PurchaseDate != nil {
		bike.PurchaseDate = req.PurchaseDate
	}
	if req.PurchasePrice != nil {
		bike.PurchasePrice = req.PurchasePrice
	}
	if req.CurrentOdometer != nil {
		// Validate that current odometer is not less than initial
		if *req.CurrentOdometer < bike.InitialOdometer {
			return nil, errors.New("current odometer cannot be less than initial odometer")
		}
		bike.CurrentOdometer = *req.CurrentOdometer
	}
	if req.FuelType != "" {
		bike.FuelType = req.FuelType
	}
	if req.PhotoURL != "" {
		bike.PhotoURL = req.PhotoURL
	}
	if req.Notes != "" {
		bike.Notes = req.Notes
	}

	if err := s.bikeRepository.Update(bike); err != nil {
		logger.Error().Err(err).Msg("Failed to update bike")
		return nil, err
	}

	logger.Info().Str("bike_id", bike.ID.String()).Msg("Bike updated successfully")

	return s.toBikeResponse(bike), nil
}

// DeleteBike deletes a bike (with ownership validation)
func (s *bikeService) DeleteBike(userID uuid.UUID, bikeID uuid.UUID) error {
	bike, err := s.bikeRepository.FindByID(bikeID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("bike not found")
		}
		logger.Error().Err(err).Msg("Failed to find bike")
		return err
	}

	// Validate ownership
	if bike.UserID != userID {
		logger.Warn().Str("bike_id", bikeID.String()).Str("user_id", userID.String()).Msg("Unauthorized bike delete attempt")
		return errors.New("unauthorized access to bike")
	}

	// First, soft delete all fuel logs for this bike
	if err := s.fuelLogRepository.DeleteByBikeID(bikeID); err != nil {
		logger.Error().Err(err).Msg("Failed to delete fuel logs for bike")
		return err
	}

	// Then, soft delete the bike
	if err := s.bikeRepository.Delete(bikeID); err != nil {
		logger.Error().Err(err).Msg("Failed to delete bike")
		return err
	}

	logger.Info().Str("bike_id", bikeID.String()).Msg("Bike and associated fuel logs deleted successfully")

	return nil
}

// toBikeResponse converts a bike model to a bike response DTO
func (s *bikeService) toBikeResponse(bike *models.Bike) *dto.BikeResponse {
	response := &dto.BikeResponse{
		ID:                 bike.ID,
		UserID:             bike.UserID,
		Brand:              bike.Brand,
		Model:              bike.Model,
		Year:               bike.Year,
		RegistrationNumber: bike.RegistrationNumber,
		PurchaseDate:       bike.PurchaseDate,
		PurchasePrice:      bike.PurchasePrice,
		InitialOdometer:    bike.InitialOdometer,
		CurrentOdometer:    bike.CurrentOdometer,
		FuelType:           bike.FuelType,
		PhotoURL:           bike.PhotoURL,
		Notes:              bike.Notes,
		CreatedAt:          bike.CreatedAt,
		UpdatedAt:          bike.UpdatedAt,
	}

	// Get computed fields
	count, _ := s.bikeRepository.CountFuelLogs(bike.ID)
	response.TotalFuelLogs = int(count)

	latestMileage, _ := s.bikeRepository.GetLatestMileage(bike.ID)
	response.LatestMileage = latestMileage

	avgMileage, _ := s.bikeRepository.GetAverageMileage(bike.ID)
	response.AverageMileage = avgMileage

	return response
}
