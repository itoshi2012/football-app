import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GlassCard from "../components/GlassCard";
import InitialsAvatar from "../components/InitialsAvatar";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { colors, gradients } from "../theme/theme";

export default function SettingsScreen() {
  const { user, profile, isAdmin, signOut, saveNickname } = useAuth();
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(profile?.nickname || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      Alert.alert("Almost there", "Nicknames should be 2–20 characters.");
      return;
    }
    setSaving(true);
    try {
      await saveNickname(trimmed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20 }}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.body}>
        <GlassCard style={styles.card}>
          <View style={styles.accountRow}>
            <InitialsAvatar name={profile?.nickname || profile?.name || "?"} size={54} />
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={styles.name}>{profile?.nickname || profile?.name || "Player"}</Text>
              <Text style={styles.email}>{user?.email}</Text>
              {isAdmin && <Text style={styles.adminTag}>Admin</Text>}
            </View>
          </View>
        </GlassCard>

        {!isAdmin && (
          <GlassCard style={[styles.card, { marginTop: 14 }]}>
            <View style={{ padding: 16 }}>
              <Text style={styles.sectionLabel}>NICKNAME</Text>
              {editing ? (
                <>
                  <TextInput
                    value={nickname}
                    onChangeText={setNickname}
                    style={styles.input}
                    maxLength={20}
                    autoFocus
                  />
                  <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                    <PrimaryButton title="Save" onPress={handleSave} loading={saving} style={{ flex: 1 }} />
                    <PrimaryButton
                      title="Cancel"
                      variant="ghost"
                      onPress={() => {
                        setNickname(profile?.nickname || "");
                        setEditing(false);
                      }}
                      style={{ flex: 1 }}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.rowBetween}>
                  <Text style={styles.value}>{profile?.nickname}</Text>
                  <Text style={styles.editLink} onPress={() => setEditing(true)}>
                    Edit
                  </Text>
                </View>
              )}
            </View>
          </GlassCard>
        )}

        <View style={{ flex: 1 }} />

        <PrimaryButton title="Sign Out" variant="ghost" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: "800" },
  body: { flex: 1, padding: 20 },
  card: { padding: 16 },
  accountRow: { flexDirection: "row", alignItems: "center" },
  name: { color: colors.textPrimary, fontSize: 17, fontWeight: "700" },
  email: { color: colors.textSecondary, fontSize: 12.5, marginTop: 3 },
  adminTag: { color: colors.gold, fontSize: 11.5, fontWeight: "800", marginTop: 4, letterSpacing: 0.5 },
  sectionLabel: { color: colors.textMuted, fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  value: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  editLink: { color: colors.accent, fontWeight: "700", fontSize: 13.5 },
  input: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 15,
  },
});
