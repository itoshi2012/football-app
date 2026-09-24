import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { doc, onSnapshot } from "firebase/firestore";
import RatingBar from "../components/RatingBar";
import GlassCard from "../components/GlassCard";
import InitialsAvatar from "../components/InitialsAvatar";
import { colors, gradients, ratingGradient } from "../theme/theme";
import { db } from "../../firebaseConfig";

const ATTRS = [
  { key: "pacing", label: "Pacing" },
  { key: "shooting", label: "Shooting" },
  { key: "passing", label: "Passing" },
  { key: "physical", label: "Physical" },
  { key: "defending", label: "Defending" },
];

export default function PlayerProfileScreen({ route, navigation }) {
  const { playerId } = route.params;
  const insets = useSafeAreaInsets();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "players", playerId), (snap) => {
      setPlayer(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    });
    return unsub;
  }, [playerId]);

  if (!player) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.heroWrap}>
        {player.photoBase64 ? (
          <Image source={{ uri: player.photoBase64 }} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroImage, styles.heroFallback]}>
            <InitialsAvatar name={player.name} size={96} />
          </View>
        )}
        <LinearGradient colors={["transparent", colors.bg]} style={styles.heroShade} />
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { top: insets.top + 10 }]}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
      </View>

      <Animated.View entering={FadeInDown.duration(400)} style={styles.body}>
        <Text style={styles.name}>{player.name}</Text>
        <View style={styles.metaRow}>
          <View style={styles.posChip}>
            <Text style={styles.posChipText}>{player.position}</Text>
          </View>
          <LinearGradient
            colors={ratingGradient(player.overallRating)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ovrChip}
          >
            <Text style={styles.ovrValue}>{player.overallRating}</Text>
            <Text style={styles.ovrLabel}>OVR</Text>
          </LinearGradient>
        </View>

        <Animated.View entering={FadeIn.delay(200).duration(400)}>
          <GlassCard style={{ marginTop: 26 }}>
            <View style={styles.attrsInner}>
              {ATTRS.map((a, i) => (
                <RatingBar
                  key={a.key}
                  label={a.label}
                  value={player[a.key] ?? 0}
                  delay={200 + i * 90}
                />
              ))}
            </View>
          </GlassCard>
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: "center", justifyContent: "center" },
  heroWrap: { width: "100%", height: 420, backgroundColor: colors.bgElevated },
  heroImage: { width: "100%", height: "100%" },
  heroFallback: { alignItems: "center", justifyContent: "center" },
  heroShade: { position: "absolute", left: 0, right: 0, bottom: 0, height: "45%" },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { paddingHorizontal: 22, marginTop: -30 },
  name: { color: colors.textPrimary, fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 10 },
  posChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  posChipText: { color: colors.textSecondary, fontWeight: "700", fontSize: 13 },
  ovrChip: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  ovrValue: { color: "#06130D", fontWeight: "800", fontSize: 15 },
  ovrLabel: { color: "#06130D", fontWeight: "700", fontSize: 10 },
  attrsInner: { padding: 20 },
});
