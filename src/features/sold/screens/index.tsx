import { useLanguageStore } from "@/store/i18n.store";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
  quantity: number;
}

export function SoldScreen() {
  const { lang } = useLanguageStore();

  const [permission, requestPermission] = useCameraPermissions();

  const [products, setProducts] = useState<Product[]>([]);

  const [scanning, setScanning] = useState(true);

  const total = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  const handleBarcodeScanned = ({
    data,
    type,
  }: {
    data: string;
    type: string;
  }) => {
    if (!scanning) return;

    // Evita múltiplas leituras consecutivas
    setScanning(false);

    console.log("Código:", data);
    console.log("Tipo:", type);

    /*
     * Aqui você pode consultar sua API:
     *
     * const product = await getProductByBarcode(data);
     *
     * Por enquanto vamos simular um produto.
     */

    const newProduct: Product = {
      id: Date.now().toString(),
      barcode: data,
      name: "Produto",
      price: 2500,
      quantity: 1,
    };

    setProducts((current) => {
      const existing = current.find((product) => product.barcode === data);

      if (existing) {
        return current.map((product) =>
          product.barcode === data
            ? {
                ...product,
                quantity: product.quantity + 1,
              }
            : product,
        );
      }

      return [...current, newProduct];
    });

    Alert.alert(
      lang === "pt" ? "Produto adicionado" : "Product added",
      `${data}`,
      [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => {
              setScanning(true);
            }, 500);
          },
        },
      ],
    );
  };

  const removeProduct = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  const clearCart = () => {
    setProducts([]);
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-textSecondary">
          {lang === "pt"
            ? "A verificar permissões..."
            : "Checking permissions..."}
        </Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
          <Text className="text-4xl">📷</Text>
        </View>

        <Text className="mt-6 text-center text-2xl font-bold text-primary">
          {lang === "pt" ? "Acesso à câmera" : "Camera access"}
        </Text>

        <Text className="mt-3 text-center text-base leading-6 text-textSecondary">
          {lang === "pt"
            ? "Precisamos de acesso à câmera para ler os códigos de barras dos produtos."
            : "We need camera access to scan product barcodes."}
        </Text>

        <Pressable
          onPress={requestPermission}
          className="mt-8 rounded-2xl bg-primary px-8 py-4 active:opacity-80"
        >
          <Text className="font-bold text-white">
            {lang === "pt" ? "Permitir câmera" : "Allow camera"}
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="overflow-hidden rounded-b-3xl bg-primary">
        <View className="h-52">
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: [
                "ean13",
                "ean8",
                "upc_a",
                "upc_e",
                "code128",
                "code39",
              ],
            }}
            onBarcodeScanned={scanning ? handleBarcodeScanned : undefined}
          />

          <View className="absolute inset-0 items-center justify-center">
            <View className="h-40 w-72 rounded-2xl border-2 border-secondary">
              <View className="absolute left-4 right-4 top-1/2 h-0.5 bg-secondary" />
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
      >
        {/* Products */}
        <View className="mt-7 px-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-text">
              {lang === "pt" ? "Produtos" : "Products"}
            </Text>

            <Text className="text-sm text-textSecondary">
              {products.length} {lang === "pt" ? "item(ns)" : "item(s)"}
            </Text>
          </View>

          {products.length === 0 ? (
            <View className="items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-10">
              <Text className="text-3xl">🛒</Text>

              <Text className="mt-3 text-center font-semibold text-text">
                {lang === "pt"
                  ? "Nenhum produto adicionado"
                  : "No products added"}
              </Text>

              <Text className="mt-1 text-center text-sm text-textSecondary">
                {lang === "pt"
                  ? "Leia um código de barras para adicionar um produto."
                  : "Scan a barcode to add a product."}
              </Text>
            </View>
          ) : (
            <View className="overflow-hidden rounded-2xl border border-border bg-surface">
              {products.map((product, index) => (
                <View key={product.id}>
                  <View className="flex-row items-center px-4 py-4">
                    <View className="mr-3 h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                      <Text className="text-xl">📦</Text>
                    </View>

                    <View className="flex-1">
                      <Text className="font-semibold text-text">
                        {product.name}
                      </Text>

                      <Text className="mt-1 text-xs text-textMuted">
                        {product.barcode}
                      </Text>

                      <Text className="mt-1 text-sm text-textSecondary">
                        {product.quantity} × {product.price.toFixed(2)} Kz
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="font-bold text-primary">
                        {(product.price * product.quantity).toFixed(2)} Kz
                      </Text>

                      <Pressable
                        onPress={() => removeProduct(product.id)}
                        className="mt-2"
                      >
                        <Text className="text-xs font-semibold text-error">
                          {lang === "pt" ? "Remover" : "Remove"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  {index < products.length - 1 && (
                    <View className="ml-4 h-px bg-border" />
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      {/* Total */}
      <View className="mx-5 mt-6 rounded-3xl bg-primary p-5">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-white/70">
              {lang === "pt" ? "Total da venda" : "Sale total"}
            </Text>

            <Text className="mt-1 text-3xl font-bold text-white">
              {total.toFixed(2)} Kz
            </Text>
          </View>

          {products.length > 0 && (
            <Pressable
              onPress={clearCart}
              className="rounded-xl bg-white/10 px-4 py-3 active:bg-white/20"
            >
              <Text className="font-semibold text-white">
                {lang === "pt" ? "Limpar" : "Clear"}
              </Text>
            </Pressable>
          )}
        </View>

        <Pressable
          disabled={products.length === 0}
          className={`mt-5 items-center rounded-2xl py-4 ${
            products.length > 0 ? "bg-secondary" : "bg-white/20"
          }`}
        >
          <Text
            className={`font-bold ${
              products.length > 0 ? "text-primary" : "text-white/50"
            }`}
          >
            {lang === "pt" ? "Finalizar venda" : "Complete sale"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
