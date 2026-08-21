import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface EmptyStateProps {
  lang: string;
  search: string;
  onAdd: () => void;
}

export function EmptyState({ lang, search, onAdd }: EmptyStateProps) {
  return (
    <View className="items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-12">
      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
        <Feather name="package" size={30} color="#063023" />
      </View>

      <Text className="mt-4 text-center text-lg font-bold text-text">
        {search
          ? lang === "pt"
            ? "Nenhum produto encontrado"
            : "No products found"
          : lang === "pt"
            ? "Nenhum produto cadastrado"
            : "No products registered"}
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

      {!search && (
        <Pressable
          onPress={onAdd}
          className="mt-6 flex-row items-center rounded-xl bg-primary px-5 py-3"
        >
          <Feather name="plus" size={18} color="#fff" />

          <Text className="ml-2 font-bold text-white">
            {lang === "pt" ? "Adicionar produto" : "Add product"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
