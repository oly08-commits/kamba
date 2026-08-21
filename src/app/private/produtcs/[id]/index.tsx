import { ProductRepository } from "@/features/produtcs/repositories/productRepository";
import { Product } from "@/features/produtcs/types/product";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const db = useSQLiteContext();

  const productRepository = new ProductRepository(db);

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      if (!id) return;

      setLoading(true);

      const result = await productRepository.findById(Number(id));

      setProduct(result);
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#063023" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-5">
        <Text className="text-lg font-bold text-text">
          Produto não encontrado
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-xl bg-primary px-6 py-3"
        >
          <Text className="font-bold text-white">Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-6">
        <Text className="text-2xl font-bold text-primary">{product.nome}</Text>

        <Text className="mt-2 text-textSecondary">
          Código: {product.codigo_barras || "Sem código"}
        </Text>

        <View className="mt-6 rounded-2xl bg-surface p-5">
          <Text className="text-sm text-textSecondary">Preço de venda</Text>

          <Text className="mt-1 text-2xl font-bold text-primary">
            {product.preco.toFixed(2)} Kz
          </Text>

          <Text className="mt-5 text-sm text-textSecondary">Estoque</Text>

          <Text className="mt-1 text-xl font-bold text-text">
            {product.estoque} {product.unit ?? ""}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push(`/private/produtcs/${product.id}/edit`)}
          className="mt-6 items-center rounded-2xl bg-primary py-4"
        >
          <Text className="font-bold text-white">Editar produto</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
