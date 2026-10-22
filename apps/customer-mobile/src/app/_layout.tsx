import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DataProvider } from "../data";
import { colors } from "../components/ui";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DataProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerTintColor: colors.primary,
            headerStyle: { backgroundColor: colors.white },
            contentStyle: { backgroundColor: colors.wash },
            headerTitleStyle: { color: colors.ink },
            headerBackButtonDisplayMode: "minimal",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </DataProvider>
    </SafeAreaProvider>
  );
}
