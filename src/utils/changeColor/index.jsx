import { useColorScheme } from "nativewind";
import { Colors } from "../colors";

export default function () {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const { backgroundColor, textColor, shadowColor } = Colors[colorScheme];

  return { backgroundColor, textColor, colorScheme, toggleColorScheme, shadowColor };
}
