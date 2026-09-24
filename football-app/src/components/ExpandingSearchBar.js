import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../theme/theme";

// Collapsed: just a search icon top-right.
// Tapped: bar expands open from the top, autofocuses, filters in real time.
// Back arrow / close collapses it smoothly again.
export default function ExpandingSearchBar({
  value,
  onChangeText,
  placeholder = "Search players...",
  onOpenChange,
}) {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);
  const inputRef = useRef(null);

  function setOpenAndNotify(next) {
    setOpen(next);
    onOpenChange?.(next);
  }

  useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, { duration: 320, easing: Easing.out(Easing.cubic) });
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  const barStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -14 }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ scale: 1 - progress.value * 0.3 }],
  }));

  function close() {
    onChangeText("");
    setOpenAndNotify(false);
  }

  if (!open) {
    return (
      <Animated.View style={iconStyle}>
        <Pressable onPress={() => setOpenAndNotify(true)} hitSlop={10} style={styles.iconButton}>
          <Ionicons name="search" size={20} color={colors.textPrimary} />
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.expanded, barStyle]}>
      <Pressable onPress={close} hitSlop={10} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
      </Pressable>
      <Ionicons name="search" size={17} color={colors.textSecondary} style={{ marginRight: 6 }} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  expanded: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    height: 46,
  },
  backButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
  },
});
