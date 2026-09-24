import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors, ratingGradient } from "../theme/theme";

export default function RatingBar({ label, value, delay = 0 }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(Math.max(0, Math.min(value, 99)) / 99, {
        duration: 900,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [value]);

  const style = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fillWrap, style]}>
          <LinearGradient
            colors={ratingGradient(value)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  label: {
    width: 92,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginHorizontal: 10,
  },
  fillWrap: {
    height: "100%",
    borderRadius: 999,
    overflow: "hidden",
  },
  value: {
    width: 28,
    textAlign: "right",
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 14,
  },
});
