import { useColorScheme } from "nativewind";
import { Colors } from "../colors";

export default function () {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const { backgroundColor, textColor, borderColor, shadowColor } =
    Colors[colorScheme];

  return {
    backgroundColor,
    textColor,
    borderColor,
    shadowColor,
    colorScheme,
    toggleColorScheme,
  };
}
