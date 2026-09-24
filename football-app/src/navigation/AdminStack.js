import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import ManagePlayersScreen from "../screens/admin/ManagePlayersScreen";
import AddEditPlayerScreen from "../screens/admin/AddEditPlayerScreen";
import ChatScreen from "../screens/ChatScreen";
import { colors } from "../theme/theme";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="ManagePlayers" component={ManagePlayersScreen} options={{ animation: "slide_from_right" }} />
      <Stack.Screen
        name="AddEditPlayer"
        component={AddEditPlayerScreen}
        options={{ animation: "slide_from_bottom", presentation: "modal" }}
      />
      <Stack.Screen name="AdminChat" component={ChatScreen} options={{ animation: "slide_from_right" }} />
    </Stack.Navigator>
  );
}
