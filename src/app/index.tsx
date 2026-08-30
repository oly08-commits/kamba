import { assetsPath } from "@/shared/assets";
import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";

export default function App() {
  /* useEffect(() => {
    const interval = setTimeout(() => {
      router.replace("/private");
    }, 2000);

    return () => {
      clearTimeout(interval);
    };
  }, []);
 */
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-primary">
      <StatusBar style={"light"} />
      <Image source={assetsPath.logo} style={{ width: 90, height: 90 }} />
      <Text className="text-secondary text-2xl font-bold">KAMBA</Text>
    </View>
  );
}
