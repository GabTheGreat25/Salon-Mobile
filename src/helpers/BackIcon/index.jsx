import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RESOURCE } from "@constants";

export default function ({ navigateBack, textColor }) {
  return (
    <>
      <View className={`absolute top-4 z-[1000]`}>
        <TouchableOpacity onPress={navigateBack}>
          <Feather
            name="chevron-left"
            size={RESOURCE.NUMBER.FIFTY}
            color={textColor}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
