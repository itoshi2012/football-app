import React from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PressableScale from "./PressableScale";
import { colors, gradients, radius } from "../theme/theme";

export default function PrimaryButton({ title, onPress, loading, disabled, style, variant = "solid" }) {
  const isGhost = variant === "ghost";

  return (
    <PressableScale onPress={disabled || loading ? undefined : onPress} style={[styles.wrap, style]}>
      {isGhost ? (
        <View style={styles.ghostButton}>
          {loading ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <Text style={styles.ghostText}>{title}</Text>
          )}
        </View>
      ) : (
        <LinearGradient
          colors={disabled ? ["#2A3038", "#20242B"] : gradients.accentButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color="#06130D" />
          ) : (
            <Text style={[styles.text, disabled && { color: colors.textMuted }]}>{title}</Text>
          )}
        </LinearGradient>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.pill,
  },
  button: {
    paddingVertical: 15,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#06130D",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  ghostButton: {
    paddingVertical: 15,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  ghostText: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
});
