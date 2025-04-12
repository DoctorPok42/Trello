import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            backgroundColor: "#015A8E",
          },
          default: {
            backgroundColor: "#015A8E",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Workspaces",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="table.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="boards"
        options={{
          title: "Boards",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
