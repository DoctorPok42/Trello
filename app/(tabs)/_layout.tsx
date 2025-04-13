import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dynamicBackgroundColor = useSelector((state: RootState) => state.color.activeColor);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          default: {
            position: "absolute",
            opacity: 1,
            borderTopWidth: 0,
            flex: 1,
            backgroundColor: dynamicBackgroundColor,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Start",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="cloud" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workspaces"
        options={{
          title: "All Workspaces",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="table" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="boards"
        options={{
          title: "All Boards",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.grid.2x2" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: "All Lists",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="list.bullet" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
