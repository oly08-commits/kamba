import { InitDatabase } from "@/databases/init";
import { assetsPath } from "@/shared/assets";
import colors from "@/theme/colos";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { Image, Text, View } from "react-native";
import "./global.css";

export default function RootLayout() {
  return (
    <Suspense fallback={<SuspenseComponent />}>
      <SQLiteProvider
        databaseName="kambaDb.db"
        onInit={InitDatabase}
        useSuspense
      >
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

function SuspenseComponent() {
  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <Image source={assetsPath.logo} style={{ width: 200, height: 200 }} />
      <Text className="text-secondary text-2xl font-bold">KAMBA</Text>
    </View>
  );
}
