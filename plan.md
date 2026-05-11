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
**Status: Not Started**

- **iOS**: Apply for Apple's **Critical Alerts** entitlement — this is the only official way to break through silent mode without a focus mode. It requires a reason submission to Apple but is granted for religious/medical use cases.
- **Android**: Set notification channel importance to `IMPORTANCE_HIGH` with a full-screen intent — Android is much more permissive here and this works out of the box.

- [ ] Configure Critical Alerts entitlement for iOS
- [ ] Configure high-importance notification channel for Android

---

## Phase 6 — Home Screen Widget
**Status: Not Started**

- [ ] Use `react-native-widget-extension` to build a WidgetKit extension showing all 5 prayer times (iOS)
- [ ] Use `react-native-android-widget` for the equivalent (Android)
- Note: This phase is the most platform-specific and will take the most time

---

## Phase 7 — Qibla Compass *(stretch goal, do last)*
**Status: Not Started**

- [ ] Use `expo-sensors` (magnetometer) to point toward the Kaaba
- [ ] Simple compass UI, only built if time allows

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
