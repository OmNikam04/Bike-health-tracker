package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// FuelLog represents a fuel fill-up record for a bike
type FuelLog struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Foreign key
	BikeID uuid.UUID `json:"bike_id" gorm:"type:uuid;index;not null"`

	// Log Data
	Date            time.Time `json:"date" gorm:"not null;index"`
	OdometerReading int       `json:"odometer_reading" gorm:"not null"`

	// Fuel Details
	Liters        float64 `json:"liters" gorm:"not null"`
	PricePerLiter float64 `json:"price_per_liter" gorm:"not null"`
	TotalCost     float64 `json:"total_cost" gorm:"not null"`
	FuelType      string  `json:"fuel_type"` // "petrol", "diesel"

	// Auto-calculated fields
	Mileage         *float64 `json:"mileage"`          // km/liter (calculated from previous log)
	DistanceCovered *int     `json:"distance_covered"` // km since last fill

	// Optional
	IsFullTank bool   `json:"is_full_tank" gorm:"default:true"`
	Location   string `json:"location"`
	Notes      string `json:"notes" gorm:"type:text"`

	// Relationships
	Bike *Bike `json:"bike,omitempty" gorm:"foreignKey:BikeID;constraint:OnDelete:CASCADE"`
}

// BeforeCreate hook to generate UUID before creating a new fuel log
func (f *FuelLog) BeforeCreate(tx *gorm.DB) error {
	if f.ID == uuid.Nil {
		f.ID = uuid.New()
	}
	return nil
}

// TableName overrides the default table name
func (FuelLog) TableName() string {
	return "fuel_logs"
}

