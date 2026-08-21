import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { FastAcessItem } from "../components/falstAcess-item";
import { HomeHeader } from "../components/header";

export function HomeScreen() {
  const { lang } = useLanguageStore();

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />
      <HomeHeader />

      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pb-10"
        >
          {/* Quick Access */}
          <View className="mt-8">
            <Text className="mb-4 text-xl font-bold text-text">
              {t("quickAccess", lang)}
            </Text>

            <View className="flex-row flex-wrap gap-2 items-center">
              <FastAcessItem
                icon="shopping-cart"
                label={t("newSale", lang)}
                onPress={() => router.push("/private/sold")}
              />

              <FastAcessItem
                icon="package"
                label={t("products", lang)}
                onPress={() => router.push("/private/produtcs")}
              />

              <FastAcessItem
                icon="users"
                label={t("customers", lang)}
                onPress={() => console.log("Clientes")}
              />

              <FastAcessItem
                icon="bar-chart-2"
                label={t("reports", lang)}
                onPress={() => console.log("Relatórios")}
              />
            </View>
          </View>

          {/* Summary */}
          <View className="mt-8">
            <Text className="mb-4 text-xl font-bold text-text">
              {t("summary", lang)}
            </Text>

            <View className="flex-row gap-3">
              <View className="flex-1 rounded-2xl bg-primary p-4">
                <Text className="text-sm text-white/70">
                  {t("todaysSales", lang)}
                </Text>

                <Text className="mt-2 text-2xl font-bold text-white">0 Kz</Text>
              </View>

              <View className="flex-1 rounded-2xl bg-secondary p-4">
                <Text className="text-sm text-primary/70">
                  {t("products", lang)}
                </Text>

                <Text className="mt-2 text-2xl font-bold text-primary">0</Text>
              </View>
            </View>
          </View>

          {/* Recent sales */}
          <View className="mt-8">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-text">
                {t("recentSales", lang)}
              </Text>

              <Text className="text-sm font-semibold text-primary">
                {t("viewAll", lang)}
              </Text>
            </View>

            <View className="items-center rounded-2xl border border-dashed border-border bg-surface px-5 py-8">
              <Text className="text-3xl">🧾</Text>

              <Text className="mt-3 font-semibold text-text">
                {t("noSalesYet", lang)}
              </Text>

              <Text className="mt-1 text-center text-sm text-textSecondary">
                {lang === "pt"
                  ? "As suas vendas recentes aparecerão aqui."
                  : "Your recent sales will appear here."}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
