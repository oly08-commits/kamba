import { InitDatabase } from "@/databases/init";
import { assetsPath } from "@/shared/assets";
import colors from "@/theme/colos";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar style={"light"} />
      <Suspense fallback={<SuspenseComponent />}>
        <SQLiteProvider
          databaseName="kambaDb.db"
          onInit={InitDatabase}
          useSuspense
        >
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background, flex: 1 },
            }}
          />
        </SQLiteProvider>
      </Suspense>
    </SafeAreaView>
  );
}

function SuspenseComponent() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-primary">
      <StatusBar style={"light"} />
      <Image source={assetsPath.logo} style={{ width: 90, height: 90 }} />
      <Text className="text-secondary text-2xl font-bold">KAMBA</Text>
    </View>
  );
}
