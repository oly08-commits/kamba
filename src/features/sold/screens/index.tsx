import { useLanguageStore } from "@/store/i18n.store";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProductRepository } from "@/features/produtcs/repositories/productRepository";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ReceiptService } from "../repositories/receiptService";
import { SaleRepository } from "../repositories/saleRepository";

interface CartProduct {
  id: number;
  barcode: string | null;
  name: string;
  price: number;
  quantity: number;
}

export default function SoldScreen() {
  const { lang } = useLanguageStore();

  const db = useSQLiteContext();

  const productRepository = new ProductRepository(db);
  const saleRepository = new SaleRepository(db);

  const [permission, requestPermission] = useCameraPermissions();

  const [products, setProducts] = useState<CartProduct[]>([]);

  const [scanning, setScanning] = useState(true);

  const [finishingSale, setFinishingSale] = useState(false);
  const [torch, setTorch] = useState(false);

  const total = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  // ==========================================
  // SCANNER
  // ==========================================

  const handleBarcodeScanned = async ({
    data,
    type,
  }: {
    data: string;
    type: string;
  }) => {
    if (!scanning || finishingSale) {
      return;
    }

    setScanning(false);

    try {
      const product = await productRepository.findByBarcode(data);

      // ========================================
      // PRODUTO NÃO ENCONTRADO
      // ========================================

      if (!product) {
        Alert.alert(
          lang === "pt" ? "Produto não encontrado" : "Product not found",

          lang === "pt"
            ? `Nenhum produto foi encontrado para o código:\n${data}`
            : `No product was found for barcode:\n${data}`,

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

        return;
      }

      // ========================================
      // PRODUTO INATIVO
      // ========================================

      if (product.ativo !== 1) {
        Alert.alert(
          lang === "pt" ? "Produto indisponível" : "Product unavailable",

          lang === "pt"
            ? `${product.nome} está desativado.`
            : `${product.nome} is inactive.`,

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

        return;
      }

      // ========================================
      // SEM ESTOQUE
      // ========================================

      if (product.estoque <= 0) {
        Alert.alert(
          lang === "pt" ? "Sem estoque" : "Out of stock",

          lang === "pt"
            ? `${product.nome} não possui estoque disponível.`
            : `${product.nome} is out of stock.`,

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

        return;
      }

      // ========================================
      // ADICIONAR AO CARRINHO
      // ========================================

      setProducts((current) => {
        const existing = current.find((item) => item.id === product.id);

        // Produto já está no carrinho
        if (existing) {
          // Não permitir quantidade acima do estoque
          if (existing.quantity >= product.estoque) {
            return current;
          }

          return current.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          );
        }

        // Produto novo
        return [
          ...current,
          {
            id: product.id,
            barcode: product.codigo_barras,
            name: product.nome,
            price: product.preco,
            quantity: 1,
          },
        ];
      });

      Alert.alert(
        lang === "pt" ? "Produto adicionado" : "Product added",

        `${product.nome}\n${product.preco.toFixed(2)} Kz`,

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
    } catch (error) {
      console.error("Erro ao procurar produto:", error);

      Alert.alert(
        lang === "pt" ? "Erro" : "Error",

        lang === "pt"
          ? "Não foi possível consultar o produto."
          : "Could not find the product.",

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
    }
  };

  // ==========================================
  // REMOVER PRODUTO
  // ==========================================

  const removeProduct = (id: number) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  // ==========================================
  // LIMPAR CARRINHO
  // ==========================================

  const clearCart = () => {
    setProducts([]);
  };

  // ==========================================
  // FINALIZAR VENDA
  // ==========================================

  const handleFinishSale = async () => {
    if (products.length === 0 || finishingSale) {
      return;
    }

    try {
      setFinishingSale(true);

      // Para evitar que o scanner continue
      setScanning(false);

      const result = await saleRepository.createSale({
        items: products.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
          price: product.price,
        })),

        desconto: 0,

        pagamento: {
          metodo: "dinheiro",
          valor: total,
        },
      });

      await ReceiptService.print(
        {
          saleId: result.saleId,
          date: new Date().toLocaleString("pt-AO"),

          items: products.map((product) => ({
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            subtotal: product.price * product.quantity,
          })),

          total,

          paymentMethod: "Dinheiro",
          paidAmount: total,
          change: 0,
        },
        {
          width: "80mm",
        },
      );

      Alert.alert(
        lang === "pt" ? "Venda concluída" : "Sale completed",

        lang === "pt"
          ? `Venda #${result.saleId}\nTotal: ${result.total.toFixed(2)} Kz`
          : `Sale #${result.saleId}\nTotal: ${result.total.toFixed(2)} Kz`,

        [
          {
            text: "OK",
            onPress: () => {
              setProducts([]);
              setScanning(true);
            },
          },
        ],
      );
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);

      Alert.alert(
        lang === "pt"
          ? "Não foi possível finalizar"
          : "Could not complete sale",

        error instanceof Error
          ? error.message
          : lang === "pt"
            ? "Ocorreu um erro ao finalizar a venda."
            : "An error occurred while completing the sale.",

        [
          {
            text: "OK",
            onPress: () => {
              setScanning(true);
            },
          },
        ],
      );
    } finally {
      setFinishingSale(false);
    }
  };

  // ==========================================
  // PERMISSÃO
  // ==========================================

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
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
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-6">
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

  // ==========================================
  // TELA
  // ==========================================

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      {/* CAMERA */}

      <View className="overflow-hidden rounded-b-3xl bg-primary">
        <View className="h-56">
          <CameraView
            style={{ flex: 1 }}
            enableTorch={torch}
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

          <View className="absolute inset-0 items-center justify-center gap-2">
            <Pressable onPress={() => setTorch(!torch)}>
              <Feather
                name={torch ? "sun" : "zap"}
                size={22}
                color={torch ? "#DBAA68" : "#FFFFFF"}
              />
            </Pressable>
            <View className="h-40 w-72 rounded-2xl border-2 border-secondary">
              <View className="absolute left-4 right-4 top-1/2 h-0.5 bg-secondary" />
            </View>
          </View>
        </View>
      </View>

      {/* PRODUTOS */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
      >
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
                        {product.barcode ?? "-"}
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

      {/* TOTAL */}

      <View className="mx-5 mt-6 rounded-3xl bg-primary p-4">
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
              disabled={finishingSale}
              className="rounded-xl bg-white/10 px-4 py-3 active:bg-white/20"
            >
              <Text className="font-semibold text-white">
                {lang === "pt" ? "Limpar" : "Clear"}
              </Text>
            </Pressable>
          )}
        </View>

        {/* FINALIZAR */}

        <Pressable
          disabled={products.length === 0 || finishingSale}
          onPress={handleFinishSale}
          className={`mt-5 items-center rounded-2xl py-4 ${
            products.length > 0 && !finishingSale
              ? "bg-secondary"
              : "bg-white/20"
          }`}
        >
          <Text
            className={`font-bold ${
              products.length > 0 && !finishingSale
                ? "text-primary"
                : "text-white/50"
            }`}
          >
            {finishingSale
              ? lang === "pt"
                ? "Finalizando..."
                : "Completing..."
              : lang === "pt"
                ? "Finalizar venda"
                : "Complete sale"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
