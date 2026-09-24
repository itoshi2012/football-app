import React from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius, gradients } from "../theme/theme";

export default function GlassCard({ children, style, radiusSize = radius.lg, intensity = 40 }) {
  return (
    <View style={[styles.wrap, { borderRadius: radiusSize }, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={gradients.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.border, { borderRadius: radiusSize }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: colors.glass,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  content: {
    position: "relative",
  },
});
