import colors from "@/theme/colos";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style={"dark"} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background, flex: 1 },
        }}
      />
    </>
  );
}
