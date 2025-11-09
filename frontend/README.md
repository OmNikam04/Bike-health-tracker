# 🏍️ Bike Health Tracker - Mobile App

A modern React Native mobile application for tracking bike health, fuel logs, and maintenance using Expo.

## 📱 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Library**: React Native Paper (Material Design 3)
- **HTTP Client**: Axios
- **Storage**: AsyncStorage + Expo Secure Store
- **State Management**: React Context API (coming in Phase 2)

## 🎨 Design System

### Color Scheme (Modern Blue/Teal)
- **Primary**: #0066FF (Vibrant Blue)
- **Secondary**: #00D9FF (Bright Teal)
- **Accent**: #FF6B35 (Energetic Orange)
- **Background**: #F8F9FA (Light Gray)
- **Surface**: #FFFFFF (White)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app installed on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Backend API running (default: http://192.168.1.17:8080)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   The `.env` file is already created with default values:
   ```
   API_BASE_URL=http://192.168.1.17:8080/api/v1
   NODE_ENV=development
   ```
   
   **Important**: Update `API_BASE_URL` with your machine's IP address if different.

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - Open **Expo Go** app on your phone
   - Scan the QR code displayed in the terminal
   - The app will load on your phone!

## 📂 Project Structure

```
frontend/
├── src/
│   ├── constants/
│   │   ├── theme.ts          # Color scheme, spacing, typography
│   │   └── config.ts         # API config, app constants
│   └── types/
│       └── env.d.ts          # Environment variable types
├── assets/                   # Images, icons, fonts
├── App.tsx                   # Root component with theme provider
├── .env                      # Environment variables
├── package.json
├── tsconfig.json
└── babel.config.js
```

## 🔧 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser

## 📱 Testing on Your Phone

### Android
1. Install **Expo Go** from Play Store
2. Make sure your phone and computer are on the **same WiFi network**
3. Run `npm start`
4. Scan the QR code with Expo Go app

### iOS
1. Install **Expo Go** from App Store
2. Make sure your phone and computer are on the **same WiFi network**
3. Run `npm start`
4. Scan the QR code with Camera app (it will open in Expo Go)

## 🔍 Troubleshooting

### "Unable to connect to server"
- Ensure your phone and computer are on the same WiFi network
- Update `API_BASE_URL` in `.env` with your machine's IP address
- Check if backend is running: `curl http://192.168.1.17:8080/health`

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start --clear
```

### QR code not scanning
- Try tunnel mode: `npm start --tunnel`
- Or manually enter the URL shown in terminal into Expo Go

## 🎯 Development Phases

### ✅ Phase 1: Foundation Setup (COMPLETE)
- [x] Expo project initialization
- [x] TypeScript configuration
- [x] React Native Paper UI library
- [x] Theme system (colors, spacing, typography)
- [x] Environment configuration
- [x] Basic app structure

### 🔄 Phase 2: Authentication System (NEXT)
- [ ] API client with Axios
- [ ] Auth context & token management
- [ ] Login screen
- [ ] Signup screen
- [ ] Secure token storage
- [ ] Auto-login functionality

### 📋 Phase 3: Bike Management
- [ ] Bike list screen
- [ ] Add/Edit bike screen
- [ ] Bike detail screen
- [ ] Bike CRUD operations

### ⛽ Phase 4: Fuel Log Management
- [ ] Fuel log list screen
- [ ] Add/Edit fuel log screen
- [ ] Fuel statistics screen
- [ ] Mileage tracking

### ✨ Phase 5: Polish & Enhancement
- [ ] Loading states
- [ ] Error handling
- [ ] Empty states
- [ ] Pull-to-refresh
- [ ] Confirmation dialogs

## 🔗 Backend API

The app connects to the Bike Health Tracker backend API:
- **Base URL**: http://192.168.1.17:8080/api/v1
- **Health Check**: http://192.168.1.17:8080/health

### API Endpoints (Phase 2+)
- `POST /user/signup` - Create account
- `POST /user/login` - Login
- `POST /user/refresh` - Refresh tokens
- `GET /user/me` - Get current user
- `GET /bikes` - List bikes
- `POST /bikes` - Create bike
- `GET /bikes/:id/fuel-logs` - Get fuel logs
- `POST /bikes/:id/fuel-logs` - Add fuel log

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript](https://www.typescriptlang.org/)

## 🤝 Contributing

This is a personal project for learning purposes.

## 📄 License

MIT

---

**Current Status**: Phase 1 Complete ✅  
**Next Step**: Install dependencies and test the app!

