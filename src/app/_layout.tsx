import { InitDatabase } from "@/databases/init";
import colors from "@/theme/colos";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { Text } from "react-native";
import "./global.css";

export default function RootLayout() {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <SQLiteProvider databaseName="kambaDb.db" onInit={InitDatabase}>
        <StatusBar style={"dark"} />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background, flex: 1 },
          }}
        />
      </SQLiteProvider>
    </Suspense>
  );
}
