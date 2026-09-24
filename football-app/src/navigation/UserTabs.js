import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { colors } from "../theme/theme";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: "home",
  Chat: "chatbubbles",
  Settings: "settings",
};

export default function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
            <Ionicons name={focused ? ICONS[route.name] : `${ICONS[route.name]}-outline`} size={20} color={color} />
          </View>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ title: "Chatting" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    backgroundColor: "transparent",
    height: 84,
    paddingTop: 8,
  },
  iconWrap: {
    width: 34,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  iconWrapActive: {
    backgroundColor: "rgba(57,226,157,0.14)",
  },
});
