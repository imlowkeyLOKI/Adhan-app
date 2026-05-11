# Adhan App — Plan of Action

## Framework Decision: Expo (React Native)
The single most important technical choice. Expo sits on top of React Native and gives us iOS + Android from one codebase with the least setup friction. It has first-class libraries for everything this app needs: notifications, audio, location, and sensors. This is the right call for a beginner-led, 2–4 week project.

---

## Phase 1 — Project Setup
**Status: Complete ✓**

- [x] Initialize an Expo project with TypeScript
- [x] Set up folder structure (screens, components, services, assets)
- [x] Push skeleton to GitHub
- [x] Install all core dependencies upfront so we don't chase them later

---

## Phase 2 — Prayer Times Engine
**Status: Complete ✓**

- [x] Use the **Adhan.js** library (the gold standard for Islamic prayer time calculation — used by major Muslim apps)
- [x] Get the user's location automatically via `expo-location`
- [x] Calculate all 5 daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha)
- [x] Build the main home screen displaying today's times
- [x] Add a settings screen to select calculation method (ISNA, MWL, Egyptian, Karachi, etc.) and madhab

---

## Phase 3 — Push Notifications
**Status: Complete ✓**

- [x] Use `expo-notifications` to schedule local notifications (no server needed)
- [x] For each prayer, schedule two notifications every day:
  - 15-minute warning
  - On-time notification with Adhan audio as the sound (custom sound requires dev build — Phase 4)
- [x] Schedule 3 days ahead (30 notifications, within iOS 64-notification limit)
- [x] Reschedule automatically when calculation method changes in settings
- [x] Notification toggle in Settings with permission state feedback
- [x] Android notification channels configured (adhan + reminder)

---

## Phase 4 — Adhan Audio & Reciter Selection
**Status: Partially Complete — awaiting audio files**

- [x] Reciter config: Mishary Rashid, Abdul Basit, Makkah
- [x] Reciter selection persisted via AsyncStorage
- [x] Selected reciter wired to notification sound
- [x] Reciter picker in Settings screen
- [x] app.json configured to bundle .wav files
- [ ] Add actual audio files to assets/audio/ (see instructions below)
  - `assets/audio/adhan_mishary.wav`
  - `assets/audio/adhan_abdul_basit.wav`
  - `assets/audio/adhan_makkah.wav`
  - Files must be under 30 seconds for iOS notification sounds
  - Source: download from Islamic Network, IslamicFinder, or similar

---

## Phase 5 — Silent Mode Bypass
**Status: Partially Complete**

- [x] Android: Adhan notification channel set to `bypassDnd: true` + `AndroidImportance.MAX`
- [x] Android: `ACCESS_NOTIFICATION_POLICY` permission added
- [ ] iOS: Critical Alerts entitlement — skipped for now (not submitting to App Store)
  - When needed: add `com.apple.developer.usernotifications.critical-alerts` entitlement to app.json
  - Add `allowCriticalAlerts: true` to permission request
  - Schedule Adhan with `{ critical: true, volume: 1.0 }` sound object

---

## Phase 6 — Home Screen Widget
**Status: Complete ✓ (requires EAS Build to activate — cannot test in Expo Go)**

- [x] `widgetData` service: builds prayer time payload for widgets
- [x] `widgetSync` service: writes data to shared storage so iOS widget can read it
- [x] Android widget: `AdhanWidget.tsx` + `widgetTaskHandler.ts` via `react-native-android-widget`
- [x] iOS widget: `AdhanWidget.swift` (WidgetKit) reads from App Group UserDefaults
- [x] `usePrayerTimes` hook calls `syncWidgetData()` on every load to keep widget fresh
- [ ] Wire `@bacons/apple-targets` config plugin into app.json for iOS build
- [ ] Register Android widget task handler in index.ts for Android build
- Note: Both platforms require EAS Build. Add `EAS_NO_VCS=1` if building locally.

---

## Phase 7 — Qibla Compass
**Status: Complete ✓**

- [x] `useQibla` hook: magnetometer heading + adhan.js Qibla bearing + low-pass smoothing filter
- [x] Haversine formula for distance to Mecca in km
- [x] QiblaScreen: compass ring, rotating gold arrow, cardinal directions, Kaaba icon, distance card
- [x] Added as third tab in navigation (compass emoji)

---

## Phase 8 — Polish & Distribution
**Status: Not Started**

- [ ] Respect phone's time format — use 12h or 24h based on the device's system setting (use `Intl.DateTimeFormat` with `hour12: undefined` so it auto-detects from locale)
- [ ] App icon + splash screen
- [ ] TestFlight beta for iOS friends
- [ ] Google Play internal testing for Android
- [ ] Landing page / download link for email list (future)

---

## Priority Order

| Priority | Phase |
|---|---|
| Must ship | 1 — Project Setup |
| Must ship | 2 — Prayer Times Engine |
| Must ship | 3 — Push Notifications |
| Must ship | 4 — Adhan Audio & Reciter Selection |
| Must ship | 5 — Silent Mode Bypass |
| Must ship | 6 — Home Screen Widget |
| Nice to have | 7 — Qibla Compass |
| After core | 8 — Polish & Distribution |
