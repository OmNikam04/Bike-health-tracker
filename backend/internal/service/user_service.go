package service

import (
	"errors"

	"github.com/google/uuid"
	"github.com/omnikam04/bike-health-tracker/internal/dto"
	"github.com/omnikam04/bike-health-tracker/internal/logger"
	"github.com/omnikam04/bike-health-tracker/internal/models"
	"github.com/omnikam04/bike-health-tracker/internal/repository"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService interface {
	CreateUser(req *dto.CreateUserRequest) (*dto.UserResponse, error)
	GetUser(id uuid.UUID) (*dto.UserResponse, error)
	UpdateUser(id uuid.UUID, req *dto.UpdateUserRequest) (*dto.UserResponse, error)
	DeleteUser(id uuid.UUID) error
	Login(req *dto.LoginRequest) (*models.User, error)
}

type userService struct {
	userRepository repository.UserRepository
}

func NewUserService(userRepository repository.UserRepository) *userService {
	return &userService{userRepository: userRepository}
}

func (s *userService) CreateUser(req *dto.CreateUserRequest) (*dto.UserResponse, error) {
	// Check if user exists
	_, err := s.userRepository.FindByEmail(req.Email)
	if err == nil {
		// User found - duplicate email
		logger.Warn().Str("email", req.Email).Msg("User already exists")
		return nil, errors.New("user with this email already exists")
	}
	// If error is not "record not found", return the error
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		logger.Error().Err(err).Msg("Failed to check existing user")
		return nil, err
	}
	// User doesn't exist - proceed with creation

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		logger.Error().Err(err).Msg("Failed to hash password")
		return nil, err
	}

	user := &models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := s.userRepository.CreateUser(user); err != nil {
		logger.Error().Err(err).Msg("Failed to create user")
		return nil, err
	}

	logger.Info().Str("user_id", user.ID.String()).Msg("User created successfully")

	return &dto.UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}, nil
}

func (s *userService) GetUser(id uuid.UUID) (*dto.UserResponse, error) {
	user, err := s.userRepository.FindByID(id)
	if err != nil {
		logger.Error().Err(err).Str("user_id", id.String()).Msg("User not found")
		return nil, errors.New("user not found")
	}

	return &dto.UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}, nil
}

func (s *userService) UpdateUser(id uuid.UUID, req *dto.UpdateUserRequest) (*dto.UserResponse, error) {
	user, err := s.userRepository.FindByID(id)
	if err != nil {
		logger.Error().Err(err).Str("user_id", id.String()).Msg("User not found")
		return nil, errors.New("user not found")
	}

	// Update fields only if provided (not empty)
	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Email != "" {
		user.Email = req.Email
	}

	// Hash new password if provided
	if req.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			logger.Error().Err(err).Msg("Failed to hash password")
			return nil, err
		}
		user.Password = string(hashedPassword)
	}

	if err := s.userRepository.Update(user); err != nil {
		logger.Error().Err(err).Msg("Failed to update user")
		return nil, err
	}

	logger.Info().Str("user_id", user.ID.String()).Msg("User updated successfully")

	return &dto.UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}, nil
}

func (s *userService) DeleteUser(id uuid.UUID) error {
	user, err := s.userRepository.FindByID(id)
	if err != nil {
		logger.Error().Err(err).Str("user_id", id.String()).Msg("User not found")
		return errors.New("user not found")
	}

	if err := s.userRepository.Delete(user.ID); err != nil {
		logger.Error().Err(err).Msg("Failed to delete user")
		return err
	}

	logger.Info().Str("user_id", user.ID.String()).Msg("User deleted successfully")
	return nil
}

func (s *userService) Login(req *dto.LoginRequest) (*models.User, error) {
	// Find user by email
	user, err := s.userRepository.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logger.Warn().Str("email", req.Email).Msg("Login attempt with non-existent email")
			return nil, errors.New("invalid email or password")
		}
		logger.Error().Err(err).Msg("Failed to find user by email")
		return nil, errors.New("login failed")
	}

	// Compare password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		logger.Warn().Str("email", req.Email).Msg("Login attempt with incorrect password")
		return nil, errors.New("invalid email or password")
	}

	logger.Info().Str("user_id", user.ID.String()).Msg("User logged in successfully")
	return user, nil
}
