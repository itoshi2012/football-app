import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { collection, onSnapshot, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import GlassCard from "../../components/GlassCard";
import PressableScale from "../../components/PressableScale";
import InitialsAvatar from "../../components/InitialsAvatar";
import ExpandingSearchBar from "../../components/ExpandingSearchBar";
import { colors, gradients, ratingGradient } from "../../theme/theme";
import { db } from "../../../firebaseConfig";

export default function ManagePlayersScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [players, setPlayers] = useState(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "players"), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (snap) => setPlayers(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    if (!players) return [];
    if (!search.trim()) return players;
    const q = search.trim().toLowerCase();
    return players.filter((p) => (p.name || "").toLowerCase().includes(q));
  }, [players, search]);

  function confirmDelete(player) {
    Alert.alert("Delete this player?", `${player.name} will be removed for everyone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteDoc(doc(db, "players", player.id)),
      },
    ]);
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        {!searchOpen && <Text style={styles.title}>Manage Players</Text>}
        <ExpandingSearchBar value={search} onChangeText={setSearch} onOpenChange={setSearchOpen} />
      </View>

      {players === null ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: 20, gap: 10, paddingBottom: 100 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No players found.</Text>}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 30).duration(300)}>
              <GlassCard style={styles.row}>
                <View style={styles.rowInner}>
                  {item.photoBase64 ? (
                    <Image source={{ uri: item.photoBase64 }} style={styles.thumb} />
                  ) : (
                    <InitialsAvatar name={item.name} size={48} />
                  )}
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.meta}>{item.position}</Text>
                  </View>
                  <LinearGradient colors={ratingGradient(item.overallRating)} style={styles.ovr}>
                    <Text style={styles.ovrText}>{item.overallRating}</Text>
                  </LinearGradient>
                  <PressableScale
                    onPress={() => navigation.navigate("AddEditPlayer", { playerId: item.id })}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="create-outline" size={19} color={colors.textSecondary} />
                  </PressableScale>
                  <PressableScale onPress={() => confirmDelete(item)} style={styles.iconBtn}>
                    <Ionicons name="trash-outline" size={19} color={colors.danger} />
                  </PressableScale>
                </View>
              </GlassCard>
            </Animated.View>
          )}
        />
      )}

      <PressableScale
        onPress={() => navigation.navigate("AddEditPlayer")}
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
      >
        <LinearGradient colors={gradients.accentButton} style={styles.fabInner}>
          <Ionicons name="add" size={28} color="#06130D" />
        </LinearGradient>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 14, gap: 12 },
  title: { flex: 1, color: colors.textPrimary, fontSize: 22, fontWeight: "800" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: colors.textMuted, textAlign: "center", marginTop: 40 },
  row: { padding: 12 },
  rowInner: { flexDirection: "row", alignItems: "center" },
  thumb: { width: 48, height: 48, borderRadius: 24 },
  name: { color: colors.textPrimary, fontWeight: "700", fontSize: 14.5 },
  meta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  ovr: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, marginRight: 6 },
  ovrText: { color: "#06130D", fontWeight: "800", fontSize: 12.5 },
  iconBtn: { padding: 6 },
  fab: { position: "absolute", right: 20, borderRadius: 30 },
  fabInner: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center" },
});
