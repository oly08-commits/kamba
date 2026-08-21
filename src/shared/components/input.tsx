import { Text, TextInput, View } from "react-native";

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  required = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  required?: boolean;
}) {
  return (
    <View className="mt-5">
      <Text className="mb-2 text-sm font-semibold text-text">
        {label}

        {required && <Text className="text-error"> *</Text>}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8A948F"
        keyboardType={keyboardType}
        className="rounded-2xl border border-border bg-surface px-4 py-4 text-base text-text"
      />
    </View>
  );
}
