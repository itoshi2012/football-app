import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import GlassCard from "../../components/GlassCard";
import PressableScale from "../../components/PressableScale";
import { useAuth } from "../../context/AuthContext";
import { colors, gradients } from "../../theme/theme";
import { db } from "../../../firebaseConfig";

export default function AdminDashboardScreen({ navigation }) {
  const { profile } = useAuth();
  const insets = useSafeAreaInsets();
  const [playerCount, setPlayerCount] = useState(null);
  const [recentPlayers, setRecentPlayers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "players"), (snap) => setPlayerCount(snap.size));
    const q = query(collection(db, "players"), orderBy("createdAt", "desc"), limit(4));
    const unsub2 = onSnapshot(q, (snap) => setRecentPlayers(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => {
      unsub();
      unsub2();
    };
  }, []);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <View style={{ paddingTop: insets.top + 14, paddingHorizontal: 20 }}>
        <Text style={styles.eyebrow}>ADMIN</Text>
        <Text style={styles.title}>Hi, {profile?.name?.split(" ")[0] || "Admin"}</Text>
      </View>

      <View style={styles.statsRow}>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statValue}>{playerCount ?? "—"}</Text>
          <Text style={styles.statLabel}>Total Players</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Ionicons name="chatbubbles" size={22} color={colors.accent2} />
          <Text style={styles.statLabelBig}>Community Chat</Text>
        </GlassCard>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <ActionButton
          icon="add-circle"
          label="Add Player"
          onPress={() => navigation.navigate("AddEditPlayer")}
        />
        <ActionButton
          icon="people"
          label="Manage Players"
          onPress={() => navigation.navigate("ManagePlayers")}
        />
        <ActionButton
          icon="chatbubble-ellipses"
          label="Group Chat"
          onPress={() => navigation.navigate("AdminChat")}
        />
      </View>

      <Text style={styles.sectionTitle}>Recently Added</Text>
      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        {recentPlayers.length === 0 && (
          <Text style={styles.emptyText}>No players added yet.</Text>
        )}
        {recentPlayers.map((p) => (
          <PressableScale
            key={p.id}
            onPress={() => navigation.navigate("AddEditPlayer", { playerId: p.id })}
          >
            <GlassCard style={styles.recentCard}>
              <View style={styles.recentRow}>
                <Text style={styles.recentName}>{p.name}</Text>
                <Text style={styles.recentMeta}>
                  {p.position} · OVR {p.overallRating}
                </Text>
              </View>
            </GlassCard>
          </PressableScale>
        ))}
      </View>
    </ScrollView>
  );
}

function ActionButton({ icon, label, onPress }) {
  return (
    <PressableScale onPress={onPress} style={{ flex: 1 }}>
      <GlassCard style={styles.actionCard}>
        <Ionicons name={icon} size={22} color={colors.accent} />
        <Text style={styles.actionLabel}>{label}</Text>
      </GlassCard>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: "800", letterSpacing: 2.5 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: "800", marginTop: 4 },
  statsRow: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginTop: 22 },
  statCard: { flex: 1, padding: 18 },
  statValue: { color: colors.textPrimary, fontSize: 30, fontWeight: "800" },
  statLabel: { color: colors.textSecondary, fontSize: 12.5, marginTop: 4, fontWeight: "600" },
  statLabelBig: { color: colors.textPrimary, fontSize: 14, marginTop: 10, fontWeight: "700" },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 26,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  actionsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20 },
  actionCard: { padding: 16, alignItems: "flex-start", gap: 10, minHeight: 90 },
  actionLabel: { color: colors.textPrimary, fontSize: 12.5, fontWeight: "700" },
  recentCard: { padding: 14 },
  recentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  recentName: { color: colors.textPrimary, fontWeight: "700", fontSize: 14.5 },
  recentMeta: { color: colors.textSecondary, fontSize: 12.5 },
  emptyText: { color: colors.textMuted, fontSize: 13.5 },
});
