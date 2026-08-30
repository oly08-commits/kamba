import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { lang, switchLanguage } = useLanguageStore();

  const isPortuguese = lang === "pt";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerClassName=" pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-primary flex-row items-center gap-2">
          <Pressable onPress={() => router.back()}>
            <Feather name="chevron-left" color={colors.secondary} size={25} />
          </Pressable>
          <View className="pt-6 pb-8 pr-5">
            <Text className="text-3xl font-bold text-secondary">
              {t("settings", lang)}
            </Text>

            <Text className=" text-base text-textSecondary">
              {t("customizeExperience", lang)}
            </Text>
          </View>
        </View>

        {/* General */}
        <View className="mb-6 mt-3 px-5">
          <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-textMuted">
            {t("general", lang)}
          </Text>

          <View className="overflow-hidden rounded-2xl border border-border bg-surface">
            {/* Language */}
            <Pressable
              onPress={switchLanguage}
              className="flex-row items-center justify-between px-4 py-4 active:bg-green-50"
            >
              <View className="flex-row items-center">
                <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                  <Text className="text-lg">{isPortuguese ? "🇵🇹" : "🇬🇧"}</Text>
                </View>

                <View>
                  <Text className="text-base font-semibold text-text">
                    {t("language", lang)}
                  </Text>

                  <Text className="mt-1 text-sm text-textSecondary">
                    {isPortuguese ? "Português" : "English"}
                  </Text>
                </View>
              </View>

              <Text className="text-xl text-textMuted">›</Text>
            </Pressable>

            <View className="ml-4 h-px bg-border" />

            {/* Theme */}
            <Pressable className="flex-row items-center justify-between px-4 py-4 active:bg-green-50">
              <View className="flex-row items-center">
                <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-gold-50">
                  <Text className="text-lg">☀️</Text>
                </View>

                <View>
                  <Text className="text-base font-semibold text-text">
                    {t("theme", lang)}
                  </Text>

                  <Text className="mt-1 text-sm text-textSecondary">
                    {t("lightMode", lang)}
                  </Text>
                </View>
              </View>

              <Text className="text-xl text-textMuted">›</Text>
            </Pressable>
          </View>
        </View>

        {/* Account */}
        <View className="mb-6  px-5">
          <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-textMuted">
            {t("account", lang)}
          </Text>

          <View className="overflow-hidden rounded-2xl border border-border bg-surface">
            <Pressable
              onPress={() => router.replace("/private/profile")}
              className="flex-row items-center justify-between px-4 py-4 active:bg-green-50"
            >
              <View className="flex-row items-center">
                <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                  <Text className="text-lg">👤</Text>
                </View>

                <Text className="text-base font-semibold text-text">
                  {t("profile", lang)}
                </Text>
              </View>

              <Text className="text-xl text-textMuted">›</Text>
            </Pressable>

            <View className="ml-4 h-px bg-border" />

            <Pressable className="flex-row items-center justify-between px-4 py-4 active:bg-green-50">
              <View className="flex-row items-center">
                <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                  <Text className="text-lg">🔔</Text>
                </View>

                <Text className="text-base font-semibold text-text">
                  {t("notifications", lang)}
                </Text>
              </View>

              <Text className="text-xl text-textMuted">›</Text>
            </Pressable>
          </View>
        </View>

        {/* Information */}
        <View className="mb-6  px-5">
          <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-textMuted">
            {t("information", lang)}
          </Text>

          <View className="rounded-2xl border border-border bg-surface px-4">
            <Pressable className="flex-row items-center justify-between py-4">
              <Text className="text-base font-semibold text-text">
                {t("about", lang)}
              </Text>

              <Text className="text-xl text-textMuted">›</Text>
            </Pressable>

            <View className="h-px bg-border" />

            <Pressable className="flex-row items-center justify-between py-4">
              <Text className="text-base font-semibold text-text">
                {t("terms", lang)}
              </Text>

              <Text className="text-xl text-textMuted">›</Text>
            </Pressable>

            <View className="h-px bg-border" />

            <Pressable className="flex-row items-center justify-between py-4">
              <Text className="text-base font-semibold text-text">
                {t("privacy", lang)}
              </Text>

              <Text className="text-xl text-textMuted">›</Text>
            </Pressable>
          </View>
        </View>

        {/* Version */}
        <View className="items-center pt-4  px-5">
          <Text className="text-xs text-textMuted">
            {t("version", lang)} {Constants.expoConfig?.version}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
