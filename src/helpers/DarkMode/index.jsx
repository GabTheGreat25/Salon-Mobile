import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RESOURCE } from "@constants";

export default function ({ name, color, toggle }) {
  return (
    <>
      <TouchableOpacity
        className="absolute z-[1000] right-5 top-5"
        onPress={toggle}
      >
        <Text selectable={false}>
          <Feather name={name} size={RESOURCE.NUMBER.FORTY} color={color} />
        </Text>
      </TouchableOpacity>
    </>
  );
}
