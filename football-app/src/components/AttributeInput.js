import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { colors, ratingGradient } from "../theme/theme";

export default function AttributeInput({ label, value, onChange }) {
  const trackColor = ratingGradient(value)[0];

  function handleTextChange(t) {
    const n = parseInt(t.replace(/[^0-9]/g, ""), 10);
    if (Number.isNaN(n)) {
      onChange(0);
    } else {
      onChange(Math.max(0, Math.min(99, n)));
    }
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          value={String(value)}
          onChangeText={handleTextChange}
          keyboardType="number-pad"
          maxLength={2}
          style={styles.numberInput}
        />
      </View>
      <Slider
        minimumValue={0}
        maximumValue={99}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={trackColor}
        maximumTrackTintColor="rgba(255,255,255,0.1)"
        thumbTintColor={trackColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  label: { color: colors.textSecondary, fontWeight: "700", fontSize: 12.5, letterSpacing: 0.4, textTransform: "uppercase" },
  numberInput: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 15,
    width: 40,
    textAlign: "right",
  },
});
