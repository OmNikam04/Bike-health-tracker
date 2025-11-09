package repository

import (
	"github.com/google/uuid"
	"github.com/omnikam04/bike-health-tracker/internal/models"
	"gorm.io/gorm"
)

// BikeRepository defines the interface for bike data access
type BikeRepository interface {
	Create(bike *models.Bike) error
	FindByID(id uuid.UUID) (*models.Bike, error)
	FindByUserID(userID uuid.UUID) ([]models.Bike, error)
	Update(bike *models.Bike) error
	Delete(id uuid.UUID) error
	CountFuelLogs(bikeID uuid.UUID) (int64, error)
	GetLatestMileage(bikeID uuid.UUID) (*float64, error)
	GetAverageMileage(bikeID uuid.UUID) (*float64, error)
}

// bikeRepository implements BikeRepository
type bikeRepository struct {
	db *gorm.DB
}

// NewBikeRepository creates a new bike repository
func NewBikeRepository(db *gorm.DB) *bikeRepository {
	return &bikeRepository{db: db}
}

// Create creates a new bike
func (r *bikeRepository) Create(bike *models.Bike) error {
	return r.db.Create(bike).Error
}

// FindByID finds a bike by ID
func (r *bikeRepository) FindByID(id uuid.UUID) (*models.Bike, error) {
	var bike models.Bike
	err := r.db.First(&bike, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &bike, nil
}

// FindByUserID finds all bikes for a user
func (r *bikeRepository) FindByUserID(userID uuid.UUID) ([]models.Bike, error) {
	var bikes []models.Bike
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&bikes).Error
	if err != nil {
		return nil, err
	}
	return bikes, nil
}

// Update updates a bike
func (r *bikeRepository) Update(bike *models.Bike) error {
	return r.db.Save(bike).Error
}

// Delete soft deletes a bike
func (r *bikeRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Bike{}, "id = ?", id).Error
}

// CountFuelLogs counts the number of fuel logs for a bike
func (r *bikeRepository) CountFuelLogs(bikeID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.Model(&models.FuelLog{}).Where("bike_id = ?", bikeID).Count(&count).Error
	return count, err
}

// GetLatestMileage gets the latest mileage for a bike
func (r *bikeRepository) GetLatestMileage(bikeID uuid.UUID) (*float64, error) {
	var result struct {
		Mileage *float64
	}
	err := r.db.Model(&models.FuelLog{}).
		Select("mileage").
		Where("bike_id = ? AND mileage IS NOT NULL", bikeID).
		Order("date DESC, created_at DESC").
		Limit(1).
		Scan(&result).Error
	
	if err != nil {
		return nil, err
	}
	return result.Mileage, nil
}

// GetAverageMileage calculates the average mileage for a bike
func (r *bikeRepository) GetAverageMileage(bikeID uuid.UUID) (*float64, error) {
	var result struct {
		AvgMileage *float64
	}
	err := r.db.Model(&models.FuelLog{}).
		Select("AVG(mileage) as avg_mileage").
		Where("bike_id = ? AND mileage IS NOT NULL", bikeID).
		Scan(&result).Error
	
	if err != nil {
		return nil, err
	}
	return result.AvgMileage, nil
}

