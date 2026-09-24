import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import SignInScreen from "../screens/SignInScreen";
import NicknameScreen from "../screens/NicknameScreen";
import AdminStack from "./AdminStack";
import UserStack from "./UserStack";
import { colors } from "../theme/theme";

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    border: "transparent",
  },
};

export default function RootNavigator() {
  const { user, isAdmin, needsNickname, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {!user ? (
        <SignInScreen />
      ) : needsNickname ? (
        <NicknameScreen />
      ) : isAdmin ? (
        <AdminStack />
      ) : (
        <UserStack />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
});
