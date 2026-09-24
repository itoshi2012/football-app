# Village FC — Community App

A premium, dark-glass football community app built with Expo (React Native) and Firebase.
Two experiences in one codebase: the normal **User App** (Home gallery, Chat, Settings) and
the **Admin Panel** (Dashboard, Manage Players, Add/Edit Player, Chat moderation) — routed
automatically based on which Google account signs in.

---

## 1. Install

```bash
npm install
npx expo install expo-image-picker expo-image-manipulator expo-blur expo-linear-gradient
```

(the `expo install` line makes sure native module versions match your Expo SDK exactly)

---

## 2. One-time Firebase Console setup

You've already created the project, enabled **Authentication → Google**, and created the
**Firestore Database**. Two more manual steps are required before the app will work:

### a) Create the Admin config document (do this by hand, once)

Because of how the security rules work, this **one document must be created manually** —
after it exists, only the Admin can ever change it again.

1. Firebase Console → Firestore Database → Data tab
2. **Start collection** → Collection ID: `config`
3. Document ID: `adminConfig`
4. Add field: `adminEmail` (type: string) → value: `mdimam12120909@gmail.com`
5. Save

### b) Publish the security rules

1. Firebase Console → Firestore Database → **Rules** tab
2. Replace the contents with everything in `firestore.rules` (included in this project)
3. Publish

These rules are what actually enforce permissions — not the app's UI. A normal user's
Firestore requests to edit a player or delete someone else's message will be rejected by
Firebase itself, even if they tried to bypass the app.

---

## 3. Google Sign-In client IDs

Expo's Google auth needs OAuth client IDs (different from the Firebase `apiKey`).

1. Firebase Console → Project Settings → Your apps → make sure Google Sign-In is enabled
   under **Authentication → Sign-in method**
2. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
   for the same project (`ourxi-74df7`)
3. You'll need an **Android** OAuth client and an **iOS** OAuth client (and a **Web** client,
   which Firebase already created for you — reuse it for `expoClientId` during development
   with Expo Go)
4. Open `src/context/AuthContext.js` and replace the four placeholder values:

```js
expoClientId: "YOUR_EXPO_CLIENT_ID...",
iosClientId: "YOUR_IOS_CLIENT_ID...",
androidClientId: "YOUR_ANDROID_CLIENT_ID...",
webClientId: "YOUR_WEB_CLIENT_ID...",
```

Full walkthrough: https://docs.expo.dev/guides/google-authentication/

---

## 4. Run it

```bash
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS) to try it on your phone.

---

## How admin detection works (secure by design)

- The Admin's email lives in exactly **one place**: the `config/adminConfig` Firestore
  document — never hard-coded anywhere else in the app.
- After Google sign-in, the app reads that document and compares it to the signed-in
  email. If it matches → Admin Panel. Otherwise → normal User App.
- This is UI-level routing only, for convenience. The real enforcement is in
  `firestore.rules`: every write to `players` or every message delete is checked
  server-side against the same `config/adminConfig` document, so a normal user cannot
  edit player data or moderate chat no matter what the app shows them.
- To change who the Admin is, edit the `adminEmail` field on that one document (as the
  current Admin, from the Firestore console, or you can later build a settings screen
  for it) — nothing else in the codebase needs to change.

## Why photos are stored as base64, not Firebase Storage

Firebase Storage now requires the paid **Blaze** (pay-as-you-go) plan even within the free
quota, which needs a billing card on file. Since you asked to keep everything free, player
photos are compressed client-side (`src/utils/pickPlayerPhoto.js`) and saved as a small
base64 string directly on the player's Firestore document instead. If you're ever comfortable
adding a card later, this is the one file to change to switch to Storage uploads — the rest
of the app (player cards, profile, real-time listeners) doesn't need to change.

## Project structure

```
App.js                        entry point
firebaseConfig.js              Firebase init (your project's config)
firestore.rules                security rules — publish these in the console
src/
  theme/theme.js                colors, gradients, typography tokens
  context/AuthContext.js        Google sign-in, admin detection, nickname flow
  components/                   GlassCard, PlayerCard, RatingBar, ExpandingSearchBar, ...
  utils/pickPlayerPhoto.js       image picker + compression → base64
  navigation/
    RootNavigator.js             SignIn → Nickname → Admin/User routing
    UserStack.js / UserTabs.js   Home, Chat, Settings + Player Profile
    AdminStack.js                Dashboard, Manage Players, Add/Edit, Chat
  screens/
    SignInScreen.js, NicknameScreen.js
    HomeScreen.js, PlayerProfileScreen.js, ChatScreen.js, SettingsScreen.js
    admin/AdminDashboardScreen.js, ManagePlayersScreen.js, AddEditPlayerScreen.js
```
