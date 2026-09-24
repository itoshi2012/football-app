import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { initialsOf, avatarColorFor } from "../theme/theme";

export default function InitialsAvatar({ name, size = 40 }) {
  const bg = avatarColorFor(name || "?");
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg + "33", borderColor: bg },
      ]}
    >
      <Text style={[styles.text, { color: bg, fontSize: size * 0.38 }]}>{initialsOf(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  text: {
    fontWeight: "700",
  },
});
