package dto

import (
	"time"

	"github.com/google/uuid"
)

// CreateFuelLogRequest - for adding a fuel log entry
type CreateFuelLogRequest struct {
	Date            time.Time `json:"date" validate:"required"`
	OdometerReading int       `json:"odometer_reading" validate:"required,min=0"`
	Liters          float64   `json:"liters" validate:"required,min=0"`
	PricePerLiter   float64   `json:"price_per_liter" validate:"required,min=0"`
	FuelType        string    `json:"fuel_type" validate:"omitempty,oneof=petrol diesel"`
	IsFullTank      bool      `json:"is_full_tank"`
	Location        string    `json:"location" validate:"omitempty"`
	Notes           string    `json:"notes" validate:"omitempty"`
}

// UpdateFuelLogRequest - for updating a fuel log entry
type UpdateFuelLogRequest struct {
	Date            *time.Time `json:"date" validate:"omitempty"`
	OdometerReading *int       `json:"odometer_reading" validate:"omitempty,min=0"`
	Liters          *float64   `json:"liters" validate:"omitempty,min=0"`
	PricePerLiter   *float64   `json:"price_per_liter" validate:"omitempty,min=0"`
	FuelType        string     `json:"fuel_type" validate:"omitempty,oneof=petrol diesel"`
	IsFullTank      *bool      `json:"is_full_tank" validate:"omitempty"`
	Location        string     `json:"location" validate:"omitempty"`
	Notes           string     `json:"notes" validate:"omitempty"`
}

// FuelLogResponse - fuel log data for API responses
type FuelLogResponse struct {
	ID              uuid.UUID  `json:"id"`
	BikeID          uuid.UUID  `json:"bike_id"`
	Date            time.Time  `json:"date"`
	OdometerReading int        `json:"odometer_reading"`
	Liters          float64    `json:"liters"`
	PricePerLiter   float64    `json:"price_per_liter"`
	TotalCost       float64    `json:"total_cost"`
	FuelType        string     `json:"fuel_type"`
	Mileage         *float64   `json:"mileage"`
	DistanceCovered *int       `json:"distance_covered"`
	IsFullTank      bool       `json:"is_full_tank"`
	Location        string     `json:"location"`
	Notes           string     `json:"notes"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

// FuelLogListResponse - list of fuel logs
type FuelLogListResponse struct {
	FuelLogs []FuelLogResponse `json:"fuel_logs"`
	Total    int               `json:"total"`
}

// FuelStatsResponse - fuel statistics for a bike
type FuelStatsResponse struct {
	BikeID          uuid.UUID `json:"bike_id"`
	TotalFuelLogs   int       `json:"total_fuel_logs"`
	TotalLiters     float64   `json:"total_liters"`
	TotalCost       float64   `json:"total_cost"`
	TotalDistance   int       `json:"total_distance"`
	AverageMileage  *float64  `json:"average_mileage"`
	LatestMileage   *float64  `json:"latest_mileage"`
	BestMileage     *float64  `json:"best_mileage"`
	WorstMileage    *float64  `json:"worst_mileage"`
	AverageCostPerKm *float64 `json:"average_cost_per_km"`
}

