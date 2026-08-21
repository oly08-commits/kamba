import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { StatusBar } from "expo-status-bar";

interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
}

const products: Product[] = [
  {
    id: "1",
    name: "Água Mineral",
    barcode: "5601234567890",
    price: 500,
    stock: 24,
  },
  {
    id: "2",
    name: "Refrigerante",
    barcode: "5609876543210",
    price: 1000,
    stock: 12,
  },
  {
    id: "3",
    name: "Sumo de Laranja",
    barcode: "5601112223334",
    price: 1500,
    stock: 8,
  },
  {
    id: "4",
    name: "Bolachas",
    barcode: "5605556667778",
    price: 750,
    stock: 3,
  },
];

export default function ProductsScreen() {
  const { lang } = useLanguageStore();

  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.barcode.includes(query),
    );
  }, [search]);

  const renderProduct = ({ item }: { item: Product }) => {
    const lowStock = item.stock <= 5;

    return (
      <Pressable
        onPress={() => console.log("Produto:", item.id)}
        className="mb-3 rounded-2xl border border-border bg-surface p-4 active:opacity-80"
      >
        <View className="flex-row items-center">
          {/* Icon */}
          <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
            <Feather name="package" size={25} color="#063023" />
          </View>

          {/* Information */}
          <View className="flex-1">
            <Text numberOfLines={1} className="text-base font-bold text-text">
              {item.name}
            </Text>

            <Text className="mt-1 text-xs text-textMuted">{item.barcode}</Text>

            <Text className="mt-2 text-base font-bold text-primary">
              {item.price.toFixed(2)} Kz
            </Text>
          </View>

          {/* Stock */}
          <View className="items-end">
            <View
              className={`rounded-full px-3 py-1 ${
                lowStock ? "bg-red-50" : "bg-green-50"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  lowStock ? "text-error" : "text-success"
                }`}
              >
                {item.stock} {lang === "pt" ? "em stock" : "in stock"}
              </Text>
            </View>

            <Feather
              name="chevron-right"
              size={20}
              color="#8A948F"
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style={"dark"} />

      {/* Header */}
      <View className="px-5 pt-5">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-primary">
              {t("products", lang)}
            </Text>

            <Text className="mt-1 text-sm text-textSecondary">
              {products.length}{" "}
              {lang === "pt" ? "produtos cadastrados" : "registered products"}
            </Text>
          </View>

          {/* Add */}
          <Pressable
            onPress={() => router.push("/private/produtcs/create")}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-primary active:opacity-80"
          >
            <Feather name="plus" size={24} color="#F2F2F2" />
          </Pressable>
        </View>

        {/* Search */}
        <View className="mt-6 flex-row items-center rounded-2xl border border-border bg-surface px-4">
          <Feather name="search" size={20} color="#8A948F" />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={
              lang === "pt" ? "Pesquisar produto..." : "Search product..."
            }
            placeholderTextColor="#8A948F"
            className="ml-3 flex-1 py-4 text-base text-text"
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x-circle" size={20} color="#8A948F" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Products */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-6 pb-10"
        ListEmptyComponent={
          <View className="items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-12">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
              <Feather name="package" size={30} color="#063023" />
            </View>

            <Text className="mt-4 text-lg font-bold text-text">
              {lang === "pt"
                ? "Nenhum produto encontrado"
                : "No products found"}
            </Text>

            <Text className="mt-2 text-center text-sm text-textSecondary">
              {search
                ? lang === "pt"
                  ? "Tente pesquisar por outro nome ou código."
                  : "Try another name or barcode."
                : lang === "pt"
                  ? "Adicione o seu primeiro produto."
                  : "Add your first product."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
