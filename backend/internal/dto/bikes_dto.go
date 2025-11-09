package dto

import (
	"time"

	"github.com/google/uuid"
)

// CreateBikeRequest - for bike registration
type CreateBikeRequest struct {
	Brand              string     `json:"brand" validate:"required"`
	Model              string     `json:"model" validate:"required"`
	Year               *int       `json:"year" validate:"omitempty,min=1900,max=2100"`
	RegistrationNumber string     `json:"registration_number" validate:"omitempty"`
	PurchaseDate       *time.Time `json:"purchase_date" validate:"omitempty"`
	PurchasePrice      *float64   `json:"purchase_price" validate:"omitempty,min=0"`
	InitialOdometer    int        `json:"initial_odometer" validate:"min=0"`
	FuelType           string     `json:"fuel_type" validate:"omitempty,oneof=petrol diesel electric"`
	PhotoURL           string     `json:"photo_url" validate:"omitempty,url"`
	Notes              string     `json:"notes" validate:"omitempty"`
}

// UpdateBikeRequest - for updating bike details
type UpdateBikeRequest struct {
	Brand              string     `json:"brand" validate:"omitempty"`
	Model              string     `json:"model" validate:"omitempty"`
	Year               *int       `json:"year" validate:"omitempty,min=1900,max=2100"`
	RegistrationNumber string     `json:"registration_number" validate:"omitempty"`
	PurchaseDate       *time.Time `json:"purchase_date" validate:"omitempty"`
	PurchasePrice      *float64   `json:"purchase_price" validate:"omitempty,min=0"`
	CurrentOdometer    *int       `json:"current_odometer" validate:"omitempty,min=0"`
	FuelType           string     `json:"fuel_type" validate:"omitempty,oneof=petrol diesel electric"`
	PhotoURL           string     `json:"photo_url" validate:"omitempty,url"`
	Notes              string     `json:"notes" validate:"omitempty"`
}

// BikeResponse - bike data for API responses
type BikeResponse struct {
	ID                 uuid.UUID  `json:"id"`
	UserID             uuid.UUID  `json:"user_id"`
	Brand              string     `json:"brand"`
	Model              string     `json:"model"`
	Year               *int       `json:"year"`
	RegistrationNumber string     `json:"registration_number"`
	PurchaseDate       *time.Time `json:"purchase_date"`
	PurchasePrice      *float64   `json:"purchase_price"`
	InitialOdometer    int        `json:"initial_odometer"`
	CurrentOdometer    int        `json:"current_odometer"`
	FuelType           string     `json:"fuel_type"`
	PhotoURL           string     `json:"photo_url"`
	Notes              string     `json:"notes"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`

	// Computed fields
	TotalFuelLogs  int      `json:"total_fuel_logs"`
	LatestMileage  *float64 `json:"latest_mileage"`
	AverageMileage *float64 `json:"average_mileage"`
}

// BikeListResponse - list of bikes
type BikeListResponse struct {
	Bikes []BikeResponse `json:"bikes"`
	Total int            `json:"total"`
}

