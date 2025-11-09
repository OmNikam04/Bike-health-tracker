package repository

import (
	"github.com/google/uuid"
	"github.com/omnikam04/bike-health-tracker/internal/models"
	"gorm.io/gorm"
)

// FuelLogRepository defines the interface for fuel log data access
type FuelLogRepository interface {
	Create(fuelLog *models.FuelLog) error
	FindByID(id uuid.UUID) (*models.FuelLog, error)
	FindByBikeID(bikeID uuid.UUID) ([]models.FuelLog, error)
	FindPreviousLog(bikeID uuid.UUID, currentDate string, currentOdometer int) (*models.FuelLog, error)
	FindNextLog(bikeID uuid.UUID, currentDate string, currentOdometer int) (*models.FuelLog, error)
	Update(fuelLog *models.FuelLog) error
	Delete(id uuid.UUID) error
	GetStats(bikeID uuid.UUID) (*FuelStats, error)
}

// FuelStats holds fuel statistics for a bike
type FuelStats struct {
	TotalLogs       int64
	TotalLiters     float64
	TotalCost       float64
	TotalDistance   int
	AverageMileage  *float64
	LatestMileage   *float64
	BestMileage     *float64
	WorstMileage    *float64
}

// fuelLogRepository implements FuelLogRepository
type fuelLogRepository struct {
	db *gorm.DB
}

// NewFuelLogRepository creates a new fuel log repository
func NewFuelLogRepository(db *gorm.DB) *fuelLogRepository {
	return &fuelLogRepository{db: db}
}

// Create creates a new fuel log
func (r *fuelLogRepository) Create(fuelLog *models.FuelLog) error {
	return r.db.Create(fuelLog).Error
}

// FindByID finds a fuel log by ID
func (r *fuelLogRepository) FindByID(id uuid.UUID) (*models.FuelLog, error) {
	var fuelLog models.FuelLog
	err := r.db.First(&fuelLog, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &fuelLog, nil
}

// FindByBikeID finds all fuel logs for a bike, ordered by date and odometer descending
func (r *fuelLogRepository) FindByBikeID(bikeID uuid.UUID) ([]models.FuelLog, error) {
	var fuelLogs []models.FuelLog
	err := r.db.Where("bike_id = ?", bikeID).
		Order("date DESC, odometer_reading DESC").
		Find(&fuelLogs).Error
	if err != nil {
		return nil, err
	}
	return fuelLogs, nil
}

// FindPreviousLog finds the most recent fuel log before the current one
func (r *fuelLogRepository) FindPreviousLog(bikeID uuid.UUID, currentDate string, currentOdometer int) (*models.FuelLog, error) {
	var fuelLog models.FuelLog
	err := r.db.Where("bike_id = ?", bikeID).
		Where("(date < ? OR (date = ? AND odometer_reading < ?))", currentDate, currentDate, currentOdometer).
		Order("date DESC, odometer_reading DESC").
		Limit(1).
		First(&fuelLog).Error
	
	if err != nil {
		return nil, err
	}
	return &fuelLog, nil
}

// FindNextLog finds the next fuel log after the current one
func (r *fuelLogRepository) FindNextLog(bikeID uuid.UUID, currentDate string, currentOdometer int) (*models.FuelLog, error) {
	var fuelLog models.FuelLog
	err := r.db.Where("bike_id = ?", bikeID).
		Where("(date > ? OR (date = ? AND odometer_reading > ?))", currentDate, currentDate, currentOdometer).
		Order("date ASC, odometer_reading ASC").
		Limit(1).
		First(&fuelLog).Error
	
	if err != nil {
		return nil, err
	}
	return &fuelLog, nil
}

// Update updates a fuel log
func (r *fuelLogRepository) Update(fuelLog *models.FuelLog) error {
	return r.db.Save(fuelLog).Error
}

// Delete soft deletes a fuel log
func (r *fuelLogRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.FuelLog{}, "id = ?", id).Error
}

// GetStats calculates fuel statistics for a bike
func (r *fuelLogRepository) GetStats(bikeID uuid.UUID) (*FuelStats, error) {
	var stats FuelStats
	
	// Get total logs, liters, and cost
	err := r.db.Model(&models.FuelLog{}).
		Select("COUNT(*) as total_logs, COALESCE(SUM(liters), 0) as total_liters, COALESCE(SUM(total_cost), 0) as total_cost").
		Where("bike_id = ?", bikeID).
		Scan(&stats).Error
	
	if err != nil {
		return nil, err
	}
	
	// Get total distance (sum of all distance_covered where not null)
	var distanceResult struct {
		TotalDistance *int
	}
	err = r.db.Model(&models.FuelLog{}).
		Select("SUM(distance_covered) as total_distance").
		Where("bike_id = ? AND distance_covered IS NOT NULL", bikeID).
		Scan(&distanceResult).Error
	
	if err != nil {
		return nil, err
	}
	if distanceResult.TotalDistance != nil {
		stats.TotalDistance = *distanceResult.TotalDistance
	}
	
	// Get mileage statistics
	var mileageStats struct {
		AvgMileage   *float64
		LatestMileage *float64
		BestMileage  *float64
		WorstMileage *float64
	}
	
	err = r.db.Model(&models.FuelLog{}).
		Select("AVG(mileage) as avg_mileage, MAX(mileage) as best_mileage, MIN(mileage) as worst_mileage").
		Where("bike_id = ? AND mileage IS NOT NULL", bikeID).
		Scan(&mileageStats).Error
	
	if err != nil {
		return nil, err
	}
	
	stats.AverageMileage = mileageStats.AvgMileage
	stats.BestMileage = mileageStats.BestMileage
	stats.WorstMileage = mileageStats.WorstMileage
	
	// Get latest mileage
	err = r.db.Model(&models.FuelLog{}).
		Select("mileage").
		Where("bike_id = ? AND mileage IS NOT NULL", bikeID).
		Order("date DESC, created_at DESC").
		Limit(1).
		Scan(&mileageStats.LatestMileage).Error
	
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}
	
	stats.LatestMileage = mileageStats.LatestMileage
	
	return &stats, nil
}

