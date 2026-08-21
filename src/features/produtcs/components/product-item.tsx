import formatCurrency from "@/shared/format-currecy";
import { langs } from "@/shared/i18n";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Product } from "../types/product";

interface Props {
  lang: langs;
  item: Product;
  handleProductPress: (item: Product) => void;
}

export function ProductItem({ handleProductPress, item, lang }: Props) {
  const lowStock = item.estoque <= item.estoque_minimo;

  return (
    <Pressable
      onPress={() => handleProductPress(item)}
      className="mb-3 rounded-2xl border border-border bg-surface p-4 active:opacity-80"
    >
      <View className="flex-row items-center">
        {/* ÍCONE */}

        <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
          <Feather name="package" size={25} color="#063023" />
        </View>

        {/* INFORMAÇÕES */}

        <View className="flex-1">
          <Text numberOfLines={1} className="text-base font-bold text-text">
            {item.nome}
          </Text>

          <Text numberOfLines={1} className="mt-1 text-xs text-textMuted">
            {item.codigo_barras ||
              (lang === "pt" ? "Sem código de barras" : "No barcode")}
          </Text>

          <View className="mt-2 flex-row items-center">
            <Text className="text-base font-bold text-primary">
              {formatCurrency(item.preco)}
            </Text>

            {item.unit && (
              <Text className="ml-2 text-xs text-textMuted">/ {item.unit}</Text>
            )}
          </View>
        </View>

        {/* ESTOQUE */}

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
              {item.estoque} {lang === "pt" ? "em stock" : "in stock"}
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
}
