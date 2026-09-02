import formatCurrency from "@/shared/format-currecy";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { Pressable, ScrollView, Text, View } from "react-native";
import { CartProduct } from "../types/sold";

interface Props {
  removeProduct: (id: number | string) => void;
  products: CartProduct[];
}

export const ListProdutsCart = ({ products, removeProduct }: Props) => {
  const lang = useLanguageStore((state) => state.lang);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-8"
    >
      <View className="mt-7 px-5">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-text">
            {t("products", lang)}
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
                      {product.quantity} × {formatCurrency(product.price)}
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
                        {t("remove", lang)}
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
  );
};
