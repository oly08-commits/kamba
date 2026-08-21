import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
export function HomeHeader() {
  const { lang } = useLanguageStore();
  return (
    <View className="bg-primary w-full pt-6 min-h-32 flex-row items-center justify-between px-4">
      <Text className="text-white text-2xl"> {t("hello", lang)} </Text>

      <Pressable onPress={() => router.push("/private/settings")}>
        <Feather name="settings" color={colors.background} size={24} />
      </Pressable>
    </View>
  );
}
