import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Input } from "@/shared/components/input";
import { useLanguageStore } from "@/store/i18n.store";
import { StatusBar } from "expo-status-bar";
import { BarcodeScannerModal } from "../components/BarcodeScannerModal";
import { SectionTitle } from "../components/SectionTitle";

export default function CreateProductScreen() {
  const { lang } = useLanguageStore();

  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [category, setCategory] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [unit, setUnit] = useState("Unidade");
  const [scannerVisible, setScannerVisible] = useState(false);

  const isPortuguese = lang === "pt";

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    console.log({
      name,
      barcode,
      category,
      purchasePrice,
      salePrice,
      stock,
      minimumStock,
      unit,
    });

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style={"dark"} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center border-b border-border bg-surface px-5 py-4">
          <Pressable
            onPress={() => router.back()}
            className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-green-50"
          >
            <Feather name="arrow-left" size={21} color="#063023" />
          </Pressable>

          <View className="flex-1">
            <Text className="text-xl font-bold text-primary">
              {isPortuguese ? "Novo produto" : "New product"}
            </Text>

            <Text className="mt-0.5 text-xs text-textSecondary">
              {isPortuguese
                ? "Cadastre um novo produto"
                : "Register a new product"}
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="px-5 pb-10 pt-6"
        >
          {/* Basic information */}
          <SectionTitle
            icon="package"
            title={
              isPortuguese ? "Informações do produto" : "Product information"
            }
          />

          <Input
            label={isPortuguese ? "Nome do produto" : "Product name"}
            placeholder={
              isPortuguese
                ? "Ex: Água Mineral 500ml"
                : "E.g. Mineral Water 500ml"
            }
            value={name}
            onChangeText={setName}
            required
          />

          {/* Barcode */}
          <View className="mt-5">
            <Text className="mb-2 text-sm font-semibold text-text">
              {isPortuguese ? "Código de barras" : "Barcode"}
            </Text>

            <View className="flex-row items-center rounded-2xl border border-border bg-surface px-4">
              <Feather name="maximize" size={20} color="#5F6B65" />

              <TextInput
                value={barcode}
                onChangeText={setBarcode}
                placeholder={isPortuguese ? "Digite o código" : "Enter barcode"}
                placeholderTextColor="#8A948F"
                keyboardType="numeric"
                className="ml-3 flex-1 py-4 text-base text-text"
              />

              <Pressable
                onPress={() => setScannerVisible(true)}
                className="ml-2 h-10 w-10 items-center justify-center rounded-xl bg-primary"
              >
                <Feather name="camera" size={19} color="#F2F2F2" />
              </Pressable>
            </View>

            <Text className="mt-2 text-xs text-textMuted">
              {isPortuguese
                ? "Você também pode ler o código usando a câmera."
                : "You can also scan the barcode using the camera."}
            </Text>
          </View>

          {/* Category */}
          <Input
            label={isPortuguese ? "Categoria" : "Category"}
            placeholder={isPortuguese ? "Ex: Bebidas" : "E.g. Drinks"}
            value={category}
            onChangeText={setCategory}
          />

          {/* Pricing */}
          <SectionTitle
            icon="tag"
            title={isPortuguese ? "Preços" : "Pricing"}
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label={isPortuguese ? "Preço de compra" : "Purchase price"}
                placeholder="0,00"
                value={purchasePrice}
                onChangeText={setPurchasePrice}
                keyboardType="decimal-pad"
              />
            </View>

            <View className="flex-1">
              <Input
                label={isPortuguese ? "Preço de venda" : "Sale price"}
                placeholder="0,00"
                value={salePrice}
                onChangeText={setSalePrice}
                keyboardType="decimal-pad"
                required
              />
            </View>
          </View>

          {/* Stock */}
          <SectionTitle
            icon="layers"
            title={isPortuguese ? "Stock" : "Inventory"}
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label={isPortuguese ? "Quantidade" : "Quantity"}
                placeholder="0"
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
              />
            </View>

            <View className="flex-1">
              <Input
                label={isPortuguese ? "Stock mínimo" : "Minimum stock"}
                placeholder="5"
                value={minimumStock}
                onChangeText={setMinimumStock}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Unit */}
          <View className="mt-5">
            <Text className="mb-2 text-sm font-semibold text-text">
              {isPortuguese ? "Unidade" : "Unit"}
            </Text>

            <View className="flex-row gap-2">
              {[
                isPortuguese ? "Unidade" : "Unit",
                isPortuguese ? "Kg" : "Kg",
                isPortuguese ? "Litro" : "Liter",
                isPortuguese ? "Caixa" : "Box",
              ].map((item) => {
                const selected = unit === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setUnit(item)}
                    className={`rounded-xl border px-4 py-3 ${
                      selected
                        ? "border-primary bg-primary"
                        : "border-border bg-surface"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        selected ? "text-white" : "text-text"
                      }`}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Save */}
          <Pressable
            onPress={handleSave}
            disabled={!name.trim()}
            className={`mt-8 items-center rounded-2xl py-4 ${
              name.trim() ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-base font-bold ${
                name.trim() ? "text-white" : "text-gray-500"
              }`}
            >
              {isPortuguese ? "Guardar produto" : "Save product"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="mt-3 items-center py-3"
          >
            <Text className="font-semibold text-textSecondary">
              {isPortuguese ? "Cancelar" : "Cancel"}
            </Text>
          </Pressable>
        </ScrollView>
        <BarcodeScannerModal
          visible={scannerVisible}
          onClose={() => setScannerVisible(false)}
          onScanned={(barcode) => {
            setBarcode(barcode);
            setScannerVisible(false);
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
