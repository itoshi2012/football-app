import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import PlayerCard from "../components/PlayerCard";
import ExpandingSearchBar from "../components/ExpandingSearchBar";
import { colors, gradients } from "../theme/theme";
import { db } from "../../firebaseConfig";

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [players, setPlayers] = useState(null);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "players"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPlayers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setRefreshing(false);
      },
      (err) => {
        console.warn("players listener error", err);
        setPlayers([]);
        setRefreshing(false);
      }
    );
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    if (!players) return [];
    if (!search.trim()) return players;
    const q = search.trim().toLowerCase();
    return players.filter((p) => (p.name || "").toLowerCase().includes(q));
  }, [players, search]);

  const numColumns = width > 700 ? 4 : width > 460 ? 3 : 2;
  const gap = 12;
  const cardWidth = (width - 20 * 2 - gap * (numColumns - 1)) / numColumns;

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        {!searchOpen && (
          <View style={{ flex: 1 }}>
            <Text style={styles.brandSmall}>VILLAGE</Text>
            <Text style={styles.brandBig}>Football Club</Text>
          </View>
        )}
        <ExpandingSearchBar value={search} onChangeText={setSearch} onOpenChange={setSearchOpen} />
      </View>

      {players === null ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            {search ? "No players match that search." : "No players yet.\nCheck back soon."}
          </Text>
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={{ gap }}
          contentContainerStyle={{ padding: 20, gap, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
              tintColor={colors.accent}
            />
          }
          renderItem={({ item, index }) => (
            <PlayerCard
              player={item}
              index={index}
              width={cardWidth}
              onPress={() => navigation.navigate("PlayerProfile", { playerId: item.id })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  brandSmall: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 3,
  },
  brandBig: {
    color: colors.textPrimary,
    fontSize: 23,
    fontWeight: "800",
    marginTop: 2,
    letterSpacing: -0.4,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 14.5,
    lineHeight: 21,
  },
});
