// Design tokens for the Village FC app.
// A deep pitch-night palette with an emerald "under the stadium lights" accent,
// used consistently across the user app and the admin panel.

export const colors = {
  bg: "#0A0E14",
  bgElevated: "#101623",
  card: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.10)",
  glass: "rgba(20,26,38,0.55)",
  textPrimary: "#F4F7F5",
  textSecondary: "#93A0AD",
  textMuted: "#5C6874",
  accent: "#39E29D", // pitch-light emerald
  accentDeep: "#12B886",
  accent2: "#5B8CFF", // floodlight blue, secondary accent
  gold: "#F2B84B",
  danger: "#FF5C71",
  success: "#39E29D",
  overlay: "rgba(6,9,14,0.72)",
};

export const gradients = {
  hero: ["#0A0E14", "#101B18", "#0A0E14"],
  accentButton: ["#39E29D", "#12B886"],
  card: ["rgba(255,255,255,0.09)", "rgba(255,255,255,0.02)"],
  ratingHigh: ["#39E29D", "#12B886"],
  ratingMid: ["#F2B84B", "#D98E1E"],
  ratingLow: ["#FF5C71", "#C23B4D"],
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const spacing = (n) => n * 4;

export const typography = {
  display: { fontSize: 30, fontWeight: "800", letterSpacing: -0.5 },
  h1: { fontSize: 24, fontWeight: "700", letterSpacing: -0.3 },
  h2: { fontSize: 19, fontWeight: "700" },
  body: { fontSize: 15, fontWeight: "400" },
  label: { fontSize: 12, fontWeight: "600", letterSpacing: 0.4 },
  caption: { fontSize: 12, fontWeight: "400" },
};

export function ratingGradient(value) {
  if (value >= 80) return gradients.ratingHigh;
  if (value >= 60) return gradients.ratingMid;
  return gradients.ratingLow;
}

export function initialsOf(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const AVATAR_COLORS = ["#39E29D", "#5B8CFF", "#F2B84B", "#FF5C71", "#B98BFF", "#4AD9E0"];
export function avatarColorFor(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
