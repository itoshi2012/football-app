import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  limit,
  serverTimestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import InitialsAvatar from "../components/InitialsAvatar";
import { useAuth } from "../context/AuthContext";
import { colors, gradients, radius } from "../theme/theme";
import { db } from "../../firebaseConfig";

function timeAgo(ts) {
  if (!ts?.toDate) return "";
  const diff = (Date.now() - ts.toDate().getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function ChatScreen() {
  const { user, profile, isAdmin } = useAuth();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(100));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  async function send() {
    const trimmed = text.trim();
    if (!trimmed || !user) return;
    setText("");
    try {
      await addDoc(collection(db, "messages"), {
        userId: user.uid,
        userName: isAdmin ? "Admin" : profile?.nickname || "Player",
        text: trimmed,
        createdAt: serverTimestamp(),
        isAdmin,
      });
    } catch (e) {
      Alert.alert("Message not sent", "Please check your connection.");
    }
  }

  function confirmDelete(messageId) {
    Alert.alert("Delete this message?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteDoc(doc(db, "messages", messageId)),
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Community Chat</Text>
        <Text style={styles.subtitle}>Talk football. Ratings stay with the Admin.</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        inverted
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.duration(260)}>
            <MessageBubble
              message={item}
              mine={item.userId === user?.uid}
              canModerate={isAdmin}
              onDelete={() => confirmDelete(item.id)}
            />
          </Animated.View>
        )}
      />

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Say something..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
        />
        <Pressable onPress={send} disabled={!text.trim()} style={styles.sendBtn}>
          <LinearGradient
            colors={text.trim() ? gradients.accentButton : ["#2A3038", "#20242B"]}
            style={styles.sendBtnInner}
          >
            <Ionicons name="arrow-up" size={20} color={text.trim() ? "#06130D" : colors.textMuted} />
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ message, mine, canModerate, onDelete }) {
  return (
    <Pressable
      onLongPress={canModerate ? onDelete : undefined}
      style={[styles.row, mine && styles.rowMine]}
    >
      {!mine && <InitialsAvatar name={message.userName} size={32} />}
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        {!mine && (
          <Text style={[styles.userName, message.isAdmin && { color: colors.gold }]}>
            {message.userName} {message.isAdmin ? "· Admin" : ""}
          </Text>
        )}
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.time}>{timeAgo(message.createdAt)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: "800" },
  subtitle: { color: colors.textSecondary, fontSize: 12.5, marginTop: 3 },
  row: { flexDirection: "row", alignItems: "flex-end", gap: 8, maxWidth: "84%" },
  rowMine: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  bubble: {
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  bubbleTheirs: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleMine: {
    backgroundColor: "rgba(57,226,157,0.16)",
    borderColor: "rgba(57,226,157,0.35)",
    borderBottomRightRadius: 4,
  },
  userName: { color: colors.accent2, fontWeight: "700", fontSize: 12, marginBottom: 3 },
  messageText: { color: colors.textPrimary, fontSize: 14.5, lineHeight: 20 },
  time: { color: colors.textMuted, fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 14,
    paddingTop: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14.5,
    maxHeight: 110,
  },
  sendBtn: { borderRadius: 20 },
  sendBtnInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
