import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function SectionTitle({
  icon,
  title,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
}) {
  return (
    <View className="mb-4 mt-7 flex-row items-center">
      <View className="mr-3 h-9 w-9 items-center justify-center rounded-xl bg-green-50">
        <Feather name={icon} size={18} color="#063023" />
      </View>

      <Text className="text-lg font-bold text-text">{title}</Text>
    </View>
  );
}
