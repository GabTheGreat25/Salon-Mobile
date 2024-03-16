import { TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function ({ name, color, toggle }) {
  return (
    <>
      <TouchableOpacity
        className="absolute z-[1000] right-5 top-4"
        onPress={toggle}
      >
        <Text selectable={false}>
          <Feather name={name} size={25} color={color} />
        </Text>
      </TouchableOpacity>
    </>
  );
}
