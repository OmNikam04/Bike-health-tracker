package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Bike represents a user's bike/motorcycle
type Bike struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Foreign key
	UserID uuid.UUID `json:"user_id" gorm:"type:uuid;index;not null"`

	// Basic Info
	Brand              string `json:"brand" gorm:"not null"`
	Model              string `json:"model" gorm:"not null"`
	Year               *int   `json:"year"`
	RegistrationNumber string `json:"registration_number" gorm:"index"`

	// Purchase Info
	PurchaseDate  *time.Time `json:"purchase_date"`
	PurchasePrice *float64   `json:"purchase_price"`

	// Odometer
	InitialOdometer int `json:"initial_odometer" gorm:"not null;default:0"`
	CurrentOdometer int `json:"current_odometer" gorm:"not null;default:0"`

	// Optional
	FuelType string `json:"fuel_type"` // "petrol", "diesel", "electric"
	PhotoURL string `json:"photo_url"`
	Notes    string `json:"notes" gorm:"type:text"`

	// Relationships
	FuelLogs []FuelLog `json:"fuel_logs,omitempty" gorm:"foreignKey:BikeID;constraint:OnDelete:CASCADE"`
}

// BeforeCreate hook to generate UUID before creating a new bike
func (b *Bike) BeforeCreate(tx *gorm.DB) error {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return nil
}

// TableName overrides the default table name
func (Bike) TableName() string {
	return "bikes"
}
