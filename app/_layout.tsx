import { SplashScreen, Stack } from "expo-router";
import { Appearance } from "react-native";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            animation: "fade_from_bottom",
            gestureEnabled: true,
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTitle: "Data plan",
            headerTitleStyle: {
              color: "#C0091E",
              fontWeight: "bold",
              fontSize: 20,
            },
          }}
        />
      </Stack>
      <StatusBar barStyle={"light-content"} />
    </SafeAreaProvider>
  );
}
