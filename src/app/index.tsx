import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function App() {
  const lang = useLanguageStore((state) => state.lang);
  const switchlang = useLanguageStore((state) => state.switchLanguage);

  useEffect(() => {
    const interval = setTimeout(() => {
      router.replace("/private");
    }, 2000);

    return () => {
      clearTimeout(interval);
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <StatusBar style={"light"} />

      <Text className="text-secondary text-2xl font-bold">
        {t("welcome", lang)}
      </Text>
    </View>
  );
}
