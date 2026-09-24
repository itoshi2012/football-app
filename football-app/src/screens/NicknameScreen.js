import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { colors, gradients, radius } from "../theme/theme";

export default function NicknameScreen() {
  const { saveNickname } = useAuth();
  const insets = useSafeAreaInsets();
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      Alert.alert("Almost there", "Nicknames should be 2–20 characters.");
      return;
    }
    setSaving(true);
    try {
      await saveNickname(trimmed);
    } catch (e) {
      Alert.alert("Couldn't save", "Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.root}>
        <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
        <View style={[styles.content, { paddingTop: insets.top + 80 }]}>
          <Animated.Text entering={FadeInDown.duration(450)} style={styles.title}>
            Welcome to the pitch
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(100).duration(450)} style={styles.subtitle}>
            What should the community call you?{"\n"}This is the name you'll chat with.
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(220).duration(450)} style={{ width: "100%", marginTop: 32 }}>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              placeholder="Your nickname"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              autoFocus
              maxLength={20}
            />
          </Animated.View>

          <View style={{ flex: 1 }} />

          <Animated.View entering={FadeInDown.delay(320).duration(450)} style={{ width: "100%" }}>
            <PrimaryButton title="Continue" onPress={handleContinue} loading={saving} />
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: 28, paddingBottom: 40 },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14.5,
    marginTop: 10,
    lineHeight: 20,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});
