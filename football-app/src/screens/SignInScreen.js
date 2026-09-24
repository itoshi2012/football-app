import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeIn, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { colors, gradients } from "../theme/theme";

export default function SignInScreen() {
  const { signInWithGoogle, googleRequestReady } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <View style={styles.glow} />

      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <Animated.View entering={ZoomIn.duration(600).springify()} style={styles.badge}>
          <LinearGradient colors={gradients.accentButton} style={styles.badgeInner}>
            <Ionicons name="football" size={34} color="#06130D" />
          </LinearGradient>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(150).duration(500)} style={styles.title}>
          Village FC
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(250).duration(500)} style={styles.subtitle}>
          Our community's home for every player, every match{"\n"}talk, and every rating that matters.
        </Animated.Text>

        <View style={{ flex: 1 }} />

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ width: "100%" }}>
          <PrimaryButton
            title={googleRequestReady ? "Continue with Google" : "Loading..."}
            onPress={signInWithGoogle}
            disabled={!googleRequestReady}
          />
          <Animated.Text entering={FadeIn.delay(600)} style={styles.terms}>
            By continuing you agree to keep the community chat respectful.
          </Animated.Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  glow: {
    position: "absolute",
    top: -120,
    alignSelf: "center",
    width: 340,
    height: 340,
    borderRadius: 200,
    backgroundColor: colors.accent,
    opacity: 0.14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
    alignItems: "center",
  },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 26,
    overflow: "hidden",
    marginBottom: 26,
  },
  badgeInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 21,
  },
  terms: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
  },
});
