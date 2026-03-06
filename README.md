# ShelterConnect

A React Native app that matches pet owners with shelter animals through a questionnaire-driven algorithm, with an Instagram-style adoption feed and shelter management tools.

## Prerequisites

- Node.js 18+
- Expo Go app (for quick preview) or Xcode/Android Studio (for full native build)

## Setup

```bash
cd ShelterConnect
npm install
```

If you see `Cannot find module` errors on first run, install the missing peer deps:

```bash
npm install babel-preset-expo expo-linking expo-constants expo-asset expo-font \
  expo-web-browser react-dom react-native-web @expo/metro-runtime @expo/log-box \
  @react-navigation/native @react-navigation/native-stack @react-navigation/drawer \
  react-native-worklets --legacy-peer-deps
```

## Run

```bash
# Start Metro bundler (scan QR with Expo Go)
npm start

# iOS simulator (requires Xcode)
npm run ios

# Android emulator (requires Android Studio)
npm run android
```

## Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure your project (first time only)
eas build:configure

# Development build (needed for native modules like expo-av, expo-image-picker)
eas build --profile development --platform ios
eas build --profile development --platform android

# Production build
eas build --profile production --platform all
```

> Note: A development build is required to use expo-av (video playback) and expo-image-picker (camera/media). These modules do not work in Expo Go.

## Test

There is no test suite yet. To manually verify the app end-to-end:

1. **Role selection** — launch the app, confirm two cards appear (owner / shelter)
2. **Owner flow** — tap "I'm looking to adopt", complete all 10 questions, verify progress bar fills and the feed opens with pets sorted by match %
3. **Shelter flow** — restart app, tap "I represent a shelter", complete all 8 questions (including text inputs), verify the profile screen shows entered data
4. **Post creation** — from shelter profile tap "+ Post", pick a photo, fill the form, tap Post, confirm the animal appears at the top of the owner feed
5. **Shelter profile from feed** — in the owner feed tap a shelter name, confirm the profile screen opens with that shelter's info

---

## Architecture

```
ShelterConnect/
├── app/                        # Expo Router screens (file-based routing)
│   ├── _layout.tsx             # Root layout: GestureHandler + StatusBar
│   ├── index.tsx               # Role selection screen
│   ├── owner/
│   │   ├── questionnaire.tsx   # 10-question owner onboarding flow
│   │   └── feed.tsx            # Matched pets feed (FlashList)
│   └── shelter/
│       ├── questionnaire.tsx   # 8-question shelter onboarding flow
│       ├── profile.tsx         # Shelter public profile + animal grid
│       └── post.tsx            # Create a new pet post
└── src/
    ├── components/
    │   ├── ProgressBar.tsx     # Goal-gradient animated bar (Reanimated + LinearGradient)
    │   ├── EmojiButton.tsx     # Large tappable emoji answer button with spring animation
    │   ├── PetCard.tsx         # Full-screen feed card (photo, overlay, match badge)
    │   └── VideoPlayer.tsx     # expo-av muted looping video for feed cards
    ├── data/
    │   ├── ownerQuestions.ts   # Question definitions for the owner questionnaire
    │   ├── shelterQuestions.ts # Question definitions for the shelter questionnaire
    │   └── mockPets.ts         # 15 mock pets + 3 mock shelters with Unsplash photos
    ├── lib/
    │   └── matching.ts         # Scoring algorithm: maps owner answers → pet scores
    └── store/
        ├── userStore.ts        # Zustand: role, owner answers, shelter profile
        └── feedStore.ts        # Zustand: feed items (mock pets + shelter posts)
```

### Data flow

```
Role selection
    │
    ├─▶ Owner path
    │       │
    │       ▶ questionnaire.tsx
    │           Collects answers → userStore.ownerAnswers
    │           On finish: matchPets(MOCK_PETS, answers) → scored + sorted list
    │                       → feedStore.feedItems → owner/feed.tsx
    │
    └─▶ Shelter path
            │
            ▶ shelter/questionnaire.tsx
                Collects answers → userStore.shelterProfile
                On finish → shelter/profile.tsx
                            "Post" button → shelter/post.tsx
                                           feedStore.addPost() → appears in owner feed
```

### Matching algorithm

Each pet is scored 0–100 against the owner's answers:

| Criterion | Points |
|---|---|
| Pet type match (or "either") | 25 |
| Energy level matches activity | 20 |
| Size match (or "no preference") | 15 |
| Kid-friendly when owner has kids | 15 |
| Pet-friendly when owner has other pets | 10 |
| Age preference match (or "no preference") | 10 |
| Shedding / hypoallergenic tolerance | 5 |

Pets are sorted descending by score before the feed renders. The match % badge on each card shows this score.

### Key libraries

| Library | Purpose |
|---|---|
| `expo-router` | File-based navigation |
| `zustand` | Lightweight global state |
| `@shopify/flash-list` | Performant paging feed |
| `react-native-reanimated` | Spring animations (progress bar, emoji buttons) |
| `expo-linear-gradient` | Purple→pink→orange gradient on progress bar |
| `expo-av` | Muted looping video playback in feed |
| `expo-image-picker` | Camera/library access for shelter posts |
