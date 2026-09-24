import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import PressableScale from "./PressableScale";
import InitialsAvatar from "./InitialsAvatar";
import { colors, radius, ratingGradient } from "../theme/theme";

export default function PlayerCard({ player, index = 0, onPress, width }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 45).duration(420).springify()} style={{ width }}>
      <PressableScale onPress={onPress} scaleTo={0.95} style={styles.card}>
        <View style={styles.photoWrap}>
          {player.photoBase64 ? (
            <Image source={{ uri: player.photoBase64 }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoFallback]}>
              <InitialsAvatar name={player.name} size={56} />
            </View>
          )}
          <LinearGradient
            colors={["transparent", "rgba(10,14,20,0.9)"]}
            style={styles.photoShade}
          />
          <LinearGradient
            colors={ratingGradient(player.overallRating)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ratingBadge}
          >
            <Text style={styles.ratingBadgeText}>{player.overallRating}</Text>
          </LinearGradient>
        </View>
        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.name}>
            {player.name}
          </Text>
          <Text style={styles.position}>{player.position}</Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: "hidden",
  },
  photoWrap: {
    aspectRatio: 0.85,
    backgroundColor: colors.bgElevated,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  photoShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    minWidth: 30,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingBadgeText: {
    color: "#06130D",
    fontWeight: "800",
    fontSize: 12,
  },
  info: {
    padding: 10,
    paddingTop: 8,
  },
  name: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 13.5,
  },
  position: {
    color: colors.textSecondary,
    fontSize: 11.5,
    marginTop: 2,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
