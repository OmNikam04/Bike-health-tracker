# 🚀 Quick Start Guide

## Step 1: Install Dependencies

```bash
cd frontend
npm install
```

**Expected time**: 1-2 minutes

## Step 2: Start Development Server

```bash
npm start
```

**What happens**:
- Metro bundler starts
- QR code appears in terminal
- Development server runs on your machine

## Step 3: Open on Your Phone

### Android:
1. Open **Expo Go** app
2. Tap **"Scan QR code"**
3. Point camera at QR code in terminal
4. App loads automatically!

### iOS:
1. Open **Camera** app
2. Point at QR code in terminal
3. Tap notification to open in Expo Go
4. App loads automatically!

## Step 4: Verify It Works

You should see:
- 🏍️ "Bike Health Tracker" title in blue
- "Phase 1: Foundation Setup Complete!" subtitle
- Orange "Get Started" button
- Modern, clean interface

## 🎨 What You're Seeing

- **Theme**: Modern blue/teal color scheme
- **UI Library**: React Native Paper (Material Design 3)
- **Typography**: Clean, modern fonts
- **Layout**: Centered, responsive design

## 🔧 Development Tips

### Hot Reload
- Save any file → Changes appear instantly on your phone
- No need to restart the app!

### View Logs
- Check terminal for console.log output
- Shake phone → Open developer menu

### Restart App
- Press `r` in terminal
- Or shake phone → "Reload"

## 🐛 Common Issues

### "Unable to connect"
**Solution**: Ensure phone and computer are on same WiFi

### "Network error"
**Solution**: Check backend is running at http://192.168.1.17:8080

### "Module not found"
**Solution**: 
```bash
rm -rf node_modules
npm install
npm start --clear
```

## 📱 Next: Test Backend Connection

Once Phase 2 is complete, you'll be able to:
1. Create an account
2. Login
3. Add bikes
4. Track fuel logs

## 🎯 Current Status

✅ Phase 1: Foundation Setup - **COMPLETE**  
🔄 Phase 2: Authentication - **NEXT**

---

**Ready?** Run `npm install` and `npm start`! 🚀

