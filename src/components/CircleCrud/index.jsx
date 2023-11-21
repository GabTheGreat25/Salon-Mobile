import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { changeColor } from "@utils";

export default function (props) {
  const { icon, title, routeName, backgroundColor } = props;
  const navigation = useNavigation();
  const { textColor } = changeColor();

  const handlePress = () => {
    navigation.navigate(routeName);
  };

  return (
      <TouchableOpacity
        className={`flex-1 justify-center items-center text-center my-5`}
        onPress={handlePress}
      >
        <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: backgroundColor,
          }}
          className={`flex justify-center items-center rounded-full mb-[5px]`}
        >
          <Feather name={icon} size={24} color={textColor} />
        </View>
        <Text
          className={`text-base font-semibold`}
          style={{ color: textColor }}
        >
          {title}
        </Text>
      </TouchableOpacity>
  );
}
