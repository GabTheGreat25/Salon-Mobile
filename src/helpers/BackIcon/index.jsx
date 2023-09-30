import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const BUTTON_SIZE = 50;

export default function ({ navigateBack, textColor }) {
  return (
    <>
      <View className={`absolute top-4 z-[1000]`}>
        <TouchableOpacity onPress={navigateBack}>
          <Feather name="chevron-left" size={BUTTON_SIZE} color={textColor} />
        </TouchableOpacity>
      </View>
    </>
  );
}
