import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import GlassCard from "../../components/GlassCard";
import PressableScale from "../../components/PressableScale";
import PrimaryButton from "../../components/PrimaryButton";
import AttributeInput from "../../components/AttributeInput";
import { pickAndCompressPlayerPhoto } from "../../utils/pickPlayerPhoto";
import { colors, gradients, radius } from "../../theme/theme";
import { db } from "../../../firebaseConfig";

const POSITIONS = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"];
const ATTR_KEYS = [
  { key: "pacing", label: "Pacing" },
  { key: "shooting", label: "Shooting" },
  { key: "passing", label: "Passing" },
  { key: "physical", label: "Physical" },
  { key: "defending", label: "Defending" },
];

export default function AddEditPlayerScreen({ route, navigation }) {
  const playerId = route.params?.playerId;
  const isEdit = !!playerId;
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("ST");
  const [attrs, setAttrs] = useState({ pacing: 50, shooting: 50, passing: 50, physical: 50, defending: 50 });
  const [overall, setOverall] = useState("50");

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const snap = await getDoc(doc(db, "players", playerId));
      if (snap.exists()) {
        const d = snap.data();
        setName(d.name || "");
        setPosition(d.position || "ST");
        setPhoto(d.photoBase64 || null);
        setAttrs({
          pacing: d.pacing ?? 50,
          shooting: d.shooting ?? 50,
          passing: d.passing ?? 50,
          physical: d.physical ?? 50,
          defending: d.defending ?? 50,
        });
        setOverall(String(d.overallRating ?? 50));
      }
      setLoading(false);
    })();
  }, [playerId]);

  async function handlePickPhoto() {
    try {
      const uri = await pickAndCompressPlayerPhoto();
      if (uri) setPhoto(uri);
    } catch (e) {
      if (e.message === "PERMISSION_DENIED") {
        Alert.alert("Permission needed", "Allow photo library access to add a player photo.");
      }
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter the player's name.");
      return;
    }
    const ovr = parseInt(overall, 10);
    if (Number.isNaN(ovr) || ovr < 0 || ovr > 99) {
      Alert.alert("Invalid overall rating", "Overall rating must be between 0 and 99.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        position,
        photoBase64: photo || null,
        ...attrs,
        overallRating: ovr,
        updatedAt: serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, "players", playerId), payload);
      } else {
        await addDoc(collection(db, "players"), { ...payload, createdAt: serverTimestamp() });
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert("Couldn't save", "Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.root, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 60 }}>
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <PressableScale onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </PressableScale>
        <Text style={styles.title}>{isEdit ? "Edit Player" : "Add Player"}</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.body}>
        <PressableScale onPress={handlePickPhoto} style={styles.photoPicker}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photoPreview} />
          ) : (
            <View style={[styles.photoPreview, styles.photoEmpty]}>
              <Ionicons name="camera" size={26} color={colors.textMuted} />
              <Text style={styles.photoEmptyText}>Add Photo</Text>
            </View>
          )}
        </PressableScale>

        <GlassCard style={{ marginTop: 20, padding: 18 }}>
          <Text style={styles.fieldLabel}>NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Player name"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={[styles.fieldLabel, { marginTop: 18 }]}>POSITION</Text>
          <View style={styles.chipsRow}>
            {POSITIONS.map((p) => (
              <PressableScale key={p} onPress={() => setPosition(p)}>
                <View style={[styles.chip, position === p && styles.chipActive]}>
                  <Text style={[styles.chipText, position === p && styles.chipTextActive]}>{p}</Text>
                </View>
              </PressableScale>
            ))}
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 14, padding: 18 }}>
          <Text style={styles.fieldLabel}>ATTRIBUTES</Text>
          <View style={{ marginTop: 12 }}>
            {ATTR_KEYS.map((a) => (
              <AttributeInput
                key={a.key}
                label={a.label}
                value={attrs[a.key]}
                onChange={(v) => setAttrs((prev) => ({ ...prev, [a.key]: v }))}
              />
            ))}
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 14, padding: 18 }}>
          <Text style={styles.fieldLabel}>OVERALL RATING</Text>
          <Text style={styles.helperText}>You set this manually — it is never auto-calculated.</Text>
          <TextInput
            value={overall}
            onChangeText={(t) => setOverall(t.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            maxLength={2}
            style={[styles.input, { marginTop: 10, fontSize: 24, fontWeight: "800" }]}
          />
        </GlassCard>

        <PrimaryButton
          title={isEdit ? "Save Changes" : "Save Player"}
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: 24 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: { color: colors.textPrimary, fontSize: 17, fontWeight: "800" },
  body: { paddingHorizontal: 20 },
  photoPicker: { alignSelf: "center", marginTop: 10 },
  photoPreview: { width: 130, height: 130, borderRadius: 65 },
  photoEmpty: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderStyle: "dashed",
  },
  photoEmptyText: { color: colors.textMuted, fontSize: 11.5, marginTop: 6, fontWeight: "600" },
  fieldLabel: { color: colors.textMuted, fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  helperText: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  input: {
    marginTop: 8,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingVertical: 8,
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textSecondary, fontWeight: "700", fontSize: 12.5 },
  chipTextActive: { color: "#06130D" },
});
