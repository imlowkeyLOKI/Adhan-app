# Agent Onboarding — Adhan App

## First Step: Read the Source of Truth

Before doing anything else, read [SourceOfTruth.md](SourceOfTruth.md). It is a transcript of the founding conversation between Karim and Hazim on May 10, 2026. That transcript is the canonical product spec for this project. All requirements originate there.

## What This Project Is

An iOS app (iPhone only, for now) called the **Adhan App** — a Muslim prayer time app with zero ads. The name "Adhan" (also spelled Aden/ADAN in the transcript) refers to the Islamic call to prayer.

## Core Requirements (derived from SourceOfTruth.md)

1. **Prayer times** — Display all five daily prayer times. The user must be able to select which calculation method / time zone / madhab they follow.
2. **Push notifications** — Two notifications per prayer:
   - 15 minutes before prayer time (reminder)
   - At the exact prayer time, playing the Adhan (call to prayer) as the notification sound
3. **Reciter selection** — The user can choose which reciter's Adhan audio is used for the notification.
4. **Silent mode bypass** — The Adhan notification should play even when the phone is on silent, without requiring the user to enable any Focus mode (DND, Work, Sleep, etc.). Implement this to the extent iOS allows.
5. **Home screen widget** — A widget showing all five prayer times for the current day.
6. **Qibla compass** (stretch goal, not required) — Use the phone's gyroscope to point toward the Kaaba (the direction Muslims pray). Nice to have, not a blocker.

## Who the User Is

- **Karim** — the developer/owner. Self-described beginner programmer with first-year college level experience. AI should be the leading technical voice and make architectural decisions.
- **Target audience** — Muslims and anyone who wants a call-to-prayer app without ads. iOS and Android.
- **Distribution plan** — Personal use first, then shared with friends, then potentially a wider launch via a YouTube download link / email list.

## Timeline

2–4 weeks from May 10, 2026.

## Plan of Action

The full phased implementation plan is in [plan.md](plan.md). Always check it to understand what phase the project is in, what's done, and what's next. Update the status and checkboxes in plan.md as work progresses.

## How to Work on This Project

- The user is a beginner. Explain decisions clearly and keep instructions actionable.
- AI should lead technical decisions — don't wait for the user to specify implementation details.
- Platform: **iOS and Android**. Use a cross-platform framework (React Native or Flutter recommended) so both platforms are covered from a single codebase.
- No ads, ever. Keep the app clean.
- Every new agent session should re-read [SourceOfTruth.md](SourceOfTruth.md) to restore context, since chat history does not persist across sessions.
