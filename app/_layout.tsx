import React from "react";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  IconRegistry,
  BottomNavigation,
  BottomNavigationTab,
} from "@ui-kitten/components";
import { StatusBar } from "expo-status-bar";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { Stack } from "expo-router";

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <AuthProvider>
          <SafeAreaProvider>
            <StatusBar style="light" />

            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
          </SafeAreaProvider>
        </AuthProvider>
      </ApplicationProvider>
    </>
  );
}
