import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserTabs from "./UserTabs";
import PlayerProfileScreen from "../screens/PlayerProfileScreen";
import { colors } from "../theme/theme";

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="UserTabs" component={UserTabs} />
      <Stack.Screen
        name="PlayerProfile"
        component={PlayerProfileScreen}
        options={{ animation: "slide_from_right", presentation: "card" }}
      />
    </Stack.Navigator>
  );
}
